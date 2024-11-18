package dto

type MerchantDisbursementLine struct {
	InvoiceId         int    `json:"id" mapstructure:"id"`
	MerchantAccountId int    `json:"merchant_account_id" mapstructure:"merchant_account_id"`
	Amount            int64  `json:"amount" mapstructure:"amount"`
	CurrencyCode      string `json:"currency_code" mapstructure:"currency_code"`
	MerchantGlobalId  string `json:"merchant_global_id" mapstructure:"merchant_global_id"`
}

type NewMerchantInvoicesRequest struct {
	InvoiceDate           string                     `json:"invoice_date" mapstructure:"invoice_date"`
	DisbursementStartTime string                     `json:"date_range_start" mapstructure:"date_range_start"`
	DisbursementEndTime   string                     `json:"date_range_end" mapstructure:"date_range_end"`
	MerchantDisbursements []MerchantDisbursementLine `json:"merchant_disbursements" mapstructure:"merchant_disbursements"`
}
