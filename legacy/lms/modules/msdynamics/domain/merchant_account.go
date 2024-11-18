package domain

type MerchantAccount struct {
	id                        string // example: "MERCH-0000000001"
	globalId                  string // example: "36 character guid"
	name                      string // example: "Sellentro cafe"
	group                     string // example: "MISC"
	currencyCode              string // example: "EGP"
	searchName                string // example: "Sellentro"
	salesTaxGroup             string // example: "None"
	withholdingTaxGroupCode   string // example: "0%"
	location                  string // example: "Egypt"
	streetNumber              string // example: "31"
	street                    string // example: "Mohamed Mahmoud Street"
	zipCode                   string // example: "11009"
	state                     string // example: "Alexandria"
	city                      string // example: "باكوس الاسكندريه"
	merchantBankName          string // example: "National Bank of Egypt"
	merchantBankAddress       string // example: "1187 Corniche El Nil, National Bank Tower, Boulak, Cairo, Egypt"
	merchantBankBranchName    string // example: "Headquarter"
	merchantBankSwiftCode     string // example: "878BDBBAFG56667"
	merchantBankIBAN          string // example: "AT000483212345864"
	merchantBankAccountNumber string // example: "437000000498943"
	taxRegistrationNumber     string // example: "123456789"
	beneficiaryBankName       string // example: "National Bank of Egypt"
	beneficiaryBankAddress    string // example: "1187 Corniche El Nil, National Bank Tower, Boulak, Cairo, Egypt"
}

func (m MerchantAccount) Id() string {
	return m.id
}
func (m MerchantAccount) GlobalId() string {
	return m.globalId
}
func (m MerchantAccount) Name() string {
	return m.name
}
func (m MerchantAccount) Group() string {
	return m.group
}
func (m MerchantAccount) CurrencyCode() string {
	return m.currencyCode
}
func (m MerchantAccount) SearchName() string {
	return m.searchName
}
func (m MerchantAccount) SalesTaxGroup() string {
	return m.salesTaxGroup
}
func (m MerchantAccount) WithholdingTaxGroupCode() string {
	return m.withholdingTaxGroupCode
}
func (m MerchantAccount) Location() string {
	return m.location
}
func (m MerchantAccount) StreetNumber() string {
	return m.streetNumber
}
func (m MerchantAccount) Street() string {
	return m.street
}
func (m MerchantAccount) ZipCode() string {
	return m.zipCode
}
func (m MerchantAccount) State() string {
	return m.state
}
func (m MerchantAccount) City() string {
	return m.city
}
func (m MerchantAccount) MerchantBankName() string {
	return m.merchantBankName
}
func (m MerchantAccount) MerchantBankAddress() string {
	return m.merchantBankAddress
}
func (m MerchantAccount) MerchantBankBranchName() string {
	return m.merchantBankBranchName
}
func (m MerchantAccount) MerchantBankSwiftCode() string {
	return m.merchantBankSwiftCode
}
func (m MerchantAccount) MerchantBankIBAN() string {
	return m.merchantBankIBAN
}
func (m MerchantAccount) MerchantBankAccountNumber() string {
	return m.merchantBankAccountNumber
}

func (m MerchantAccount) TaxRegistrationNumber() string {
	return m.taxRegistrationNumber
}

func (m MerchantAccount) BeneficiaryBankName() string {
	return m.beneficiaryBankName
}

func (m MerchantAccount) BeneficiaryBankAddress() string {
	return m.beneficiaryBankAddress
}

// BUILDER

type MerchantAccountBuilder struct {
	Id                        string `json:"MerchantAccount"`           // example: "MERCH-0000000003"
	GlobalId                  string `json:"MerchantGlobalID"`          // example: "36 character long"
	Name                      string `json:"MerchantName"`              // example: "Sellentro cafe"
	Group                     string `json:"MerchantGroup"`             // example: "MISC"
	CurrencyCode              string `json:"CurrencyCode"`              // example: "EGP"
	SearchName                string `json:"SearchName"`                // example: "Sellentro"
	SalesTaxGroup             string `json:"SalesTaxGroup"`             // example: "None"
	WithholdingTaxGroupCode   string `json:"WithholdingTaxGroupCode"`   // example: "0%"
	Location                  string `json:"Location"`                  // example: "Egypt"
	StreetNumber              string `json:"StreetNumber"`              // example: "31"
	Street                    string `json:"Street"`                    // example: "Mohamed Mahmoud Street"
	ZipCode                   string `json:"ZipCode"`                   // example: "11009"
	State                     string `json:"State"`                     // example: "Alexandria"
	City                      string `json:"City"`                      // example: "باكوس الاسكندريه"
	MerchantBankName          string `json:"MerchantBankName"`          // example: "National Bank of Egypt"
	MerchantBankAddress       string `json:"MerchantBankAddress"`       // example: "1187 Corniche El Nil, National Bank Tower, Boulak, Cairo, Egypt"
	MerchantBankBranchName    string `json:"MerchantBankBranchName"`    // example: "Headquarter"
	MerchantBankSwiftCode     string `json:"MerchantBankSwiftCode"`     // example: "878BDBBAFG56667"
	MerchantBankIBAN          string `json:"MerchantBankIBAN"`          // example: "AT000483212345864"
	MerchantBankAccountNumber string `json:"MerchantBankAccountNumber"` // example: "437000000498943"
	TaxRegistrationNumber     string `json:"TaxRegistrationNumber"`     // example: "123456789"
	BeneficiaryBankName       string `json:"BeneficiaryBankName"`       // example: "National Bank of Egypt"
	BeneficiaryBankAddress    string `json:"BeneficiaryBankAddress"`    // example: "1187 Corniche El Nil, National Bank Tower, Boulak, Cairo, Egypt"
}

func NewMerchantAccountBuilder() *MerchantAccountBuilder {
	return &MerchantAccountBuilder{}
}

func (m *MerchantAccountBuilder) Build() MerchantAccount {
	return MerchantAccount{
		id:                        m.Id,
		globalId:                  m.GlobalId,
		name:                      m.Name,
		group:                     m.Group,
		currencyCode:              m.CurrencyCode,
		searchName:                m.SearchName,
		salesTaxGroup:             m.SalesTaxGroup,
		withholdingTaxGroupCode:   m.WithholdingTaxGroupCode,
		location:                  m.Location,
		streetNumber:              m.StreetNumber,
		street:                    m.Street,
		zipCode:                   m.ZipCode,
		state:                     m.State,
		city:                      m.City,
		merchantBankName:          m.MerchantBankName,
		merchantBankAddress:       m.MerchantBankAddress,
		merchantBankBranchName:    m.MerchantBankBranchName,
		merchantBankSwiftCode:     m.MerchantBankSwiftCode,
		merchantBankIBAN:          m.MerchantBankIBAN,
		merchantBankAccountNumber: m.MerchantBankAccountNumber,
		taxRegistrationNumber:     m.TaxRegistrationNumber,
		beneficiaryBankName:       m.BeneficiaryBankName,
		beneficiaryBankAddress:    m.BeneficiaryBankAddress,
	}
}
