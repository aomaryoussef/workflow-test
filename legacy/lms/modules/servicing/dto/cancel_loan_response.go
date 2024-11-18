package dto

type CancelLoanResponse struct {
	LoanAmount                uint64 `json:"loan_amount"`
	LoanId                    string `mapstructure:"loan_id" json:"loan_id"`
	MerchantCancellableAmount int64  `json:"merchant_cancellable_amount"`
	MerchantAccountId         int    `json:"merchant_account_id"`
}
