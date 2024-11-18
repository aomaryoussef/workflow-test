package dto

type LoadFinancialProductRequest struct {
	SelectedFinancialProducts []SelectFinancialProductResponseItems `json:"selected_financial_products" mapstructure:"selected_financial_products"`
}
