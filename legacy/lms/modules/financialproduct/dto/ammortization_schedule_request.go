package dto

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"time"
)

type AmmortizationScheduleRequest struct {
	FinancialProductKey     string
	FinancialProductVersion string
	NetPrincipalAmount      money.Money
	TenorKey                string
	LoanBookingTimeUTC      time.Time
	RepaymentDay            int
}
