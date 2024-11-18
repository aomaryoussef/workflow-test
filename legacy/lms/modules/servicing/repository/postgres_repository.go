package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/btechlabs/lms-lite/pkg/uid"
	"github.com/lib/pq"

	"github.com/jmoiron/sqlx"

	"github.com/btechlabs/lms-lite/pkg/logging"

	"github.com/btechlabs/lms-lite/modules/servicing/domain"
	"github.com/btechlabs/lms-lite/pkg/money"
	libSql "github.com/btechlabs/lms-lite/pkg/sql"
)

const (
	InsertLoanCmd                = "INSERT INTO public.loan (id, new_loan_id, financial_product_key, financial_product_version, correlation_id, booked_at, created_at, created_by, consumer_id, merchant_global_id, commercial_offer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)"
	InsertLoanStatusCmd          = "INSERT INTO public.loan_status (loan_id, status, created_at) VALUES ($1, $2, $3)"
	InsertLoanPaymentScheduleCmd = `
		INSERT INTO public.loan_schedule
		  (loan_id, due_date, loan_balance, due_principal, due_interest, due_late_fee, grace_period_end_date, created_at, created_by)
		VALUES (:loan_id, :due_date, :loan_balance, :due_principal, :due_interest, :due_late_fee, :grace_period_end_date, :created_at, :created_by)`
	InsertEarlySettlementScheduleCmd = `
		INSERT INTO public.loan_schedule
		  (loan_id, due_date, loan_balance, grace_period_end_date, paid_date, due_principal, due_interest, due_late_fee, paid_principal, paid_interest, paid_late_fee, created_at, created_by, updated_at, updated_by, ref_id, is_cancelled)
		VALUES (:loan_id, :due_date, :loan_balance, :grace_period_end_date, :paid_date, :due_principal, :due_interest, :due_late_fee, :paid_principal, :paid_interest, :paid_late_fee, :created_at, :created_by, :updated_at, :updated_by, :ref_id, :is_cancelled)`

	SelectLoanCmd = `
		SELECT l.id, 
		       l.financial_product_key,
		       l.financial_product_version,
		       l.correlation_id,
		       l.booked_at,
		       l.created_at,
		       l.consumer_id,
		       l.merchant_global_id,
		       l.commercial_offer_id,
		       co.admin_fee
		FROM public.loan l
		LEFT JOIN commercial_offer co ON l.commercial_offer_id = co.id
		WHERE l.id = $1`
	SelectLoanStatusCmd = `
		SELECT status, created_at 
		FROM public.loan_status 
		WHERE loan_id = $1
	`
	SelectLoanPaymentScheduleCmd = `
		SELECT id, 
		       loan_id, 
		       due_date, 
		       loan_balance, 
		       grace_period_end_date, 
		       paid_date, 
		       due_principal, 
		       due_interest, 
		       due_late_fee, 
		       paid_principal, 
		       paid_interest, 
		       paid_late_fee, 
		       updated_at, 
		       updated_by, 
		       ref_id,
		       is_cancelled
		FROM public.loan_schedule WHERE loan_id = $1;`
	SelectLoansDueOnCmd = `
		 WITH latest_status AS (
			-- Get the latest status for each loan using rank() and using CTE
		    -- Never use sub-queries for this kind of query. It will be slow. 
			SELECT
				loan_id,
				status,
				rank() OVER (PARTITION BY loan_id ORDER BY created_at DESC) AS rnk
			FROM loan_status
			ORDER BY created_at DESC
		)
		SELECT l.id
		FROM public.loan l
		INNER JOIN public.loan_schedule lschd ON l.id = lschd.loan_id
		INNER JOIN latest_status sts ON l.id = sts.loan_id 
		                                    AND sts.rnk = 1 -- Only latest status
		                                    AND sts.status = 'ACTIVE' -- Only active loans
		WHERE lschd.due_date >= :time_start
		AND lschd.due_date <= :time_end
		AND lschd.is_cancelled IS FALSE 
	`
	BookCollectionOnLoanScheduleCmd = `
		UPDATE public.loan_schedule 
		SET paid_principal = :paid_principal, paid_interest = :paid_interest, 
		    paid_late_fee = :paid_late_fee, updated_at = :updated_at, 
		    updated_by = :updated_by, paid_date = :paid_date, 
		    ref_id = :ref_id 
		WHERE id = :id AND loan_id = :loan_id
		AND is_cancelled IS FALSE
	`
	InsertCommandCmd                    = "INSERT INTO public.command (command_type, consumer_id, correlation_id, created_at) VALUES ($1, $2, $3, $4) RETURNING id"
	InsertEntryCmd                      = "INSERT INTO public.entry (command_id, entry_type, amount) VALUES (:command_id, :entry_type, :amount)"
	SelectCommercialOfferByIdCmd        = "SELECT id, consumer_id, basket_id, financial_product_key, financial_product_version, tenure, admin_fee, financed_amount, total_amount, down_payment, monthly_instalment, interest_rate_per_tenure, annual_interest_percentage, consumer_accepted_at, merchant_acccepted_at FROM public.commercial_offer WHERE id = $1"
	SelectCommercialOffersByBasketIdCmd = "SELECT id, consumer_id, basket_id, financial_product_key, financial_product_version, tenure, admin_fee, financed_amount, total_amount, down_payment, monthly_instalment, interest_rate_per_tenure, annual_interest_percentage, consumer_accepted_at, merchant_acccepted_at FROM public.commercial_offer WHERE basket_id = $1"
	InsertCommercialOffer               = "INSERT INTO public.commercial_offer (id, consumer_id, basket_id, financial_product_key, financial_product_version, tenure, admin_fee, financed_amount, total_amount, down_payment, monthly_instalment, interest_rate_per_tenure, annual_interest_percentage, consumer_accepted_at, merchant_acccepted_at) VALUES (:id, :consumer_id, :basket_id, :financial_product_key, :financial_product_version,  :tenure, :admin_fee, :financed_amount, :total_amount, :down_payment, :monthly_instalment, :interest_rate_per_tenure, :annual_interest_percentage, :consumer_accepted_at, :merchant_acccepted_at)"
	SelectLoansForConsumerQuery         = `
		SELECT l.id,
					 l.financial_product_key,
					 l.financial_product_version, 
					 l.correlation_id, 
					 l.booked_at, 
					 l.created_at, 
					 l.consumer_id, 
					 l.merchant_global_id,
					 l.commercial_offer_id,
					 co.admin_fee,
					 lst.status AS loan_status,
					 lst.created_at AS loan_status_created_at,
					 ls.id AS loan_schedule_id,
					 ls.due_date AS loan_schedule_due_date,
					 ls.loan_balance AS loan_schedule_loan_balance,
					 ls.due_principal AS loan_schedule_due_principal,
					 ls.due_interest AS loan_schedule_due_interest,
					 ls.due_late_fee AS loan_schedule_due_late_fee,
					 ls.grace_period_end_date AS loan_schedule_grace_period_end_date,
					 ls.created_at AS loan_schedule_created_at,
					 ls.created_by AS loan_schedule_created_by,
					 ls.paid_date AS loan_schedule_paid_date,
					 ls.paid_principal AS loan_schedule_paid_principal,
					 ls.paid_interest AS loan_schedule_paid_interest,
					 ls.paid_late_fee AS loan_schedule_paid_late_fee,
					 ls.updated_at AS loan_schedule_updated_at,
					 ls.updated_by AS loan_schedule_updated_by,
					 ls.ref_id AS loan_schedule_ref_id,
					 ls.is_cancelled AS loan_schedule_cancelled
		FROM public.loan l
		INNER JOIN commercial_offer co ON l.commercial_offer_id = co.id
		INNER JOIN public.loan_schedule ls ON l.id = ls.loan_id
		INNER JOIN public.loan_status lst ON l.id = lst.loan_id
		WHERE l.consumer_id = $1`
	SelectLoansForMerchantQuery string = `
		SELECT
			l.id,
			l.financial_product_key,
			l.financial_product_version,
			l.correlation_id,
			l.booked_at,
			l.created_at,
			l.consumer_id,
			l.merchant_global_id,
			CASE WHEN mts.cancelled_for_disbursement IS TRUE THEN 'CANCELLED' ELSE 'CREATED' END AS transaction_status,
			mts.id AS transaction_id,
			CASE WHEN mts.cancelled_for_disbursement IS TRUE AND mp.status = 'PAID'
			  THEN 'PAYMENT_REVERSED'
			  ELSE
			    CASE WHEN mts.cancelled_for_disbursement IS TRUE AND mp.status IS NULL
			    	THEN 'PAYMENT_CANCELLED'
			      ELSE COALESCE(mp.status, 'PAYMENT_IN_PROCESS')
			    END
			END AS payment_status,
			l.commercial_offer_id,
			co.admin_fee
		FROM public.loan l
		LEFT JOIN commercial_offer co ON l.commercial_offer_id = co.id
		LEFT JOIN merchant_transaction_slip mts ON l.id = mts.loan_id
		LEFT JOIN merchant_payment mp ON mts.merchant_payment_id = mp.id
		WHERE l.merchant_global_id = $1
		AND ($2::VARCHAR(50)[] IS NULL OR ARRAY_LENGTH($2::VARCHAR(50)[], 1) IS NULL OR l.id = ANY($2::VARCHAR(50)[]))`
	CancelUnpaidSchedulesCmd = `
		UPDATE public.loan_schedule
		SET is_cancelled = TRUE, updated_at = :updated_at, updated_by = :updated_by
		WHERE loan_id = :loan_id
		AND is_cancelled IS FALSE
		AND id = ANY(:schedule_ids)
	`
)

type ServicingPostgresRepository struct {
	pg libSql.PgConnectionManager
}

func NewServicingPostgresRepository(pg libSql.PgConnectionManager) *ServicingPostgresRepository {
	return &ServicingPostgresRepository{
		pg: pg,
	}
}

func (s *ServicingPostgresRepository) CreateLoan(ctx context.Context, loan domain.Loan) (err error) {
	logger := logging.LogHandle.WithContext(ctx)

	tx := s.pg.ExtractTx(ctx)
	_, err = tx.Exec(InsertLoanCmd,
		loan.Id(),
		uid.New25CharRandomId(), // This is the new ID to be only added to the loan. It will NEVER be used in the existing model. Only for direct DB access.
		loan.FinancialProductKey(),
		loan.FinancialProductVersion(),
		loan.CorrelationId(),
		loan.BookedAt(),
		loan.CreatedAt(),
		loan.CreatedBy(),
		loan.ConsumerId(),
		loan.MerchantId(),
		loan.CommercialOfferId(),
		// don't save admin fee to loan directly!
	)
	if err != nil {
		logger.Errorf("Error PSQL insert for loan object %+v with message %s", loan, err)
		return err
	}

	currentStatus := loan.CurrentStatus()
	_, err = tx.Exec(InsertLoanStatusCmd,
		loan.Id(),
		currentStatus.StatusType(),
		loan.CreatedAt(),
	)
	if err != nil {
		logger.Errorf("Error PSQL insert for loan status %s for loan id %s with message %s",
			currentStatus.StatusType(), loan.Id(), err)
		return err
	}

	schedule := loan.PaymentSchedule()
	paymentScheduleMap := make([]map[string]interface{}, len(schedule.LineItems()))
	for i, ps := range schedule.LineItems() {
		row := make(map[string]interface{})

		balance := ps.LoanBalance()
		principalDue := ps.PrincipalDue()
		interestDue := ps.InterestDue()
		lateFeesDue := ps.LateFeeDue()

		row["loan_id"] = loan.Id()
		row["due_date"] = ps.InstalmentDueDateUTC()
		row["grace_period_end_date"] = ps.InstalmentDueDateUTC()

		row["loan_balance"] = balance.Units()
		row["due_principal"] = principalDue.Units()
		row["due_interest"] = interestDue.Units()
		row["due_late_fee"] = lateFeesDue.Units()
		row["created_at"] = loan.CreatedAt()
		row["created_by"] = loan.CreatedBy()

		paymentScheduleMap[i] = row
	}

	_, err = tx.NamedExec(InsertLoanPaymentScheduleCmd, paymentScheduleMap)
	if err != nil {
		logger.Errorf("Error PSQL insert for loan schedule, map %+v for loan id %s with message %s",
			paymentScheduleMap, loan.Id(), err)
		return err
	}

	return nil
}

func (s *ServicingPostgresRepository) GetLoan(ctx context.Context, id string) (loan *domain.Loan, err error) {
	tx := s.pg.ExtractTx(ctx)

	// LOAN TABLE
	rows, err := tx.QueryContext(ctx, SelectLoanCmd, id)
	if err != nil {
		return nil, err
	}
	if !rows.Next() {
		return nil, ErrNoLoanFound
	}

	lb := domain.LoanBuilder{}
	var adminFee *int64

	err = rows.Scan(&lb.Id, &lb.FinancialProductKey, &lb.FinancialProductVersion, &lb.CorrelationId, &lb.BookedAtUTC, &lb.CreatedAtUTC, &lb.ConsumerId, &lb.MerchantGlobalId, &lb.CommercialOfferId, &adminFee)
	if err != nil {
		return nil, err
	}
	rows.Close()

	if adminFee != nil {
		adminFeeMoney := money.NewMoney(uint64(*adminFee))
		lb.AdminFee = adminFeeMoney
	}

	// LOAN STATUS TABLE
	rows, err = tx.QueryContext(ctx, SelectLoanStatusCmd, id)
	if err != nil {
		return nil, err
	}

	for {
		if !rows.Next() {
			break
		}

		var status domain.LoanStatusType
		var createdAt time.Time

		err = rows.Scan(&status, &createdAt)
		if err != nil {
			return nil, err
		}

		lb.AddStatus(status, createdAt)
	}

	// PAYMENT SCHEDULE TABLE
	rows, err = tx.QueryContext(ctx, SelectLoanPaymentScheduleCmd, id)
	if err != nil {
		return nil, err
	}

	for {
		if !rows.Next() {
			break
		}
		var loanId string
		var dueDate, gracePeriodEndDate time.Time
		var paidDate, updatedAt *time.Time
		var updatedBy, refId *string
		var id, loanBalance, duePrincipal, dueInterest uint64
		var paidPrincipal, paidInterest, paidLateFee, dueLateFee *uint64
		var isCancelled bool

		err = rows.Scan(
			&id,
			&loanId,
			&dueDate,
			&loanBalance,
			&gracePeriodEndDate,
			&paidDate,
			&duePrincipal,
			&dueInterest,
			&dueLateFee,
			&paidPrincipal,
			&paidInterest,
			&paidLateFee,
			&updatedAt,
			&updatedBy,
			&refId,
			&isCancelled,
		)
		if err != nil {
			return nil, err
		}

		lb.AddScheduleEntry(
			id,
			dueDate,
			gracePeriodEndDate,
			paidDate,
			loanBalance,
			duePrincipal,
			dueInterest,
			paidPrincipal,
			paidInterest,
			paidLateFee,
			dueLateFee,
			updatedAt,
			updatedBy,
			refId,
			isCancelled,
		)

	}

	return lb.Build()
}

func (s *ServicingPostgresRepository) ListLoansDueOn(ctx context.Context, dueDateStart time.Time, dueDateEnd time.Time) (loanIds []string, err error) {
	tx := s.pg.ExtractTx(ctx)

	rows, err := tx.NamedQuery(SelectLoansDueOnCmd, map[string]interface{}{
		"time_start": dueDateStart,
		"time_end":   dueDateEnd,
	})

	if err != nil {
		return nil, err
	}

	var loanId *string
	for rows.Next() {
		err := rows.Scan(&loanId)

		if err != nil {
			return nil, err
		}

		loanIds = append(loanIds, *loanId)
	}

	return loanIds, nil
}

func (s *ServicingPostgresRepository) BookPayment(ctx context.Context, psi *domain.LoanPaymentScheduleLineItem, updatedBy string) (err error) {
	tx := s.pg.ExtractTx(ctx)

	row := make(map[string]interface{})

	row["id"] = psi.Id()
	row["loan_id"] = psi.LoanId()
	row["paid_principal"] = psi.PaidPrincipal().Units()
	row["paid_interest"] = psi.PaidInterest().Units()
	row["paid_late_fee"] = psi.PaidLateFee().Units()
	row["paid_date"] = psi.PaidDate()
	row["ref_id"] = psi.RefId()
	row["updated_at"] = time.Now().UTC()
	row["updated_by"] = updatedBy

	_, err = tx.NamedExec(BookCollectionOnLoanScheduleCmd, row)
	if err != nil {
		return
	}

	return
}

func (s *ServicingPostgresRepository) CancelLoan(ctx context.Context, loanId string, bookingTime time.Time) (err error) {
	tx := s.pg.ExtractTx(ctx)

	_, err = tx.Exec(InsertLoanStatusCmd, loanId, domain.LoanStatusCancelled, bookingTime)

	return err
}

func (s *ServicingPostgresRepository) InsertCommand(ctx context.Context, command domain.Command) (err error) {
	tx := s.pg.ExtractTx(ctx)

	var commandId int32
	err = tx.QueryRowx(InsertCommandCmd, command.Type, command.ConsumerId, command.CorrelationId, command.CreatedAt).Scan(&commandId)
	if err != nil {
		return err
	}

	entryMap := make([]map[string]interface{}, len(command.Entries))
	for i, entry := range command.Entries {
		entryMap[i] = map[string]interface{}{
			"command_id": commandId,
			"entry_type": entry.Type,
			"amount":     entry.Amount,
		}
	}

	_, err = tx.NamedExec(InsertEntryCmd, entryMap)
	if err != nil {
		return err
	}

	return nil
}

func (s *ServicingPostgresRepository) GetCommercialOfferById(ctx context.Context, id string) (offer *domain.CommercialOffer, err error) {
	tx := s.pg.ExtractTx(ctx)

	rows, err := tx.QueryContext(ctx, SelectCommercialOfferByIdCmd, id)
	if err != nil {
		return nil, err
	}

	if !rows.Next() {
		return nil, ErrNoCommercialOfferFound
	}

	offer, err = readNextCommercialOffer(rows)

	if err != nil {
		return nil, err
	}

	err = rows.Close()

	return offer, err
}

func (s *ServicingPostgresRepository) GetCommercialOffersByBasketId(ctx context.Context, basketId string) (offers []domain.CommercialOffer, err error) {
	tx := s.pg.ExtractTx(ctx)

	rows, err := tx.QueryContext(ctx, SelectCommercialOffersByBasketIdCmd, basketId)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		offer, err := readNextCommercialOffer(rows)
		if err != nil {
			return nil, err
		}

		offers = append(offers, *offer)
	}

	err = rows.Close()

	return offers, err
}

func (s *ServicingPostgresRepository) InsertCommercialOffers(ctx context.Context, offers []domain.CommercialOffer) (err error) {
	tx := s.pg.ExtractTx(ctx)

	offerMap := make([]map[string]interface{}, len(offers))
	for i, offer := range offers {
		row := make(map[string]interface{})

		row["id"] = offer.Id
		row["consumer_id"] = offer.ConsumerId
		row["basket_id"] = offer.BasketId
		row["financial_product_key"] = offer.FinancialProductKey
		row["financial_product_version"] = offer.FinancialProductVersion
		row["tenure"] = offer.Tenure
		row["admin_fee"] = offer.AdminFee.Units()
		row["financed_amount"] = offer.FinancedAmount.Units()
		row["total_amount"] = offer.TotalAmount.Units()
		row["down_payment"] = offer.DownPayment.Units()
		row["monthly_instalment"] = offer.MonthlyInstalment.Units()
		row["interest_rate_per_tenure"] = offer.InterestRatePerTenure
		row["annual_interest_percentage"] = offer.AnnualInterestPercentage
		row["consumer_accepted_at"] = offer.ConsumerAcceptedAt
		row["merchant_acccepted_at"] = offer.MerchantAcceptedAt

		offerMap[i] = row
	}

	_, err = tx.NamedExec(InsertCommercialOffer, offerMap)
	if err != nil {
		return err
	}

	return nil
}

func readNextCommercialOffer(rows *sql.Rows) (*domain.CommercialOffer, error) {
	offer := &domain.CommercialOffer{}
	var adminFee, financedAmount, totalAmount, downPayment, monthlyInstalment int64
	var consumerAcceptedAt, merchantAcceptedAt sql.NullTime

	err := rows.Scan(
		&offer.Id,
		&offer.ConsumerId,
		&offer.BasketId,
		&offer.FinancialProductKey,
		&offer.FinancialProductVersion,
		&offer.Tenure,
		&adminFee,
		&financedAmount,
		&totalAmount,
		&downPayment,
		&monthlyInstalment,
		&offer.InterestRatePerTenure,
		&offer.AnnualInterestPercentage,
		&consumerAcceptedAt,
		&merchantAcceptedAt)

	if err != nil {
		return nil, err
	}

	offer.AdminFee = money.NewMoney(uint64(adminFee))
	offer.FinancedAmount = money.NewMoney(uint64(financedAmount))
	offer.TotalAmount = money.NewMoney(uint64(totalAmount))
	offer.DownPayment = money.NewMoney(uint64(downPayment))
	offer.MonthlyInstalment = money.NewMoney(uint64(monthlyInstalment))

	if consumerAcceptedAt.Valid {
		offer.ConsumerAcceptedAt = &consumerAcceptedAt.Time
	}

	if merchantAcceptedAt.Valid {
		offer.MerchantAcceptedAt = &merchantAcceptedAt.Time
	}

	return offer, nil
}

func (s *ServicingPostgresRepository) GetAllLoansForConsumer(ctx context.Context, consumerId string) ([]*domain.Loan, error) {
	logger := logging.LogHandle.WithContext(ctx)
	tx := s.pg.GetTransaction()
	err := tx.Begin(ctx)
	if err != nil {
		logger.Errorf("Failed to start transaction for consumer %s with error %v", consumerId, err)
		return nil, err
	}

	defer func() {
		if err != nil {
			logger.Errorf("Error occurred: %v. Rolling back the transaction.", err)
			_ = tx.Rollback(ctx)
		}
	}()

	rows, err := tx.Query(ctx, SelectLoansForConsumerQuery, consumerId)
	if err != nil {
		logger.Errorf("Failed to get loans for consumer %s with error %v", consumerId, err)
		return nil, err
	}
	defer rows.Close()

	sqlResultArray := make([]map[string]interface{}, 0)
	for rows.Next() {
		row := make(map[string]interface{})
		rows.MapScan(row)
		sqlResultArray = append(sqlResultArray, row)
	}
	err = tx.Commit(ctx)
	if err != nil {
		logger.Errorf("Failed to commit transaction for consumer %s with error %v", consumerId, err)
		return nil, err
	}

	loanBuilderMap := make(map[string]*domain.LoanBuilder)
	for _, row := range sqlResultArray {
		loanBuilder, loanBuilderCreated := loanBuilderMap[row["id"].(string)]
		if !loanBuilderCreated {
			loanBuilder = &domain.LoanBuilder{}
			loanBuilderMap[row["id"].(string)] = loanBuilder
			loanBuilder.Id = row["id"].(string)
			loanBuilder.FinancialProductKey = row["financial_product_key"].(string)
			loanBuilder.FinancialProductVersion = row["financial_product_version"].(string)
			loanBuilder.CorrelationId = row["correlation_id"].(string)
			loanBuilder.BookedAtUTC = row["booked_at"].(time.Time)
			loanBuilder.CreatedAtUTC = row["created_at"].(time.Time)
			loanBuilder.ConsumerId = row["consumer_id"].(string)
			loanBuilder.MerchantGlobalId = row["merchant_global_id"].(string)
			loanBuilder.CommercialOfferId = row["commercial_offer_id"].(string)
			if row["admin_fee"] != nil {
				loanBuilder.AdminFee = money.NewMoney(uint64(row["admin_fee"].(int64)))
			}
			loanBuilder.Statuses = make([]domain.LoanStatus, 0)
		}

		loanBuilder.AddStatus(domain.LoanStatusType(row["loan_status"].(string)), row["loan_status_created_at"].(time.Time))

		loanScheduleId := row["loan_schedule_id"].(int64)
		loanScheduleDueDate := row["loan_schedule_due_date"].(time.Time)
		loanScheduleGracePeriodEndDate := row["loan_schedule_grace_period_end_date"].(time.Time)
		loanScheduleCancelled := row["loan_schedule_cancelled"].(bool)

		loanScheduleLoanBalance := uint64(row["loan_schedule_loan_balance"].(int64))
		loanScheduleDuePrincipal := uint64(row["loan_schedule_due_principal"].(int64))
		loanScheduleDueInterest := uint64(row["loan_schedule_due_interest"].(int64))
		loanScheduleDueLateFee := uint64(row["loan_schedule_due_late_fee"].(int64))

		var loanSchedulePaidDatePtr, loanScheduleUpdatedAtPtr *time.Time
		var loanScheduleUpdatedByPtr, loanScheduleRefIdPtr *string
		var loanSchedulePaidPrincipalPtr, loanSchedulePaidInterestPtr, loanSchedulePaidLateFeePtr *uint64
		if row["loan_schedule_paid_date"] != nil {
			loanSchedulePaidDate := row["loan_schedule_paid_date"].(time.Time)
			loanSchedulePaidDatePtr = &loanSchedulePaidDate
			loanSchedulePaidPrincipal := uint64(row["loan_schedule_paid_principal"].(int64))
			loanSchedulePaidPrincipalPtr = &loanSchedulePaidPrincipal
			loanSchedulePaidInterest := uint64(row["loan_schedule_paid_interest"].(int64))
			loanSchedulePaidInterestPtr = &loanSchedulePaidInterest
			loanSchedulePaidLateFee := uint64(row["loan_schedule_paid_late_fee"].(int64))
			loanSchedulePaidLateFeePtr = &loanSchedulePaidLateFee
			loanScheduleUpdatedAt := row["loan_schedule_updated_at"].(time.Time)
			loanScheduleUpdatedAtPtr = &loanScheduleUpdatedAt
			loanScheduleUpdatedBy := row["loan_schedule_updated_by"].(string)
			loanScheduleUpdatedByPtr = &loanScheduleUpdatedBy
			loanScheduleRefId := row["loan_schedule_ref_id"].(string)
			loanScheduleRefIdPtr = &loanScheduleRefId
		}

		loanBuilder.AddScheduleEntry(
			uint64(loanScheduleId),
			loanScheduleDueDate,
			loanScheduleGracePeriodEndDate,
			loanSchedulePaidDatePtr,
			loanScheduleLoanBalance,
			loanScheduleDuePrincipal,
			loanScheduleDueInterest,
			loanSchedulePaidPrincipalPtr,
			loanSchedulePaidInterestPtr,
			loanSchedulePaidLateFeePtr,
			&loanScheduleDueLateFee,
			loanScheduleUpdatedAtPtr,
			loanScheduleUpdatedByPtr,
			loanScheduleRefIdPtr,
			loanScheduleCancelled,
		)
	}

	loans := make([]*domain.Loan, 0)
	for _, loanBuilder := range loanBuilderMap {
		loan, err := loanBuilder.Build()
		if err != nil {
			logger.Errorf("Failed to build loan for consumer %s with error %v", consumerId, err)
			return nil, err
		}
		loans = append(loans, loan)
	}
	return loans, nil
}

func (s *ServicingPostgresRepository) getLoan(ctx context.Context, connection libSql.Connection, loanBuilder *domain.LoanBuilder) (*domain.Loan, error) {
	logger := logging.LogHandle.WithContext(ctx)

	//Get Loan Status
	if err := s.addLoanStatus(ctx, connection, loanBuilder); err != nil {
		return nil, err
	}

	// Get Loan Payment Schedule
	if err := s.addLoanPaymentSchedule(ctx, connection, loanBuilder); err != nil {
		return nil, err
	}

	loan, err := loanBuilder.Build()
	if err != nil {
		logger.Errorf("Failed to build loan for consumer %s with error %v", loanBuilder.ConsumerId, err)
		return nil, err
	}

	return loan, nil
}

func (s *ServicingPostgresRepository) addLoanStatus(ctx context.Context, connection libSql.Connection, loanBuilder *domain.LoanBuilder) error {
	logger := logging.LogHandle.WithContext(ctx)
	statusRows, err := connection.Query(ctx, SelectLoanStatusCmd, loanBuilder.Id)
	if err != nil {
		logger.Errorf("Failed to read loan status for consumer %s with error %v", loanBuilder.ConsumerId, err)
		return err
	}
	defer statusRows.Close()

	for statusRows.Next() {
		var status domain.LoanStatusType
		var createdAt time.Time

		err := statusRows.Scan(&status, &createdAt)
		if err != nil {
			logger.Errorf("Failed to read loan status for consumer %s with error %v", loanBuilder.ConsumerId, err)
			return err
		}

		loanBuilder.AddStatus(status, createdAt)
	}

	return nil
}

func (s *ServicingPostgresRepository) addLoanPaymentSchedule(ctx context.Context, connection libSql.Connection, loanBuilder *domain.LoanBuilder) error {
	logger := logging.LogHandle.WithContext(ctx)
	scheduleRows, err := connection.Query(ctx, SelectLoanPaymentScheduleCmd, loanBuilder.Id)
	if err != nil {
		logger.Errorf("Failed to read loan payment schedule for consumer %s with error %v", loanBuilder.ConsumerId, err)
		return err
	}
	defer func(scheduleRows *sqlx.Rows) {
		err := scheduleRows.Close()
		if err != nil {
			logger.Errorf("Failed to close loan payment schedule rows for consumer %s with error %v", loanBuilder.ConsumerId, err)
		}
	}(scheduleRows)

	for scheduleRows.Next() {
		var loanId string
		var dueDate, gracePeriodEndDate time.Time
		var paidDate, updatedAt *time.Time
		var id, loanBalance, duePrincipal, dueInterest uint64
		var paidPrincipal, paidInterest, paidLateFee, dueLateFee *uint64
		var updatedBy, refId *string
		var isCancelled bool

		err = scheduleRows.Scan(
			&id,
			&loanId,
			&dueDate,
			&loanBalance,
			&gracePeriodEndDate,
			&paidDate,
			&duePrincipal,
			&dueInterest,
			&dueLateFee,
			&paidPrincipal,
			&paidInterest,
			&paidLateFee,
			&updatedAt,
			&updatedBy,
			&refId,
			&isCancelled,
		)

		if err != nil {
			logger.Errorf("Failed to read loan payment schedule for consumer %s with error %v", loanBuilder.ConsumerId, err)
			return err
		}
		loanBuilder.AddScheduleEntry(
			id,
			dueDate,
			gracePeriodEndDate,
			paidDate,
			loanBalance,
			duePrincipal,
			dueInterest,
			paidPrincipal,
			paidInterest,
			paidLateFee,
			dueLateFee,
			updatedAt,
			updatedBy,
			refId,
			isCancelled,
		)
	}

	return nil
}

func (s *ServicingPostgresRepository) GetAllLoansForMerchant(ctx context.Context, merchantId string, loanIds []string) ([]*domain.MerchantLoan, error) {
	logger := logging.LogHandle.WithContext(ctx)
	tx := s.pg.GetTransaction()
	err := tx.Begin(ctx)
	if err != nil {
		logger.Errorf("Failed to start transaction for partner %s with error %v", merchantId, err)
		return nil, err
	}
	defer func() {
		if err != nil {
			logger.Errorf("Error occurred: %v. Rolling back the transaction.", err)
			_ = tx.Rollback(ctx)
		}
	}()

	var loans []*domain.MerchantLoan
	merchantLoansBuilders, err := s.getAllMerchantLoanBuilders(ctx, tx, merchantId, loanIds)

	if err != nil {
		logger.Errorf("Failed to get loans builder for merchant %s with error %v", merchantId, err)
		return nil, err
	}

	for _, loanBuilder := range merchantLoansBuilders {
		loan, err := s.getMerchantLoan(ctx, tx, loanBuilder)
		if err != nil {
			logger.Errorf("Failed to get_loan for merchant %s with error %v", merchantId, err)
			return nil, err
		}

		loans = append(loans, loan)
	}

	err = tx.Commit(ctx)
	if err != nil {
		logger.Errorf("Failed to commit transaction for merchant %s with error %v", merchantId, err)
		return nil, err
	}
	return loans, nil
}

func (s *ServicingPostgresRepository) getAllMerchantLoanBuilders(ctx context.Context, connection libSql.Connection, merchantId string, loanIds []string) ([]*domain.MerchantLoanBuilder, error) {
	logger := logging.LogHandle.WithContext(ctx)
	rows, err := connection.Query(ctx, SelectLoansForMerchantQuery, merchantId, fmt.Sprintf("{%s}", strings.Join(loanIds, ",")))

	if err != nil {
		logger.Errorf("Failed to get loans for merchant %s with error %v", merchantId, err)
		return nil, err
	}
	defer func(rows *sqlx.Rows) {
		err := rows.Close()
		if err != nil {
			logger.Errorf("Failed to close rows for merchant %s with error %v", merchantId, err)
		}
	}(rows)
	var merchantLoanBuilders []*domain.MerchantLoanBuilder
	for rows.Next() {
		lb := &domain.MerchantLoanBuilder{
			LoanBuilder: &domain.LoanBuilder{},
		}
		var adminFee uint64
		err := rows.Scan(&lb.Id, &lb.FinancialProductKey, &lb.FinancialProductVersion, &lb.CorrelationId, &lb.BookedAtUTC, &lb.CreatedAtUTC, &lb.ConsumerId, &lb.MerchantGlobalId, &lb.TransactionStatus, &lb.TransactionId, &lb.PaymentStatus, &lb.CommercialOfferId, &adminFee)
		if err != nil {
			logger.Errorf("Failed to read loan for merchant %s with error %v", merchantId, err)
			return nil, err
		}
		adminFeeMoney := money.NewMoney(adminFee)
		lb.AdminFee = adminFeeMoney

		merchantLoanBuilders = append(merchantLoanBuilders, lb)
	}
	return merchantLoanBuilders, nil
}

func (s *ServicingPostgresRepository) getMerchantLoan(ctx context.Context, connection libSql.Connection, loanBuilder *domain.MerchantLoanBuilder) (*domain.MerchantLoan, error) {
	logger := logging.LogHandle.WithContext(ctx)

	//Get Loan Status
	if err := s.addLoanStatus(ctx, connection, loanBuilder.LoanBuilder); err != nil {
		return nil, err
	}

	//Get Loan Payment status
	if err := s.addLoanPaymentSchedule(ctx, connection, loanBuilder.LoanBuilder); err != nil {
		return nil, err
	}

	loan, err := loanBuilder.Build()
	if err != nil {
		logger.Errorf("Failed to build loan for consumer %s with error %v", loanBuilder.ConsumerId, err)
		return nil, err
	}

	return loan, nil
}

func (s *ServicingPostgresRepository) EarlySettleLoan(ctx context.Context, loanId string, bookingTime time.Time, cancelledUnpaidSchedules []domain.LoanPaymentScheduleLineItem, newEarlyPaymentSchedule domain.LoanPaymentScheduleLineItem) (err error) {
	contextUserId := ctx.Value(logging.UserIdContextKey)
	logger := logging.
		LogHandle.
		WithContext(ctx).
		WithFields(map[string]string{
			"loan_id":                 loanId,
			"collection_process_type": "EARLY_SETTLEMENT_COLLECTION",
		})

	getIds := func(schedules []domain.LoanPaymentScheduleLineItem) []int32 {
		ids := make([]int32, 0)
		for _, schedule := range schedules {
			ids = append(ids, int32(schedule.Id()))
		}
		return ids
	}

	tx := s.pg.ExtractTx(ctx)
	_, err = tx.NamedExec(CancelUnpaidSchedulesCmd, map[string]interface{}{
		"loan_id":    loanId,
		"updated_at": bookingTime,
		"updated_by": contextUserId,
		"schedule_ids": pq.GenericArray{
			A: getIds(cancelledUnpaidSchedules),
		},
	})
	if err != nil {
		return err
	}

	logger.Debugf("cancelled unpaid schedules for loan %s", loanId)

	loanBalance := newEarlyPaymentSchedule.LoanBalance()
	duePrincipal := newEarlyPaymentSchedule.PrincipalDue()
	dueInterest := newEarlyPaymentSchedule.InterestDue()
	dueLateFee := newEarlyPaymentSchedule.LateFeeDue()
	paidPrincipal := newEarlyPaymentSchedule.PaidPrincipal()
	paidInterest := newEarlyPaymentSchedule.PaidInterest()
	paidLateFee := newEarlyPaymentSchedule.PaidLateFee()
	_, err = tx.NamedExec(InsertEarlySettlementScheduleCmd, map[string]interface{}{
		"loan_id":               loanId,
		"due_date":              newEarlyPaymentSchedule.InstalmentDueDateUTC(),
		"loan_balance":          loanBalance.UnitsOrZero(),
		"grace_period_end_date": newEarlyPaymentSchedule.GracePeriodEndDate(),
		"paid_date":             newEarlyPaymentSchedule.PaidDate(),
		"due_principal":         duePrincipal.UnitsOrZero(),
		"due_interest":          dueInterest.UnitsOrZero(),
		"due_late_fee":          dueLateFee.UnitsOrZero(),
		"paid_principal":        paidPrincipal.UnitsOrZero(),
		"paid_interest":         paidInterest.UnitsOrZero(),
		"paid_late_fee":         paidLateFee.UnitsOrZero(),
		"created_at":            bookingTime,
		"created_by":            contextUserId,
		"updated_at":            bookingTime,
		"updated_by":            contextUserId,
		"ref_id":                newEarlyPaymentSchedule.RefId(),
		"is_cancelled":          newEarlyPaymentSchedule.IsCancelled(),
	})
	if err != nil {
		return err
	}

	logger.Debugf("inserted new early payment schedule for loan %s", loanId)

	_, err = tx.Exec(InsertLoanStatusCmd,
		loanId,
		domain.LoanStatusEarlySettled,
		bookingTime,
	)
	if err != nil {
		return err
	}

	logger.Debugf("inserted new loan status for loan %s", loanId)

	return nil
}
