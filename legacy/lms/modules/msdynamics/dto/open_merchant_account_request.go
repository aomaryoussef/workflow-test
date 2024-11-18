package dto

type OpenMerchantAccountRequest struct {
	LMSId                     int    `json:"lms_merchant_id" mapstructure:"lms_merchant_id"`                           // example: 1
	GlobalId                  string `json:"merchant_id" mapstructure:"merchant_id"`                                   // example: "36 characters long GUID"
	Name                      string `json:"merchant_name" mapstructure:"merchant_name"`                               // example: "Sellentro cafe"
	Group                     string `json:"merchant_group" mapstructure:"merchant_group"`                             // example: "MISC"
	CurrencyCode              string `json:"currency_code" mapstructure:"currency_code"`                               // example: "EGP"
	SearchName                string `json:"search_name" mapstructure:"search_name"`                                   // example: "Sellentro"
	SalesTaxGroup             string `json:"sales_tax_group" mapstructure:"sales_tax_group"`                           // example: "None"
	WithholdingTaxGroupCode   string `json:"withholding_tax_group_code" mapstructure:"withholding_tax_group_code"`     // example: "0%"
	Location                  string `json:"location" mapstructure:"location"`                                         // example: "Egypt"
	StreetNumber              string `json:"street_number" mapstructure:"street_number"`                               // example: "31"
	Street                    string `json:"street" mapstructure:"street"`                                             // example: "Mohamed Mahmoud Street"
	ZipCode                   string `json:"zip_code" mapstructure:"zip_code"`                                         // example: "11009"
	State                     string `json:"state" mapstructure:"state"`                                               // example: "Alexandria"
	City                      string `json:"city" mapstrucutre:"city"`                                                 // example: "باكوس الاسكندريه"
	MerchantBankName          string `json:"merchant_bank_name" mapstructure:"merchant_bank_name"`                     // example: "National Bank of Egypt"
	MerchantBankAddress       string `json:"merchant_bank_address" mapstructure:"merchant_bank_address"`               // example: "1187 Corniche El Nil, National Bank Tower, Boulak, Cairo, Egypt"
	MerchantBankBranchName    string `json:"merchant_bank_branch_name" mapstructure:"merchant_bank_branch_name"`       // example: "Headquarter"
	MerchantBankSwiftCode     string `json:"merchant_bank_swift_code" mapstructure:"merchant_bank_swift_code"`         // example: "878BDBBAFG56667"
	MerchantBankIBAN          string `json:"merchant_bank_iban" mapstructure:"merchant_bank_iban"`                     // example: "AT000483212345864"
	MerchantBankAccountNumber string `json:"merchant_bank_account_number" mapstructure:"merchant_bank_account_number"` // example: "437000000498943"
	TaxRegistrationNumber     string `json:"tax_registration_number" mapstructure:"tax_registration_number"`           // example: "123456789"
	BeneficiaryBankName       string `json:"beneficiary_bank_name" mapstructure:"beneficiary_bank_name"`               // example: "National Bank of Egypt"
	BeneficiaryBankAddress    string `json:"beneficiary_bank_address" mapstructure:"beneficiary_bank_address"`         // example: "1187 Corniche El Nil, National Bank Tower, Boulak, Cairo, Egypt"
}
