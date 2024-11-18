package dto

type BookInvoicesResponse struct {
	Items []*BookInvoicesResponseItem `json:"merchant_disbursements" mapstructure:"merchant_disbursements"`
}

type BookInvoicesResponseItem struct {
	Id                int    `json:"id" mapstructure:"id"`
	MerchantAccountId int    `json:"merchant_account_id" mapstructure:"merchant_account_id"`
	Amount            int64  `json:"amount" mapstructure:"amount"`
	CurrencyCode      string `json:"currency_code" mapstructure:"currency_code"`
	MerchantGlobalId  string `json:"merchant_global_id" mapstructure:"merchant_global_id"`
}
