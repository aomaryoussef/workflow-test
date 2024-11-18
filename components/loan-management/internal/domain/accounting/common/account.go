package common

import (
	"strings"
)

type JournalDirection string

type Account struct {
	SubLedgerAccount     string
	GeneralLedgerAccount string
}

var (
	MurabahaPurchaseAccount            = Account{SubLedgerAccount: "murabaha_purchase", GeneralLedgerAccount: "120101006"}
	MurabahaPrincipalReceivableAccount = Account{SubLedgerAccount: "murabaha_loan_receivable", GeneralLedgerAccount: "120301033"}
	MurabahaUnearnedRevenueAccount     = Account{SubLedgerAccount: "unearned_revenue", GeneralLedgerAccount: "230406005"}
	MurabahaInterestReceivableAccount  = Account{SubLedgerAccount: "murabaha_interest_receivable", GeneralLedgerAccount: "120301034"}
	DoubtfulAccount                    = Account{SubLedgerAccount: "doubtful_allowance", GeneralLedgerAccount: "510501017"}
	DoubtfulReceivableAccount          = Account{SubLedgerAccount: "doubtful_allowance_receivable", GeneralLedgerAccount: "120403007"}
	AdminFeeReceivableAccount          = Account{SubLedgerAccount: "admin_fee_receivable", GeneralLedgerAccount: "410101006"}
	VatFeeReceivableAccount            = Account{SubLedgerAccount: "vat_receivable", GeneralLedgerAccount: "230408002"}
	MerchantDueAccount                 = Account{SubLedgerAccount: "merchant_due", GeneralLedgerAccount: "230202012"}
	InterestRevenueAccount             = Account{SubLedgerAccount: "interest_revenue", GeneralLedgerAccount: "410201001"}
	ConsumerPaymentReceivableAccount   = Account{SubLedgerAccount: "wallet", GeneralLedgerAccount: "120301035"}
	BTTDPaymentPayableAccount          = Account{SubLedgerAccount: "--NA--", GeneralLedgerAccount: "120402001"}
)

var (
	Debit  JournalDirection = "Debit"
	Credit JournalDirection = "Credit"
)

func (j JournalDirection) ToUpperCase() string {
	return strings.ToUpper(string(j))
}
