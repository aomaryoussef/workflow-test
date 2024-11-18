package usecase

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/btechlabs/lms-lite/pkg/logging"

	financialAccount "github.com/btechlabs/lms-lite/modules/financialaccount/usecase"
	"github.com/btechlabs/lms-lite/modules/ga/domain"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/modules/ga/repository"
)

type GaUseCase interface {
	BookLoanTransactionSlip(ctx context.Context, input dto.LoanTransactionRequest) (err error)
	CancelLoanTransactionSlip(ctx context.Context, input *dto.CancelLoanTransactionRequest) (err error)
	UpdateDisbursement(ctx context.Context, input dto.UpdateDisbursementStatusRequest) (err error)
	BookMerchantInvoices(ctx context.Context, input *dto.BookInvoicesRequest) (output *dto.BookInvoicesResponse, err error)
	EndOfDayAggregates(ctx context.Context, input *dto.EndOfDayAggregatesRequest) (output *dto.EndOfDayAggregatesResponse, err error)
	EndOfDayAggregatesCollection(ctx context.Context, input dto.EndOfDayAggregatesRequest) (aggregate *dto.EndOfDayCollectionsAggregate, err error)
	EndOfDayAggregatesLoanCancellation(ctx context.Context, input dto.EndOfDayAggregatesRequest) (aggregate *dto.EndOfDayLoanCancellationsAggregate, err error)
	GetTransactionDetails(ctx context.Context, transactionId string) (*domain.MerchantTransactionSlip, error)
	GetMerchantCancelledDisbursements(ctx context.Context, input dto.EndOfDayAggregatesRequest) (aggregate *dto.CancelledMerchantDisbursements, err error)
}

type gaUseCase struct {
	financialAccount financialAccount.FinancialAccountUseCase
	repo             repository.GaRepository
}

func NewGaUseCase(
	financialAccount financialAccount.FinancialAccountUseCase,
	repo repository.GaRepository,
) GaUseCase {
	return &gaUseCase{repo: repo, financialAccount: financialAccount}
}

func (u *gaUseCase) BookLoanTransactionSlip(ctx context.Context, input dto.LoanTransactionRequest) (err error) {
	// We are omitting the check on loan status
	// Because this task can only be executed after loan activation
	// When this changes (which it should not), please validate the
	// status of the loan here.
	// AGAIN, THIS SHOULD NOT CHANGE.

	merchantDisbursementSlip := domain.NewMerchantTransactionSlip(input)
	err = u.repo.InsertMerchantTransactionSlip(ctx, merchantDisbursementSlip)
	if err != nil {
		return err
	}

	return nil
}

func (u *gaUseCase) CancelLoanTransactionSlip(ctx context.Context, input *dto.CancelLoanTransactionRequest) (err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start cancel merchant transaction slip")

	slip, err := u.repo.GetMerchantTransactionSlipForLoan(ctx, input.LoanId)
	if err != nil {
		logger.Errorf("Failed to get merchant transaction slip for loan id %s with error %s", input.LoanId, err)
		return err
	}

	// check merchant id is connected to this loan (merchant_transaction_slip exists by loan_id <-> merchant_account_id pair)
	if slip.MerchantAccountId() != input.MerchantAccountId {
		return errors.New("MERCHANT_UNRELATED")
	}

	if !slip.IsCancelledForDisbursement() {
		slip.CancelForDisbursement()
		err = u.repo.CancelMerchantDisbursementSlip(ctx, *slip, input.BookingTime)
		if err != nil {
			logger.Errorf("Failed to update merchant transaction slip with error %s", err)
			return err
		}
	}

	logger.Infof("Finished cancel merchant transaction slip")
	return nil
}

func (u *gaUseCase) BookMerchantInvoices(ctx context.Context, input *dto.BookInvoicesRequest) (output *dto.BookInvoicesResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start merchant invoice aggregation")

	dateRangeStart, err := time.Parse(time.RFC3339, input.DateRangeStart)
	if err != nil {
		logger.Errorf("Failed to parse date range start %s as RFC3339 format with error: %s", input.DateRangeStart, err)
		return nil, err
	}
	dateRangeEnd, err := time.Parse(time.RFC3339, input.DateRangeEnd)
	if err != nil {
		logger.Errorf("Failed to parse date range end %s as RFC3339 format with error: %s", input.DateRangeEnd, err)
		return nil, err
	}

	logger.Infof("Processing merchant aggregation from %s to %s", input.DateRangeStart, input.DateRangeEnd)

	payments, err := u.repo.AggregateMerchantPayments(ctx, repository.AggregateMerchantPaymentsInput{
		TimeStart:        dateRangeStart,
		TimeEnd:          dateRangeEnd,
		CurrentTime:      time.Now(),
		IntegrationPoint: domain.DueIntegrationPoint,
		JournalName:      "TODO", //What should we put here? Not yet clarified by GA
		AccountType:      domain.VendorAccountType,
		Account:          "TODO", // global unique merchant id, not yet present in LMS
		InvoiceNumber:    "TODO", // What should we put here? Not yet clarified by GA
	})
	if err != nil {
		logger.Errorf("Failed to aggregate merchant payments with error: %s", err)
		return nil, err
	}

	logger.Infof("Aggregated %d merchants payments over the period", len(payments))

	responseItems := []*dto.BookInvoicesResponseItem{}
	for _, v := range payments {
		account, err := u.financialAccount.FindMerchantAccount(ctx, v.MerchantAccountId())
		if err != nil {
			logger.Fatalf("Data consistency error, merchant account %s can not be found but invoice would be disbursed for it!", v.MerchantAccountId())
			return nil, err
		}
		amount := v.Amount()
		item := dto.BookInvoicesResponseItem{
			Id:                v.SerialId(),
			MerchantGlobalId:  v.MerchantAccountId(),
			MerchantAccountId: account.Id,
			Amount:            amount,
			CurrencyCode:      "EGP",
		}
		responseItems = append(responseItems, &item)
	}

	return &dto.BookInvoicesResponse{
		Items: responseItems,
	}, nil
}

func (u *gaUseCase) EndOfDayAggregates(ctx context.Context, input *dto.EndOfDayAggregatesRequest) (output *dto.EndOfDayAggregatesResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start end of day aggregates")

	dateRangeStart, err := time.Parse(time.RFC3339, input.DateRangeStart)
	if err != nil {
		logger.Errorf("Failed to parse date range start %s as RFC3339 format with error: %s", input.DateRangeStart, err)
		return nil, err
	}
	dateRangeStart = dateRangeStart.UTC()
	dateRangeEnd, err := time.Parse(time.RFC3339, input.DateRangeEnd)
	if err != nil {
		logger.Errorf("Failed to parse date range end %s as RFC3339 format with error: %s", input.DateRangeEnd, err)
		return nil, err
	}
	dateRangeEnd = dateRangeEnd.UTC()

	logger.Infof("Processing end of day aggregation from %s to %s", input.DateRangeStart, input.DateRangeEnd)

	// aggregate all loans disbursed in between the given date range
	accountBalanceChanges, err := u.repo.AggregateBooks(ctx, repository.AggregateEndOfDayInput{
		TimeStart: dateRangeStart,
		TimeEnd:   dateRangeEnd,
	})

	if err != nil {
		logger.Errorf("Failed to summarize account balance changes with error %s", err)
		return nil, err
	}

	types := make(map[string][]dto.AccountBalanceChange)
	for _, account := range accountBalanceChanges {
		_, ok := types[account.TransactionType()]
		if !ok {
			types[account.TransactionType()] = []dto.AccountBalanceChange{}
		}

		types[account.TransactionType()] = append(types[account.TransactionType()], dto.AccountBalanceChange{
			AccountName:   account.AccountName(),
			BalanceChange: account.BalanceChange(),
		})
	}

	typeArray := make([]dto.TransactionTypeLine, 0, len(types))
	for k, v := range types {
		typeArray = append(typeArray, dto.TransactionTypeLine{
			Type:    k,
			Changes: v,
		})
	}
	logger.Infof("Summarized %d accounts for end of day report, mapped to %d transaction types", len(accountBalanceChanges), len(types))

	// load merchant transaction lines too
	merchantTransactions, err := u.repo.AggregateMerchantTransactionsAtEndOfDay(ctx, repository.AggregateEndOfDayInput{
		TimeStart: dateRangeStart,
		TimeEnd:   dateRangeEnd,
	})

	if err != nil {
		logger.Errorf("Failed to list merchant transactions for end of day with error %s", err)
		return nil, err
	}

	mtArray := make([]dto.MerchantTransactionLine, 0, len(merchantTransactions))
	for _, m := range merchantTransactions {
		mtArray = append(mtArray, dto.MerchantTransactionLine{
			MerchantId:       m.MerchantId(),
			MerchantGlobalId: m.MerchantGlobalId(),
			Amount:           m.Amount(),
		})
	}
	logger.Infof("Summarized %d merchant transactions for end of day", len(mtArray))

	// load merchant admin fee lines too
	merchantAdminFees, err := u.repo.AggregateAdminFeesPerMerchantAtEndOfDay(ctx, repository.AggregateEndOfDayInput{
		TimeStart: dateRangeStart,
		TimeEnd:   dateRangeEnd,
	})

	if err != nil {
		logger.Errorf("Failed to list merchant transactions for end of day with error %s", err)
		return nil, err
	}

	mtaArray := make([]dto.MerchantTransactionLine, 0, len(merchantAdminFees))
	for _, m := range merchantAdminFees {
		if m.Amount() == 0 {
			logger.Infof("Merchant %s's admin fee is 0, omitting from EOD journal", m.MerchantGlobalId())
			continue
		}
		mtaArray = append(mtaArray, dto.MerchantTransactionLine{
			MerchantId:       m.MerchantId(),
			MerchantGlobalId: m.MerchantGlobalId(),
			Amount:           m.Amount(),
		})
	}
	logger.Infof("Summarized %d merchant admin fees for end of day", len(mtaArray))

	// list journal entry IDs too
	journalEntryIDs, err := u.repo.ListJournalEntryIDs(ctx, repository.AggregateEndOfDayInput{
		TimeStart: dateRangeStart,
		TimeEnd:   dateRangeEnd,
	})

	if err != nil {
		logger.Errorf("Failed to list journal entry IDs for end of day with error %s", err)
		return nil, err
	}

	jeArray := make([]dto.JournalEntry, 0, len(journalEntryIDs))
	for _, j := range journalEntryIDs {
		jeArray = append(jeArray, dto.JournalEntry{
			Id:   j.ID(),
			Type: j.TransactionType(),
		})
	}

	logger.Infof("Listed %d journal entry IDs participating in end of day aggregates", len(jeArray))

	response := dto.EndOfDayAggregatesResponse{
		TransactionTypes:     typeArray,
		MerchantTransactions: mtArray,
		MerchantAdminFees:    mtaArray,
		JournalEntryIDs:      jeArray,
	}
	return &response, nil
}

func (u *gaUseCase) UpdateDisbursement(ctx context.Context, input dto.UpdateDisbursementStatusRequest) (err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Debugf("update disbursement status merchantPaymentId: %s, status: %s, statusTimestamp: %v", input.MerchantPaymentId, input.Status, input.StatusTimestamp)
	disbursementUpdateInput, err := domain.MapUpdateDisbursementStatusRequestToInput(&input)
	if err != nil {
		logger.Errorf("update disbursement status err: %v", err)
		return err
	}
	if disbursementUpdateInput.StatusTimestamp.IsZero() {
		err = fmt.Errorf("status timestamp is required")
		logger.Errorf("status_timestamp is not provided or parsed correctly: %v", err)
		return err
	}
	err = u.repo.UpdateDisbursementStatus(ctx, disbursementUpdateInput)
	if err != nil {
		logger.Errorf("update disbursement status err: %v", err)
		return err
	}
	return nil
}

func (u *gaUseCase) EndOfDayAggregatesCollection(ctx context.Context, input dto.EndOfDayAggregatesRequest) (aggregate *dto.EndOfDayCollectionsAggregate, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	dateRangeStart, err := time.Parse(time.RFC3339, input.DateRangeStart)
	if err != nil {
		logger.Errorf("ga_usecase#EndOfDayAggregatesCollection - failed to parse date range start %s as RFC3339 format with error: %s", input.DateRangeStart, err)
		return
	}
	dateRangeStart = dateRangeStart.UTC()
	dateRangeEnd, err := time.Parse(time.RFC3339, input.DateRangeEnd)
	if err != nil {
		logger.Errorf("ga_usecase#EndOfDayAggregatesCollection - failed to parse date range end %s as RFC3339 format with error: %s", input.DateRangeEnd, err)
		return
	}
	dateRangeEnd = dateRangeEnd.UTC()

	aggregate, err = u.repo.AggregateCollectionsAtEndOfDay(ctx, repository.AggregateEndOfDayInput{
		TimeStart: dateRangeStart,
		TimeEnd:   dateRangeEnd,
	})
	if err != nil {
		return
	}

	if !aggregate.IsBalanced() {
		errMsg := fmt.Sprintf("ga_usecase#EndOfDayAggregatesCollection - aggregate is not balanced for the time [%s, %s], something in journal not balanced, ask dev team", input.DateRangeStart, input.DateRangeEnd)
		err = errors.New(errMsg)
		return
	}

	return
}

func (u *gaUseCase) EndOfDayAggregatesLoanCancellation(ctx context.Context, input dto.EndOfDayAggregatesRequest) (aggregate *dto.EndOfDayLoanCancellationsAggregate, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	dateRangeStart, err := time.Parse(time.RFC3339, input.DateRangeStart)
	if err != nil {
		logger.Errorf("ga_usecase#EndOfDayAggregatesLoanCancellation - failed to parse date range start %s as RFC3339 format with error: %s", input.DateRangeStart, err)
		return
	}
	dateRangeStartUTC := dateRangeStart.UTC()
	dateRangeEnd, err := time.Parse(time.RFC3339, input.DateRangeEnd)
	if err != nil {
		logger.Errorf("ga_usecase#EndOfDayAggregatesLoanCancellation - failed to parse date range end %s as RFC3339 format with error: %s", input.DateRangeEnd, err)
		return
	}
	dateRangeEndUTC := dateRangeEnd.UTC()

	aggregatedLoanCancellationRecords, err := u.repo.AggregateLoanCancellationsAtEndOfDay(ctx, repository.AggregateEndOfDayInput{
		TimeStart: dateRangeStartUTC,
		TimeEnd:   dateRangeEndUTC,
	})

	if err != nil {
		return nil, err
	}

	aggregate = &dto.EndOfDayLoanCancellationsAggregate{
		StartTime:                             dateRangeStart.Format(time.RFC3339),
		EndTime:                               dateRangeEnd.Format(time.RFC3339),
		StartTimeUTC:                          dateRangeStartUTC.Format(time.RFC3339),
		EndTimeUTC:                            dateRangeEndUTC.Format(time.RFC3339),
		ReferenceId:                           input.ReferenceId,
		TotalLoansCancelled:                   len(aggregatedLoanCancellationRecords.LoanCancellationRecords),
		TotalLoansCancelledBeforeDisbursement: 0,
		LoanCancellationRecords:               make([]dto.LoanCancellationRecord, 0),
	}

	for _, record := range aggregatedLoanCancellationRecords.LoanCancellationRecords {
		lcr := dto.LoanCancellationRecord{
			MerchantTransactionSlipId:        record.MerchantTransactionSlipId,
			MerchantGlobalAccountId:          record.MerchantGlobalAccountId,
			MerchantAccountId:                record.MerchantId,
			LoanId:                           record.LoanId,
			MerchantPaymentId:                record.MerchantPaymentId,
			MerchantPaymentStatus:            record.MerchantPaymentStatus,
			MerchantPaymentUnits:             record.MerchantPaymentUnits,
			MurabhaPurchaseCredit:            record.MurabhaPurchaseCredit,
			MerchantDueDebit:                 record.MerchantDueDebit,
			MurabhaPrincipalReceivableCredit: record.MurabhaPrincipalReceivableCredit,
			MurabhaPurchaseDebit:             record.MurabhaPurchaseDebit,
			MurabhaInterestReceivableCredit:  record.MurabhaInterestReceivableCredit,
			MurabhaUnearnedRevenueDebit:      record.MurabhaUnearnedRevenueDebit,
			DoubtfulAllowanceCredit:          record.DoubtfulAllowanceCredit,
			DoubtfulAllowanceDebit:           record.DoubtfulAllowanceDebit,
			MerchantDueCredit:                record.MerchantDueCredit,
			AdminFeeDebit:                    record.AdminFeeDebit,
			TaxDueDebit:                      record.TaxDueDebit,
		}
		if record.MerchantPaymentRequestCreatedDate != nil {
			strDate := record.MerchantPaymentRequestCreatedDate.UTC().Format(time.RFC3339)
			lcr.MerchantPaymentRequestCreatedDate = &strDate
		}
		if record.MerchantPaymentStatus != domain.Paid.String() {
			aggregate.TotalLoansCancelledBeforeDisbursement += 1
		}

		aggregate.LoanCancellationRecords = append(aggregate.LoanCancellationRecords, lcr)
	}

	return aggregate, err
}

func (u *gaUseCase) GetTransactionDetails(ctx context.Context, transactionId string) (*domain.MerchantTransactionSlip, error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Getting transaction details for %s", transactionId)
	transactionSlip, err := u.repo.GetMerchantTransactionById(ctx, transactionId)
	if err != nil {
		logger.Errorf("Failed to get transaction details for %s with error %v", transactionId, err)
		return nil, err
	}
	return transactionSlip, nil
}

func (u *gaUseCase) GetMerchantCancelledDisbursements(ctx context.Context, input dto.EndOfDayAggregatesRequest) (aggregate *dto.CancelledMerchantDisbursements, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	dateRangeStart, err := time.Parse(time.RFC3339, input.DateRangeStart)
	if err != nil {
		logger.Errorf("Failed to parse date range start %s as RFC3339 format with error: %s", input.DateRangeStart, err)
		return nil, err
	}
	dateRangeEnd, err := time.Parse(time.RFC3339, input.DateRangeEnd)
	if err != nil {
		logger.Errorf("Failed to parse date range end %s as RFC3339 format with error: %s", input.DateRangeEnd, err)
		return nil, err
	}

	data, err := u.repo.GetMerchantCancelledDisbursements(
		ctx,
		fmt.Sprintf("%s+00", dateRangeStart.UTC().Format(time.DateTime)),
		fmt.Sprintf("%s+00", dateRangeEnd.UTC().Format(time.DateTime)),
	)
	if err != nil {
		logger.Errorf("ga_usecase#GetMerchantCancelledDisbursements - failed to get cancelled merchant disbursements with error %v", err)
		return nil, err
	}
	aggregate = &dto.CancelledMerchantDisbursements{
		ReferenceId:                          input.ReferenceId,
		StartTime:                            dateRangeStart,
		EndTime:                              dateRangeEnd,
		CancelledMerchantDisbursementRecords: make([]dto.CancelledMerchantDisbursementRecord, 0),
	}

	for _, record := range data {
		aggregate.CancelledMerchantDisbursementRecords = append(aggregate.CancelledMerchantDisbursementRecords, dto.CancelledMerchantDisbursementRecord{
			MerchantGlobalAccountId: record["merchant_global_account_id"].(string),
			MerchantAccountId:       record["merchant_account_id"].(int64),
			PayableUnits:            record["payable_units"].(int64),
		})
	}

	return aggregate, nil
}
