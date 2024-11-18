package domain

type FinancialProductIdentifier struct {
	ProductKey     string `mapstructure:"product_key" json:"product_key"`
	ProductVersion string `mapstructure:"product_version" json:"product_version"`
}
