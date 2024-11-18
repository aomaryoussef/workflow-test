package domain

import "time"

type AggregatedLoanCancellationRecords struct {
	LoanCancellationRecords []*LoanCancellationRecord
}
type LoanCancellationRecord struct {
	MerchantTransactionSlipId         string     `db:"merchant_transaction_slip_id"`
	MerchantGlobalAccountId           string     `db:"merchant_global_account_id"`
	MerchantId                        int        `db:"merchant_id"`
	LoanId                            string     `db:"loan_id"`
	MerchantPaymentId                 *string    `db:"merchant_payment_id"`
	MerchantPaymentStatus             string     `db:"merchant_payment_status"`
	MerchantPaymentRequestCreatedDate *time.Time `db:"payment_request_created_date"`
	MerchantPaymentUnits              int64      `db:"payable_units"`
	MurabhaPurchaseCredit             int64      `db:"murabha_purchase_credit"`
	MerchantDueDebit                  int64      `db:"merchant_due_debit"`
	MurabhaPrincipalReceivableCredit  int64      `db:"murabha_principal_receivable_credit"`
	MurabhaPurchaseDebit              int64      `db:"murabha_purchase_debit"`
	MurabhaInterestReceivableCredit   int64      `db:"murabha_interest_receivable_credit"`
	MurabhaUnearnedRevenueDebit       int64      `db:"murabha_unearned_revenue_debit"`
	DoubtfulAllowanceCredit           int64      `db:"doubtful_allowance_credit"`
	DoubtfulAllowanceDebit            int64      `db:"doubtful_allowance_debit"`
	MerchantDueCredit                 int64      `db:"merchant_due_credit"`
	AdminFeeDebit                     int64      `db:"admin_fee_debit"`
	TaxDueDebit                       int64      `db:"tax_due_debit"`
}
