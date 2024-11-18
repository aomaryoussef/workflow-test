package config

import "time"

const (
	AppNameSelf string = "self"
	SystemUser  string = "system"

	VATPercentBasisPoints              uint32  = 14_00
	DaysInMonth                        uint32  = 30
	DaysInYear                                 = DaysInMonth * 12
	Hundred                            float64 = 100
	LoanAmmoritisationBookingCutOffDay         = 10
	Duration30Days = time.Hour * 24 * 30
)

var (
	LenderSourceLedgerNameMap = make(map[string]string)
	LenderSourceMylo          = "mylo"

	// LocalDateRepaymentDayToStaticFirstOfMonth is the date when the repayment logic was changed by business
	// to use 1st of every month as the repayment day
	LocalDateRepaymentDayToStaticFirstOfMonth = time.Date(2024, 6, 13, 0, 0, 0, 0, time.Local)

	// LocalDateRepaymentDayToConsumerLevelDefined is the date when the repayment logic was changed by business
	// to use the consumers' single repayment date defined on the consumer level
	// See Release: https://github.com/btechlabs/ol-lms-lite/releases/tag/v1.4.0
	LocalDateRepaymentDayToConsumerLevelDefined = time.Date(2024, 7, 28, 0, 0, 0, 0, time.Local)
)

func init() {
	LenderSourceLedgerNameMap["octopus"] = "OCT"
	LenderSourceLedgerNameMap[LenderSourceMylo] = "OL"
}
