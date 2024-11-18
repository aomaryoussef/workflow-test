package dto

type EndOfDayLoanCancellationsAggregate struct {
	ReferenceId                           string                   `json:"reference_id" mapstructure:"reference_id"`
	StartTime                             string                   `json:"start_time" mapstructure:"start_time"`
	EndTime                               string                   `json:"end_time" mapstructure:"end_time"`
	StartTimeUTC                          string                   `json:"start_time_utc" mapstructure:"start_time_utc"`
	EndTimeUTC                            string                   `json:"end_time_utc" mapstructure:"end_time_utc"`
	TotalLoansCancelled                   int                      `json:"total_loans_cancelled" mapstructure:"total_loans_cancelled"`
	TotalLoansCancelledBeforeDisbursement int                      `json:"total_loans_cancelled_before_disbursement" mapstructure:"total_loans_cancelled_before_disbursement"`
	LoanCancellationRecords               []LoanCancellationRecord `json:"loan_cancellation_records" mapstructure:"loan_cancellation_records"`
}

type LoanCancellationRecord struct {
	MerchantTransactionSlipId         string  `json:"merchant_transaction_slip_id" mapstructure:"merchant_transaction_slip_id"`
	MerchantGlobalAccountId           string  `json:"merchant_global_account_id" mapstructure:"merchant_global_account_id"`
	MerchantAccountId                 int     `json:"merchant_account_id" mapstructure:"merchant_account_id"`
	LoanId                            string  `json:"loan_id" mapstructure:"loan_id"`
	MerchantPaymentId                 *string `json:"merchant_payment_id" mapstructure:"merchant_payment_id"`
	MerchantPaymentStatus             string  `json:"merchant_payment_status" mapstructure:"merchant_payment_status"`
	MerchantPaymentRequestCreatedDate *string `json:"payment_request_created_date" mapstructure:"payment_request_created_date"`
	MerchantPaymentUnits              int64   `json:"payable_units" mapstructure:"payable_units"`
	MurabhaPurchaseCredit             int64   `json:"murabha_purchase_credit" mapstructure:"murabha_purchase_credit"`
	MerchantDueDebit                  int64   `json:"merchant_due_debit" mapstructure:"merchant_due_debit"`
	MurabhaPrincipalReceivableCredit  int64   `json:"murabha_principal_receivable_credit" mapstructure:"murabha_principal_receivable_credit"`
	MurabhaPurchaseDebit              int64   `json:"murabha_purchase_debit" mapstructure:"murabha_purchase_debit"`
	MurabhaInterestReceivableCredit   int64   `json:"murabha_interest_receivable_credit" mapstructure:"murabha_interest_receivable_credit"`
	MurabhaUnearnedRevenueDebit       int64   `json:"murabha_unearned_revenue_debit" mapstructure:"murabha_unearned_revenue_debit"`
	DoubtfulAllowanceCredit           int64   `json:"doubtful_allowance_credit" mapstructure:"doubtful_allowance_credit"`
	DoubtfulAllowanceDebit            int64   `json:"doubtful_allowance_debit" mapstructure:"doubtful_allowance_debit"`
	MerchantDueCredit                 int64   `json:"merchant_due_credit" mapstructure:"merchant_due_credit"`
	AdminFeeDebit                     int64   `json:"admin_fee_debit" mapstructure:"admin_fee_debit"`
	TaxDueDebit                       int64   `json:"tax_due_debit" mapstructure:"tax_due_debit"`
}
