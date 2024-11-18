package dto

type CancelLoanRequest struct {
	ReferenceId      string `mapstructure:"reference_id" json:"reference_id"`
	LoanId           string `mapstructure:"loan_id" json:"loan_id"`
	ConsumerId       string `mapstructure:"consumer_id" json:"consumer_id"`
	MerchantId       string `mapstructure:"merchant_id" json:"merchant_id"`
	CancellationTime string `mapstructure:"cancellation_time" json:"cancellation_time"`
}
