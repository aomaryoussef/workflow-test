package dto

type SelectFinancialProductResponse struct {
	Products []SelectFinancialProductResponseItems `mapstructure:"products" json:"products"`
}

type SelectFinancialProductResponseItems struct {
	ProductKey     string `mapstructure:"product_key" json:"product_key"`
	ProductVersion string `mapstructure:"product_version" json:"product_version"`
}
