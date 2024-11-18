package domain

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"time"
)

type AmmortizationSchedule struct {
	FinancialProductKey     string
	FinancialProductVersion string
	NetPrincipalAmount      money.Money
	TenorKey                string
	PaymentSchedule         []AmortizationScheduleInstalment
}

type AmortizationScheduleInstalment struct {
	InstalmentDueDateUTC  time.Time
	GracePeriodEndDateUTC time.Time
	LoanBalance           money.Money
	PrincipalDue          money.Money
	InterestDue           money.Money
	TotalInstalmentDue    money.Money
}
