package collection

type RawRequest struct {
	CollectionStoreID string `mapstructure:"collection_store_id"`
	PaymentMethodCode string `mapstructure:"payment_method_code"`
}

type BookConsumerCollectionTaskRequest struct {
	PaymentReferenceId string `mapstructure:"id"`
	Channel            string `mapstructure:"channel"`
	BillingAccount     string `mapstructure:"billing_account"`
	// BillingAccountScheduleId is optional and can be nil
	// When not present and CollectedAsEarlySettlement is true,
	// then collection will be considered as early settlement
	BillingAccountScheduleId *uint64 `mapstructure:"billing_account_schedule_id"`
	// CollectedAsEarlySettlement is by default false i.e. normal collection
	CollectedAsEarlySettlement bool       `mapstructure:"collected_as_early_settlement"`
	BookingTime                string     `mapstructure:"booking_time"`
	PaidAmountUnits            uint64     `mapstructure:"amount_units"`
	PaidAmountCurrency         string     `mapstructure:"amount_currency"`
	CreatedBy                  string     `mapstructure:"created_by"`
	RawRequest                 RawRequest `mapstructure:"raw_request"`
}

type SingleMyloRepayment struct {
	LoanId                     string  `mapstructure:"loan_id"`
	LoanScheduleId             *uint64 `mapstructure:"loan_schedule_id"`
	Amount                     uint64  `mapstructure:"amount"`
	CollectedAsEarlySettlement bool    `mapstructure:"collected_as_early_settlement"`
}

type ProcessMyloRepaymentsTaskRequest struct {
	PaymentId      string `mapstructure:"payment_id"`
	BookingTime    string `mapstructure:"booking_time"`
	PaymentChannel string `mapstructure:"payment_channel"`
	// an array of SingleMyloRepayment
	MyloRepayments []SingleMyloRepayment `mapstructure:"mylo_repayments"`
}

// Define TreasuryType as a string type
type TreasuryType string

// Define constants for TreasuryType
const (
	MYLO  TreasuryType = "MYLO"
	BTECH TreasuryType = "BTECH"
)

type ConsumerCollectionTaskRequest struct {
	TreasuryType       TreasuryType           `mapstructure:"treasury_type"`
	PaymentReferenceId string                 `mapstructure:"payment_id"`
	BookingTime        string                 `mapstructure:"booking_time"`
	PaymentChannel     string                 `mapstructure:"payment_channel"`
	Amount             uint64                 `mapstructure:"amount"`
	MetaData           map[string]interface{} `json:"meta_data,omitempty"`
}
