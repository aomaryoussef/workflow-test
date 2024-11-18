package dto

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"time"
)

type OfferDetailsResponse struct {
	Request      *CalculateOfferDetailsRequest
	OfferDetails *OfferDetails
}

type OfferDetails struct {
	RequestedFinancedAmount  *money.Money
	TotalInterestPayable     *money.Money
	TotalAmountPayable       *money.Money
	AdminFee                 *money.Money
	AmortizedPaymentSchedule []*AmortizedPaymentSchedule
}

type AmortizedPaymentSchedule struct {
	InstalmentDueDate  time.Time
	LoanBalance        *money.Money
	PrincipalDue       *money.Money
	InterestDue        *money.Money
	TotalInstalmentDue *money.Money
}
