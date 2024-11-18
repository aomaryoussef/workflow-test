package repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"time"

	"github.com/btechlabs/lms-lite/modules/ga/domain"
	"github.com/btechlabs/lms-lite/pkg/logging"
	libSql "github.com/btechlabs/lms-lite/pkg/sql"
)

var _ GaRepository = (*GaPostgresRepository)(nil)

type GaPostgresRepository struct {
	pg libSql.PgConnectionManager
}

func NewGaPostgresRepository(pg libSql.PgConnectionManager) *GaPostgresRepository {
	return &GaPostgresRepository{
		pg: pg,
	}
}

func (j *GaPostgresRepository) GetMerchantTransactionSlipForLoan(ctx context.Context, loanId string) (mts *domain.MerchantTransactionSlip, err error) {
	tx := j.pg.ExtractTx(ctx)

	builder := domain.NewMerchantTransactionSlipBuilder()
	rows, err := tx.QueryContext(ctx, SelectTransactionSlipQuery, loanId)
	if err != nil {
		return nil, err
	}

	if !rows.Next() {
		return nil, fmt.Errorf("No merchant transaction slip found for loan %s!", loanId)
	}

	err = rows.Scan(
		&builder.Id,
		&builder.LoanId,
		&builder.MerchantAccountId,
		&builder.CreatedAt,
		&builder.UpdatedAt,
		&builder.CancelledForDisbursement,
	)

	if err != nil {
		return nil, err
	}

	if rows.Next() {
		return nil, fmt.Errorf("More than one merchant transaction slip found for loan id %s!", loanId)
	}

	result := builder.Build()
	err = rows.Close()
	return &result, err
}

func (j *GaPostgresRepository) InsertMerchantTransactionSlip(ctx context.Context, mts domain.MerchantTransactionSlip) error {
	payableAmount := mts.PayableAmount()
	tx := j.pg.ExtractTx(ctx)
	_, err := tx.Exec(
		InsertTransactionSlipCommand,
		mts.Id(),
		mts.LoanId(),
		mts.OrderNumber(),
		mts.MerchantAccountId(),
		payableAmount.Units(),
		payableAmount.Currency().Code,
		mts.BookingTime(),
		mts.NarrationComment(),
		mts.CreatedAt(),
	)

	return err
}

func (j *GaPostgresRepository) CancelMerchantDisbursementSlip(ctx context.Context, mts domain.MerchantTransactionSlip, bookingTime time.Time) error {
	tx := j.pg.ExtractTx(ctx)
	_, err := tx.Exec(CancelTransactionSlipSlipCommand, mts.Id(), bookingTime)
	return err
}

// AggregateMerchantPayments aggregates merchant payments within a specified time range.
// ctx: context.Context - Context for the function.
// input: AggregateMerchantPaymentsInput - Input parameters for the aggregation.
// ([]domain.MerchantPayment, error) - Slice of aggregated merchant payments and any error encountered.
func (j *GaPostgresRepository) AggregateMerchantPayments(ctx context.Context, input AggregateMerchantPaymentsInput) (res []domain.MerchantPayment, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Aggregate Merchant Payments from %v to %v", input.TimeStart, input.TimeEnd)
	tx := j.pg.GetTransaction()
	err = tx.Begin(ctx)
	if err != nil {
		logger.Errorf("Failed to start aggregate merchant payments transaction with error: %v", err)
		return nil, err
	}
	defer func() {
		if err != nil {
			logger.Errorf("Failed to aggregate merchant payments transaction with error: %v", err)
			_ = tx.Rollback(ctx)
		}
	}()

	rows, err := tx.Query(ctx, AggregateTransactionSlipsQuery, input.TimeStart, input.TimeEnd)
	if err != nil {
		logger.Errorf("Failed to run query %s with error: %v", AggregateTransactionSlipsQuery, err)
		return nil, err
	}
	aggregatedSlips := make([]domain.AggregatedMerchantTransactionSlip, 0)
	for rows.Next() {
		transactionSlip := domain.AggregatedMerchantTransactionSlip{}
		var transactionSlipIDs *pq.StringArray
		err = rows.Scan(
			&transactionSlip.MerchantAccountID,
			&transactionSlip.PayableCurrency,
			&transactionSlip.TotalUnits,
			&transactionSlipIDs,
		)
		if err != nil {
			logger.Errorf("Row scan failed with error %s", err)
			return nil, err
		}
		transactionSlip.TransactionSlipIDs = make([]string, len(*transactionSlipIDs))
		copy(transactionSlip.TransactionSlipIDs, *transactionSlipIDs)
		aggregatedSlips = append(aggregatedSlips, transactionSlip)
	}

	res = make([]domain.MerchantPayment, 0, len(aggregatedSlips))
	for _, aggregatedSlip := range aggregatedSlips {
		builder := domain.NewMerchantPaymentBuilder()
		Id := uuid.New()
		row := tx.QueryRow(ctx, InsertMerchantPaymentCommand, Id, input.CurrentTime, aggregatedSlip.TotalUnits, input.CurrentTime, aggregatedSlip.PayableCurrency, aggregatedSlip.MerchantAccountID)
		if err = row.Err(); err != nil {
			logger.Errorf("Failed to run query %s with error: %v", InsertMerchantPaymentCommand, err)
			return nil, err
		}
		err = row.Scan(&builder.Id, &builder.CreatedAt, &builder.Amount, &builder.TransactionDate, &builder.Currency, &builder.MerchantAccountId, &builder.SerialId)
		if err != nil {
			logger.Errorf("Row scan failed with error %v", err)
			return nil, err
		}

		res = append(res, builder.Build())
	}

	for index, value := range res {
		merchantPaymentId := value.Id()
		for _, transactionSlipID := range aggregatedSlips[index].TransactionSlipIDs {
			_, err = tx.Exec(ctx, UpdateTransactionSlipWithPaymentIdCommand, merchantPaymentId, transactionSlipID)
			if err != nil {
				logger.Errorf("Failed to run query %s with error: %v", UpdateTransactionSlipWithPaymentIdCommand, err)
				return nil, err
			}
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		logger.Errorf("Failed to commit aggregate merchant payments transaction with error: %v", err)
		return nil, err
	}

	logger.Infof("Aggregate Merchant Payments from %v to %v", input.TimeStart, input.TimeEnd)
	return
}

func (j *GaPostgresRepository) AggregateBooks(ctx context.Context, input AggregateEndOfDayInput) (res []domain.AccountBalanceChange, err error) {
	tx := j.pg.ExtractTx(ctx)
	logger := logging.LogHandle.WithContext(ctx)

	inputMap := map[string]interface{}{
		"time_start": input.TimeStart,
		"time_end":   input.TimeEnd,
	}

	rows, err := tx.NamedQuery(GetBooksAggregatedCommand, inputMap)
	if err != nil {
		logger.Errorf("Failed to run named query %s with error: %s", GetBooksAggregatedCommand, err)
		return nil, err
	}

	for rows.Next() {
		builder := domain.NewAccountBalanceChangeBuilder()

		err = rows.Scan(
			&builder.AccountName,
			&builder.TransactionType,
			&builder.BalanceChange,
		)

		if err != nil {
			logger.Errorf("Row scan failed with error %s", err)
			return nil, err
		}

		res = append(res, builder.Build())
	}

	return res, nil
}

func (j *GaPostgresRepository) ListJournalEntryIDs(ctx context.Context, input AggregateEndOfDayInput) (res []domain.JournalEntryForRead, err error) {
	tx := j.pg.ExtractTx(ctx)
	logger := logging.LogHandle.WithContext(ctx)

	inputMap := map[string]interface{}{
		"time_start": input.TimeStart,
		"time_end":   input.TimeEnd,
	}

	rows, err := tx.NamedQuery(ListJournalEntryIDsCommand, inputMap)
	if err != nil {
		logger.Errorf("Failed to run named query %s with error: %s", ListJournalEntryIDsCommand, err)
		return nil, err
	}

	for rows.Next() {
		builder := domain.NewJournalEntryForReadBuilder()

		err = rows.Scan(
			&builder.ID,
			&builder.TransactionType,
		)

		if err != nil {
			logger.Errorf("Row scan failed with error %s", err)
			return nil, err
		}

		res = append(res, builder.Build())
	}

	return res, nil
}

func (j *GaPostgresRepository) AggregateMerchantTransactionsAtEndOfDay(ctx context.Context, input AggregateEndOfDayInput) (res []domain.MerchantTransaction, err error) {
	tx := j.pg.ExtractTx(ctx)
	logger := logging.LogHandle.WithContext(ctx)

	inputMap := map[string]interface{}{
		"time_start": input.TimeStart,
		"time_end":   input.TimeEnd,
	}

	rows, err := tx.NamedQuery(AggregateMerchantTransactionsCommand, inputMap)
	if err != nil {
		logger.Errorf("Failed to run named query %s with error: %s", AggregateMerchantTransactionsCommand, err)
		return nil, err
	}

	for rows.Next() {
		builder := domain.NewMerchantTransactionBuilder()

		err = rows.Scan(
			&builder.MerchantGlobalId,
			&builder.MerchantId,
			&builder.Amount,
		)

		if err != nil {
			logger.Errorf("Row scan failed with error %s", err)
			return nil, err
		}

		res = append(res, builder.Build())
	}

	return res, nil
}

func (j *GaPostgresRepository) AggregateAdminFeesPerMerchantAtEndOfDay(ctx context.Context, input AggregateEndOfDayInput) (res []domain.MerchantTransaction, err error) {
	tx := j.pg.ExtractTx(ctx)
	logger := logging.LogHandle.WithContext(ctx)

	inputMap := map[string]interface{}{
		"time_start": input.TimeStart,
		"time_end":   input.TimeEnd,
	}

	rows, err := tx.NamedQuery(AggregateMerchantAdminFeesCommand, inputMap)
	if err != nil {
		logger.Errorf("Failed to run named query %s with error: %s", AggregateMerchantTransactionsCommand, err)
		return nil, err
	}

	for rows.Next() {
		builder := domain.NewMerchantTransactionBuilder()

		err = rows.Scan(
			&builder.MerchantGlobalId,
			&builder.MerchantId,
			&builder.Amount,
		)

		if err != nil {
			logger.Errorf("Row scan failed with error %s", err)
			return nil, err
		}

		res = append(res, builder.Build())
	}

	return res, nil
}

func (j *GaPostgresRepository) UpdateDisbursementStatus(ctx context.Context, input *domain.UpdateDisbursementStatusInput) error {
	logger := logging.LogHandle.WithContext(ctx)

	query := j.pg.GetQuery()
	logger.Debugf("Calling update disbursement sql command with params, %s, %s, %d", input.Status.String(), input.StatusTimestamp, input.MerchantPaymentId)
	res, err := query.Exec(ctx, UpdateMerchantPaymentStatusCommand, input.Status.String(), input.StatusTimestamp.UTC(), input.MerchantPaymentId)
	if err != nil {
		logger.Errorf("update disbursement status err: %v", err)
		return err
	}
	affectedRows, _ := res.RowsAffected()
	if affectedRows == 0 {
		err = errors.New("no rows affected")
		logger.Errorf("no rows updated: %v", err)
		return err
	}
	return nil
}

func (j *GaPostgresRepository) GetMerchantTransactionById(ctx context.Context, transactionId string) (*domain.MerchantTransactionSlip, error) {
	logger := logging.LogHandle.WithContext(ctx)
	query := j.pg.GetQuery()
	builder := domain.NewMerchantTransactionSlipBuilder()
	err := query.Get(ctx, builder, SelectMerchantTransactionSlipCommand, transactionId)
	if err != nil {
		logger.Errorf("Failed to get merchant transaction with error %s", err)
		return nil, err
	}
	transaction := builder.Build()
	logger.Infof("Got merchant transaction %s", transactionId)
	return &transaction, nil
}

func (j *GaPostgresRepository) AggregateCollectionsAtEndOfDay(ctx context.Context, input AggregateEndOfDayInput) (aggregate *dto.EndOfDayCollectionsAggregate, err error) {
	tx := j.pg.ExtractTx(ctx)
	inputMap := map[string]interface{}{
		"time_start": input.TimeStart,
		"time_end":   input.TimeEnd,
	}
	rows, err := tx.NamedQuery(SelectCollectionsAggregateCommand, inputMap)
	if err != nil {
		errMsg := fmt.Sprintf("ga_postgres_repository#AggregateCollectionsAtEndOfDay - failed to run named query %s with error: %s", SelectCollectionsAggregateCommand, err)
		return nil, errors.New(errMsg)
	}
	dataMap := make(map[string]interface{})
	for rows.Next() {
		err = rows.MapScan(dataMap)
		if err != nil {
			errMsg := fmt.Sprintf("ga_postgres_repository#AggregateCollectionsAtEndOfDay - row scan failed with error %v", err)
			return nil, errors.New(errMsg)
		}
	}

	regularCollectionDebitCustomerCollection := dataMap["regular_c_debit_customer_collections"]
	if regularCollectionDebitCustomerCollection == nil {
		regularCollectionDebitCustomerCollection = int64(0)
	}
	regularCollectionCreditPrincipalReceivable := dataMap["regular_c_credit_principal_receivable"]
	if regularCollectionCreditPrincipalReceivable == nil {
		regularCollectionCreditPrincipalReceivable = int64(0)
	}
	regularCollectionCreditInterestReceivable := dataMap["regular_c_credit_interest_receivable"]
	if regularCollectionCreditInterestReceivable == nil {
		regularCollectionCreditInterestReceivable = int64(0)
	}
	earlyCollectionDebitCustomerCollection := dataMap["early_c_debit_customer_collections"]
	if earlyCollectionDebitCustomerCollection == nil {
		earlyCollectionDebitCustomerCollection = int64(0)
	}
	earlyCollectionDebitSettlementAllowance := dataMap["early_c_debit_settlement_allowance"]
	if earlyCollectionDebitSettlementAllowance == nil {
		earlyCollectionDebitSettlementAllowance = int64(0)
	}
	earlyCollectionCreditPrincipalReceivable := dataMap["early_c_credit_principal_receivable"]
	if earlyCollectionCreditPrincipalReceivable == nil {
		earlyCollectionCreditPrincipalReceivable = int64(0)
	}
	earlyCollectionCreditInterestReceivable := dataMap["early_c_credit_interest_receivable"]
	if earlyCollectionCreditInterestReceivable == nil {
		earlyCollectionCreditInterestReceivable = int64(0)
	}
	earlyCollectionDebitUnearnedRevenue := dataMap["early_c_debit_unearned_revenue"]
	if earlyCollectionDebitUnearnedRevenue == nil {
		earlyCollectionDebitUnearnedRevenue = int64(0)
	}
	earlyCollectionCreditSettlementAllowance := dataMap["early_c_credit_settlement_allowance"]
	if earlyCollectionCreditSettlementAllowance == nil {
		earlyCollectionCreditSettlementAllowance = int64(0)
	}
	earlyCollectionCreditInterestRevenue := dataMap["early_c_credit_interest_revenue"]
	if earlyCollectionCreditInterestRevenue == nil {
		earlyCollectionCreditInterestRevenue = int64(0)
	}

	aggregate = dto.NewEndOfDayCollectionsAggregate(
		dto.WithRegularCollectionDebitCustomerCollection(regularCollectionDebitCustomerCollection.(int64)),
		dto.WithRegularCollectionCreditPrincipalReceivable(regularCollectionCreditPrincipalReceivable.(int64)),
		dto.WithRegularCollectionCreditInterestReceivable(regularCollectionCreditInterestReceivable.(int64)),

		dto.WithEarlyCollectionDebitCustomerCollection(earlyCollectionDebitCustomerCollection.(int64)),
		dto.WithEarlyCollectionDebitSettlementAllowance(earlyCollectionDebitSettlementAllowance.(int64)),
		dto.WithEarlyCollectionCreditPrincipalReceivable(earlyCollectionCreditPrincipalReceivable.(int64)),
		dto.WithEarlyCollectionCreditInterestReceivable(earlyCollectionCreditInterestReceivable.(int64)),

		dto.WithEarlyCollectionDebitUnearnedRevenue(earlyCollectionDebitUnearnedRevenue.(int64)),
		dto.WithEarlyCollectionCreditSettlementAllowance(earlyCollectionCreditSettlementAllowance.(int64)),
		dto.WithEarlyCollectionCreditInterestRevenue(earlyCollectionCreditInterestRevenue.(int64)),
	)
	aggregate.StartTime = input.TimeStart
	aggregate.EndTime = input.TimeEnd

	return aggregate, nil
}

func (j *GaPostgresRepository) AggregateLoanCancellationsAtEndOfDay(ctx context.Context, input AggregateEndOfDayInput) (aggregate *domain.AggregatedLoanCancellationRecords, err error) {
	tx := j.pg.ExtractTx(ctx)
	inputMap := map[string]interface{}{
		"time_start": input.TimeStart,
		"time_end":   input.TimeEnd,
	}

	aggregate = &domain.AggregatedLoanCancellationRecords{
		LoanCancellationRecords: make([]*domain.LoanCancellationRecord, 0),
	}

	rows, err := tx.NamedQuery(SelectLoanCancellationAggregateCommand, inputMap)
	for rows.Next() {
		lcr := domain.LoanCancellationRecord{}
		structScanErr := rows.StructScan(&lcr)
		if structScanErr != nil {
			return nil, structScanErr
		}
		aggregate.LoanCancellationRecords = append(aggregate.LoanCancellationRecords, &lcr)
	}
	return aggregate, nil
}

func (j *GaPostgresRepository) GetMerchantCancelledDisbursements(ctx context.Context, startTime string, endTime string) ([]map[string]interface{}, error) {
	tx := j.pg.ExtractTx(ctx)

	data := make([]map[string]interface{}, 0)
	inputMap := map[string]interface{}{
		"time_start": startTime,
		"time_end":   endTime,
	}

	rows, err := tx.NamedQuery(SelectMerchantCancelInvoicesCommand, inputMap)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		record := make(map[string]interface{})
		err = rows.MapScan(record)
		if err != nil {
			return nil, err
		}
		data = append(data, record)
	}

	return data, nil
}
