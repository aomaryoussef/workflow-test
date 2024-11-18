package domain

type MerchantInvoice struct {
	accountId     string
	offsetAccount string
	amount        int64
	currencyCode  string
	invoiceId     string
	invoiceDate   string
	description   string
}

func (m MerchantInvoice) AccountId() string {
	return m.accountId
}
func (m MerchantInvoice) OffsetAccount() string {
	return m.offsetAccount
}
func (m MerchantInvoice) InvoiceId() string {
	return m.invoiceId
}
func (m MerchantInvoice) InvoiceDate() string {
	return m.invoiceDate
}
func (m MerchantInvoice) Amount() int64 {
	return m.amount
}
func (m MerchantInvoice) CurrencyCode() string {
	return m.currencyCode
}
func (m MerchantInvoice) Description() string {
	return m.description
}

// BUILDER

type MerchantInvoiceBuilder struct {
	AccountId     string
	OffsetAccount string
	Amount        int64
	CurrencyCode  string
	InvoiceId     string
	InvoiceDate   string
	Description   string
}

func NewMerchantInvoiceBuilder() *MerchantInvoiceBuilder {
	return &MerchantInvoiceBuilder{}
}

func (m *MerchantInvoiceBuilder) Build() MerchantInvoice {
	return MerchantInvoice{
		accountId:     m.AccountId,
		offsetAccount: m.OffsetAccount,
		amount:        m.Amount,
		currencyCode:  m.CurrencyCode,
		invoiceId:     m.InvoiceId,
		invoiceDate:   m.InvoiceDate,
		description:   m.Description,
	}
}
