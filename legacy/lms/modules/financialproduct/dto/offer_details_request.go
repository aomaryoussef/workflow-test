package dto

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"time"
)

type CalculateOfferDetailsRequest struct {
	FinancialProductKey     string
	FinancialProductVersion string
	RequestedTenorKey       string

	RequestedFinancedAmount *money.Money
	ExpectedStartDate       *time.Time
}
