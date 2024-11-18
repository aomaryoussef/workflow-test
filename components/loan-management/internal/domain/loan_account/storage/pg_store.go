package storage

import (
	"context"
	"fmt"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/doug-martin/goqu/v9"
	"github.com/doug-martin/goqu/v9/exp"
	. "github.com/samber/lo"
	"strings"
)

func InsertNewLoanAccount(ctx context.Context, tx sql_driver.Tx, wm LoanAccountWriteModel) error {
	log := logging.WithContext(ctx)
	loanAccountRecord := goqu.Record{
		"id":                              wm.Id,
		"version":                         wm.Version,
		"created_at":                      wm.CreatedAt,
		"updated_at":                      wm.UpdatedAt,
		"created_by":                      wm.CreatedBy,
		"updated_by":                      wm.UpdatedBy,
		"updated_by_event_id":             wm.UpdatedByEventID,
		"state":                           wm.State,
		"sub_state":                       wm.SubState,
		"borrower_id":                     wm.BorrowerId,
		"borrower_repayment_day_of_month": wm.BorrowerRepaymentDayOfMonth,
		"commercial_offer_id":             wm.CommercialOfferId,
		"financial_product_id":            wm.FinancialProductId,
		"financial_product_tenor_key":     wm.FinancialProductTenorKey,
		"tenor_days":                      wm.TenorDays,
		"grace_period_in_days":            wm.GracePeriodInDays,
		"booked_at":                       wm.BookedAt,
		"merchant_id":                     wm.MerchantId,
		"lender_source":                   strings.ToLower(wm.LenderSource),
		"origination_channel":             strings.ToLower(wm.OriginationChannel),
		"applied_currency":                wm.AppliedCurrency,
		"fr_basis_points":                 wm.FlatRateBasisPoints,
		"monthly_effective_rate":          wm.MonthlyEffectiveRate,
		"total_effective_rate":            wm.TotalEffectiveRate,
		"annual_percent_rate":             wm.AnnualPercentageRate,
		"vat_basis_points":                wm.VatPercentageBasisPoints,
		"admin_fee_basis_points":          wm.AdminFeePercentageBasisPoints,
		"es_fee_basis_points":             wm.EarlySettlementFeeBasisPoints,
		"bd_allowance_basis_points":       wm.BadDebtFeeBasisPoints,
		"rounding_up_est_gain_units":      wm.RoundingUpEstimatedGainUnits,
	}
	// Insert loan_account wm
	sql, args, err := sql_driver.GoquPgDialect.
		Insert("loan_account").
		Rows(loanAccountRecord).
		ToSQL()
	if err != nil {
		return err
	}
	_, err = tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	log.Debug(fmt.Sprintf("inserted loan account wm record: %s", wm.Id))

	// Insert loan_account_monetary_line_items wm
	monetaryLineItems := Map(wm.MonetaryLineItems, func(lm LoanAccountMonetaryLineItemWriteModel, _ int) exp.Record {
		return goqu.Record{
			"loan_account_id": wm.Id,
			"amount_units":    lm.AmountUnits,
			"type":            lm.Type,
			"collection_type": lm.CollectionType,
		}
	})
	sql, args, err = sql_driver.GoquPgDialect.
		Insert("loan_account_monetary_line_item").
		Rows(monetaryLineItems).
		ToSQL()
	if err != nil {
		return err
	}
	_, err = tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	log.Debug(fmt.Sprintf("inserted %d loan monetary line item wm records: %s", len(monetaryLineItems), wm.Id))

	return nil
}

func ActivateLoanAccount(ctx context.Context, tx sql_driver.Tx, wm LoanAccountActivateWriteModel) error {
	log := logging.WithContext(ctx)

	sql, args, err := sql_driver.GoquPgDialect.
		Update("loan_account").
		Set(goqu.Record{
			"state":               wm.State,
			"sub_state":           wm.SubState,
			"loan_start_date":     wm.LoanStartDate,
			"loan_maturity_date":  wm.LoanMaturityDate,
			"version":             wm.Version,
			"updated_at":          wm.UpdatedAt,
			"updated_by":          wm.UpdatedBy,
			"updated_by_event_id": wm.UpdatedByEventID,
		}). // Activate
		Where(goqu.And(
			goqu.I("id").Eq(wm.Id),
			goqu.C("version").Eq(wm.Version-1),
		)).
		ToSQL()
	if err != nil {
		return err
	}
	commandTag, err := tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return sql_driver.ErrVersionMismatchOptimisticLocking
	}
	log.Debug(fmt.Sprintf("updated loan account wm record: %s with new state: %s and sub_state: %s", wm.Id, wm.State, wm.SubState))

	return nil
}

func UpdateLoanAccountEarlySettle(ctx context.Context, tx sql_driver.Tx, wm LoanAccountEarlySettleWriteModel) error {
	log := logging.WithContext(ctx)

	sql, args, err := sql_driver.GoquPgDialect.
		Update("loan_account").
		Set(goqu.Record{
			"state":               wm.State,
			"sub_state":           wm.SubState,
			"version":             wm.Version,
			"updated_at":          wm.UpdatedAt,
			"updated_by":          wm.UpdatedBy,
			"updated_by_event_id": wm.UpdatedByEventID,
		}). // Activate
		Where(goqu.And(
			goqu.I("id").Eq(wm.Id),
			goqu.C("version").Eq(wm.Version-1),
		)).
		ToSQL()
	if err != nil {
		return err
	}
	commandTag, err := tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return sql_driver.ErrVersionMismatchOptimisticLocking
	}
	log.Debug(fmt.Sprintf("updated loan account wm record: %s with new state: %s and sub_state: %s", wm.Id, wm.State, wm.SubState))

	return nil
}

func UpdateLoanAccountCancel(ctx context.Context, tx sql_driver.Tx, wm LoanAccountCancelWriteModel) error {
	log := logging.WithContext(ctx)

	sql, args, err := sql_driver.GoquPgDialect.
		Update("loan_account").
		Set(goqu.Record{
			"state":               wm.State,
			"sub_state":           wm.SubState,
			"version":             wm.Version,
			"updated_at":          wm.UpdatedAt,
			"updated_by":          wm.UpdatedBy,
			"updated_by_event_id": wm.UpdatedByEventID,
		}). // Activate
		Where(goqu.And(
			goqu.I("id").Eq(wm.Id),
			goqu.C("version").Eq(wm.Version-1),
		)).
		ToSQL()
	if err != nil {
		return err
	}
	commandTag, err := tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return sql_driver.ErrVersionMismatchOptimisticLocking
	}
	log.Debug(fmt.Sprintf("updated loan account wm record: %s with new state: %s and sub_state: %s", wm.Id, wm.State, wm.SubState))

	return nil
}

func UpsertEarlySettlementDetails(ctx context.Context, tx sql_driver.Tx, wm LoanAccountEarlySettlementDetailsWriteModel) error {
	log := logging.WithContext(ctx)

	updateRecord := goqu.Record{
		"loan_account_id":     wm.Id,
		"applied_currency":    wm.AppliedCurrency,
		"available":           wm.Available,
		"updated_by_event_id": wm.UpdatedByEventID,
	}
	if wm.Available {
		updateRecord["principal_due_units"] = wm.PrincipalDueUnits
		updateRecord["interest_receivable_units"] = wm.InterestReceivableUnits
		updateRecord["settlement_fee_units"] = wm.SettlementFeesDueUnits
	}

	sql, args, err := sql_driver.GoquPgDialect.
		Update("loan_account_early_settlement").
		Set(updateRecord).
		Where(goqu.And(
			goqu.I("loan_account_id").Eq(wm.Id),
		)).
		ToSQL()
	if err != nil {
		return err
	}
	commandTag, err := tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 1 {
		log.Debug(fmt.Sprintf("updated loan account early settlement wm record: %s with early settlement available: %t", wm.Id, wm.Available))
		return nil
	}

	// Insert if not updated
	// (usually this means the loan is activated and early settlement is not available)
	insertRecord := goqu.Record{
		"loan_account_id":     wm.Id,
		"applied_currency":    wm.AppliedCurrency,
		"available":           wm.Available,
		"updated_by_event_id": wm.UpdatedByEventID,
	}
	if wm.Available {
		insertRecord["principal_due_units"] = wm.PrincipalDueUnits
		insertRecord["interest_receivable_units"] = wm.InterestReceivableUnits
		insertRecord["settlement_fee_units"] = wm.SettlementFeesDueUnits
	}

	sql, args, err = sql_driver.GoquPgDialect.
		Insert("loan_account_early_settlement").
		Rows(insertRecord).
		ToSQL()
	if err != nil {
		return err
	}
	commandTag, err = tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 1 {
		log.Debug(fmt.Sprintf("inserted loan account early settlement wm record: %s with early settlement available: %t", wm.Id, wm.Available))
		return nil
	}

	return fmt.Errorf("failed to upsert early settlement details for loan account: %s", wm.Id)
}

func AddNewAmmortisationSchedule(ctx context.Context, tx sql_driver.Tx, wm LoanAccountAmmortisationWriteModel) error {
	log := logging.WithContext(ctx)

	ammortisationRecord := goqu.Record{
		"loan_account_id":            wm.LoanAccountId,
		"line_item_sequence":         wm.InstalmentNumber,
		"installment_due_date":       wm.InstalmentDueDate,
		"grace_period_ends_at":       wm.GracePeriodEndDate,
		"loan_balance_units":         wm.LoanBalanceUnits,
		"principal_due_units":        wm.PrincipalDue,
		"interest_due_units":         wm.InterestDue,
		"cumulative_interest_units":  wm.CumulativeInterest,
		"vat_due_units":              wm.VatDue,
		"admin_fee_due_units":        wm.AdminFeeDue,
		"penalty_due_units":          wm.PenaltyDue,
		"total_due_units":            wm.TotalInstalmentDue,
		"revenue_recognition_job_id": wm.RevenueRecognitionJobId,
		"canceled":                   wm.Canceled,
		"created_at":                 wm.CreatedAt,
	}
	// Insert loan_account_ammortisation_line_items wm
	sql, args, err := sql_driver.GoquPgDialect.
		Insert("loan_account_ammortisation_line_item").
		Rows(ammortisationRecord).
		ToSQL()
	if err != nil {
		return err
	}
	_, err = tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	log.Debug(fmt.Sprintf("inserted loan ammortisation wm record for loan_id: %s and instalment schedule: %d", wm.LoanAccountId, wm.InstalmentNumber))

	return nil
}

func CancelAmmortisationSchedule(ctx context.Context, tx sql_driver.Tx, wm LoanAccountAmmortisationCancelationWriteModel) (int64, error) {
	log := logging.WithContext(ctx)

	sql, args, err := sql_driver.GoquPgDialect.
		Update("loan_account_ammortisation_line_item").
		Set(goqu.Record{
			"canceled":        true,
			"canceled_at":     wm.CanceledAt,
			"canceled_reason": wm.CanceledReason,
		}).
		Where(
			goqu.C("loan_account_id").Eq(wm.LoanAccountId),
			goqu.C("line_item_sequence").Eq(wm.InstalmentNumber),
		).
		Returning("revenue_recognition_job_id").
		ToSQL()
	if err != nil {
		return -1, err
	}

	var scheduledJobIdToCancel int64
	err = tx.QueryRow(ctx, sql, args...).
		Scan(&scheduledJobIdToCancel)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to scan returned revenue_recognition_job_id after canceling ammortisation: %s", err.Error()))
		return 0, err
	}

	return scheduledJobIdToCancel, nil
}

func AddNewLoanAccountPayment(ctx context.Context, tx sql_driver.Tx, wm LoanAccountPaymentWriteModel) error {
	log := logging.WithContext(ctx)

	record := goqu.Record{
		"loan_account_id":                  wm.LoanAccountId,
		"payment_reference_id":             wm.PaymentReferenceId,
		"ammortisation_line_item_sequence": wm.AmmortisationLineItemNumber,
		"applied_currency":                 wm.AppliedCurrency,
		"paid_units":                       wm.PaidUnits,
		"booked_at":                        wm.BookedAt,
		"updated_by_event_id":              wm.UpdatedByEventID,
	}
	// Insert loan_account_ammortisation_line_items wm
	sql, args, err := sql_driver.GoquPgDialect.
		Insert("loan_account_payment").
		Rows(record).
		ToSQL()
	if err != nil {
		return err
	}
	_, err = tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	log.Debug(fmt.Sprintf("inserted loan acount payment wm record for loan_id: %s and instalment schedule: %d with paid units: %d", wm.LoanAccountId, wm.AmmortisationLineItemNumber, wm.PaidUnits))

	return nil
}

func GetLoanIdsForConsumer(ctx context.Context, tx sql_driver.Tx, consumerId string) ([]string, error) {

	sql, args, err := sql_driver.GoquPgDialect.
		Select("id").
		From("loan_account").
		Where(
			goqu.C("borrower_id").Eq(consumerId),
			goqu.C("state").In(pbevent.LoanAccountState_ACTIVE.String(), pbevent.LoanAccountState_ACTIVE_IN_ARREARS.String()),
		).
		ToSQL()
	if err != nil {
		return nil, err
	}

	rows, err := tx.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var loanIds = make([]string, 0)
	for rows.Next() {
		var loanId string
		err = rows.Scan(&loanId)
		if err != nil {
			return nil, err
		}
		loanIds = append(loanIds, loanId)
	}

	return loanIds, nil
}
