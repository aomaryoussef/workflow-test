package domain

import (
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
)

type CommercialOffer struct {
	Id                       string
	ConsumerId               string
	BasketId                 string
	FinancialProductKey      string
	FinancialProductVersion  string
	Tenure                   string
	AdminFee                 *money.Money
	FinancedAmount           *money.Money
	TotalAmount              *money.Money
	AnnualInterestPercentage string
	InterestRatePerTenure    string
	DownPayment              *money.Money
	MonthlyInstalment        *money.Money
	ConsumerAcceptedAt       *time.Time
	MerchantAcceptedAt       *time.Time
	AnnualPercentageRate     string
	FlatEffectiveRate        string

	BasketAmount    *money.Money
	Rejected        bool
	RejectionReason string
}
