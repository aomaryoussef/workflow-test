package http_client

import (
	"context"
	"encoding/json"
	"strings"
	"time"
)

type BookCancelledInvoicesAccountRequest struct {
	Contract BookCancelledInvoicesAccountContract `json:"_request"`
}
type BookCancelledInvoicesAccountContract struct {
	*MetaData
	MerchantInvoices []MerchantInvoice `json:"MerchantInvoices"`
}
type MerchantInvoice struct {
	Account                   string                `json:"Account"`
	HeaderResponseDescription string                `json:"HeaderResponseDescription"`
	HeaderResponseStatus      string                `json:"HeaderResponseStatus"`
	JournalNumber             string                `json:"JournalNumber"`
	MerchantInvoiceLines      []MerchantInvoiceLine `json:"MerchantInvoiceLines"`
}
type MerchantInvoiceLine struct {
	Amount                  int64  `json:"Amount"`
	CurrencyCode            string `json:"CurrencyCode"`
	Description             string `json:"Description"`
	InvoiceDate             string `json:"InvoiceDate"`
	InvoiceId               string `json:"InvoiceId"`
	LineResponseDescription string `json:"LineResponseDescription"`
	LineResponseStatus      string `json:"LineResponseStatus"`
	OffsetAccount           string `json:"OffsetAccount"`
	TransDate               string `json:"TransDate"`
}
type BookCollectionTreasuryRequest struct {
	Contract BookCollectionTreasuryContract `json:"_request"`
}
type BookCollectionTreasuryResponse struct {
	*MetaData
	GeneralJournalList []CollectionGeneralJournal `json:"GeneralJournalList"`
}
type BookCollectionTreasuryContract struct {
	*MetaData
	GeneralJournalList []CollectionGeneralJournal `json:"GeneralJournalList"`
}

type BookLoanCancellationTreasuryRequest struct {
	Contract BookLoanCancellationTreasuryContract `json:"_request"`
}
type BookLoanCancellationTreasuryResponse struct {
	*MetaData
	GeneralJournalList []CollectionGeneralJournal `json:"GeneralJournalList"`
}
type BookLoanCancellationTreasuryContract struct {
	*MetaData
	GeneralJournalList []CollectionGeneralJournal `json:"GeneralJournalList"`
}

type CollectionGeneralJournal struct {
	HeaderResponseDescription string                         `json:"HeaderResponseDescription"`
	HeaderResponseStatus      string                         `json:"HeaderResponseStatus"`
	JournalLines              []CollectionGeneralJournalLine `json:"JournalLines"`
	EnteredBy                 string                         `json:"EnteredBy"`
	JournalName               string                         `json:"JournalName"`
	JournalNumber             string                         `json:"JournalNumber"`
	MyloJournalReference      string                         `json:"MyloJournalReference"`
	MyloTransType             string                         `json:"MyloTransType"`
	TransDate                 string                         `json:"TransDate"`
}
type CollectionGeneralJournalLine struct {
	Account                 string `json:"Account"`
	AccountType             string `json:"AccountType"`
	Amount                  uint64 `json:"Amount"`
	Description             string `json:"Description"`
	LineResponseDescription string `json:"LineResponseDescription"`
	LineResponseStatus      string `json:"LineResponseStatus"`
	Type                    string `json:"Type"`
	StoreId                 string `json:"StoreId"`
	PaymentMethod           string `json:"PaymentMethod"`
	Comment                 string `json:"Comment"`
	CardNumber              string `json:"CardNumber"`
	CardReferenceNumber     string `json:"BT_ReferenceNum"`
}

type CreateMerchantRequest struct {
	Contract CreateMerchantContract `json:"_request"`
}
type MetaData struct {
	DataAreaId        string `json:"DataAreaId"`
	IntegrationPoint  string `json:"IntegrationPoint"`
	MyloRequestNumber string `json:"MyloRequestNumber"`
}
type CreateMerchantContract struct {
	*MetaData
	MerchantDataList []MerchantDataRequest `json:"MerchantDataList"`
}
type CommonMerchantData struct {
	MerchantAccount           string `json:"MerchantAccount"`
	MerchantName              string `json:"MerchantName"`
	MerchantGroup             string `json:"MerchantGroup"`
	CurrencyCode              string `json:"CurrencyCode"`
	SearchName                string `json:"SearchName"`
	SalesTaxGroup             string `json:"SalesTaxGroup"`
	WithholdingTaxGroupCode   string `json:"WithholdingTaxGroupCode"`
	Location                  string `json:"Location"`
	StreetNumber              string `json:"StreetNumber"`
	Street                    string `json:"Street"`
	ZipCode                   string `json:"ZipCode"`
	State                     string `json:"State"`
	City                      string `json:"City"`
	MerchantBankName          string `json:"MerchantBankName"`
	MerchantBankAddress       string `json:"MerchantBankAddress"`
	MerchantBankBranchName    string `json:"MerchantBankBranchName"`
	MerchantBankSwiftCode     string `json:"MerchantBankSwiftCode"`
	MerchantBankIBAN          string `json:"MerchantBankIBAN"`
	MerchantBankAccountNumber string `json:"MerchantBankAccountNumber"`
	TaxRegistrationNumber     string `json:"MyloTaxNum"`
	BeneficiaryBankName       string `json:"BeneficiaryName"`
	BeneficiaryBankAddress    string `json:"BeneficiaryAddress"`
}
type MerchantDataRequest struct {
	*CommonMerchantData
}
type CreateMerchantResponse struct {
	ID string `json:"$id"`
	*MetaData
	MerchantDataList []MerchantDataResponse `json:"MerchantDataList"`
}
type MerchantDataResponse struct {
	ID string `json:"$id"`
	*CommonMerchantData
	ResponseStatus      string `json:"ResponseStatus"`
	ResponseDescription string `json:"ResponseDescription"`
}
type CreateMerchantInvoiceRequest struct {
	Contract InvoiceContract `json:"_request"`
}
type InvoiceContract struct {
	*MetaData
	GeneralJournals []InvoiceGeneralJournalRequest `json:"MerchantInvoices"`
}
type InvoiceGeneralJournalRequest struct {
	Account             string                             `json:"Account"`
	GeneralJournalLines []InvoiceGeneralJournalLineRequest `json:"MerchantInvoiceLines"`
}
type InvoiceGeneralJournalLineRequest struct {
	CurrencyCode  string `json:"CurrencyCode"`
	InvoiceId     string `json:"InvoiceId"`
	OffsetAccount string `json:"OffsetAccount"`
	InvoiceDate   string `json:"InvoiceDate"`
	TransDate     string `json:"TransDate"`
	Amount        int64  `json:"Amount"`
	Description   string `json:"Description"`
}
type CreateMerchantInvoiceResponse struct {
	ID string `json:"$id"`
	*MetaData
	GeneralJournals []InvoiceGeneralJournalResponse `json:"MerchantInvoices"`
}
type InvoiceGeneralJournalResponse struct {
	ID                        string                              `json:"$id"`
	Account                   string                              `json:"Account"`
	JournalNumber             string                              `json:"JournalNumber"`
	HeaderResponseStatus      string                              `json:"HeaderResponseStatus"`
	HeaderResponseDescription string                              `json:"HeaderResponseDescription"`
	GeneralJournalLines       []InvoiceGeneralJournalLineResponse `json:"MerchantInvoiceLines"`
}
type MSDynamicsTime time.Time
type InvoiceGeneralJournalLineResponse struct {
	ID           string  `json:"$id"`
	AccountType  int     `json:"AccountType"`
	Amount       float64 `json:"Amount"`
	AmountDebit  float64 `json:"AmountDebit"`
	AmountCredit float64 `json:"AmountCredit"`
	VendDimValue string  `json:"VendDimValue"`
	// custom time unmarshalling: https://stackoverflow.com/questions/45303326/how-to-parse-non-standard-time-format-from-json
	TransDate               MSDynamicsTime `json:"TransDate"`
	InvoiceDate             MSDynamicsTime `json:"InvoiceDate"`
	InvoiceId               string         `json:"InvoiceId"`
	Description             string         `json:"Description"`
	CurrencyCode            string         `json:"CurrencyCode"`
	LineResponseStatus      string         `json:"LineResponseStatus"`
	LineResponseDescription string         `json:"LineResponseDescription"`
}

func (t *MSDynamicsTime) UnmarshalJSON(b []byte) error {
	s := strings.Trim(string(b), "\"")
	ti, err := time.Parse("2006-01-02T15:04:05", s)
	if err != nil {
		return err
	}
	*t = MSDynamicsTime(ti)
	return nil
}
func (t MSDynamicsTime) MarshalJSON() ([]byte, error) {
	return json.Marshal(time.Time(t))
}

type SubmitToGeneralLedgerRequest struct {
	Contract GeneralLedgerContract `json:"_request"`
}
type GeneralLedgerContract struct {
	*MetaData
	GeneralJournalList []GeneralJournalItemRequest `json:"GeneralJournalList"`
}
type GeneralJournalItemRequest struct {
	JournalName          string                          `json:"JournalName"`
	MyloJournalReference string                          `json:"MyloJournalReference"`
	MyloTransType        string                          `json:"MyloTransType"`
	TransDate            string                          `json:"TransDate"`
	JournalLines         []GeneralJournalItemLineRequest `json:"JournalLines"`
}
type GeneralJournalItemLineRequest struct {
	Account     string `json:"Account"`
	Type        string `json:"Type"` // Debit/Credit
	Amount      int64  `json:"Amount"`
	Description string `json:"Description"`
}
type SubmitToGeneralLedgerResponse struct {
	ID string `json:"$id"`
	*MetaData
	GeneralJournalList []GeneralJournalItemResponse `json:"GeneralJournalList"`
}
type GeneralJournalItemResponse struct {
	ID                   string                           `json:"$id"`
	JournalName          string                           `json:"JournalName"`
	MyloJournalReference string                           `json:"MyloJournalReference"`
	MyloTransType        string                           `json:"MyloTransType"`
	TransDate            MSDynamicsTime                   `json:"TransDate"`
	ResponseStatus       string                           `json:"HeaderResponseStatus"`
	ResponseDescription  string                           `json:"HeaderResponseDescription"`
	JournalLines         []GeneralJournalItemLineResponse `json:"JournalLines"`
}
type GeneralJournalItemLineResponse struct {
	ID                  string `json:"$id"`
	Account             string `json:"Account"`
	Type                string `json:"Type"` // Debit/Credit
	Amount              int64  `json:"Amount"`
	Description         string `json:"Description"`
	ResponseStatus      string `json:"LineResponseStatus"`
	ResponseDescription string `json:"LineResponseDescription"`
}

type MSDynamicsClient interface {
	MakeRequest(ctx context.Context, url string, payload []byte) ([]byte, error)
}
