package accounts

// the account numbers are hard coded in the code because they DO NOT CHANGE
// if they change, we will have to change the code and the chart of accounts
// no one changes these without ensuring from the finance team and
// dynamics / general accounting team
const (
	MurabahaPurchaseAccount            = "120101006"
	MurabahaPrincipalReceivableAccount = "120301033"
	MurabahaUnearnedRevenueAccount     = "230406005"
	MurabahaInterestReceivableAccount  = "120301034"
	DoubtfulAccount                    = "510501017"
	DoubtfulReceivableAccount          = "120403007"
	AdminFeeReceivableAccount          = "410101006"
	VatFeeReceivableAccount            = "230408002"
	MerchantDueAccount                 = "230202012"
	InterestRevenueAccount             = "410201001"
	ConsumerPaymentReceivableAccount   = "120301035"
	BTTDPaymentPayableAccount          = "120402001"
	MyloDueAccount                     = "230301009"
	FawryPaymentReceivableAccount      = "120603005"
	BankCibAccount                     = "610301004"
	BankMisrAccount                    = "610301002"
	BankAhlyAccount                    = "610301006"
)
