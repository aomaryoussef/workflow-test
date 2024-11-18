package dto

type NewMerchantInvoicesResponse struct {
	RequestNumber    string   `json:"correlation_id" mapstructure:"correlation_id"`
	InsertedInvoices []string `json:"inserted_invoice_ids" mapstructure:"inserted_invoice_ids"`
}
