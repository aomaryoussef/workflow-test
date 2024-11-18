package domain

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"math"
)

// EarlySettlementFeePercentageBasisPoints is a constant value of 15%
// Later this needs to move into the financial product configuration
const EarlySettlementFeePercentageBasisPoints = 0

type EarlySettlementDetails struct {
	IsEarlySettlementAvailable bool
	// Will not be available if IsEarlySettlementAvailable is false
	EarlySettlementPrincipalDue *money.Money // EarlySettlementPrincipalDue is the sum of all outstanding principal
	EarlySettlementFeesDue      *money.Money // EarlySettlementFeesDue is the fees
	InitialInterestReceivable   *money.Money // InitialInterestReceivable is the sum of all the interest that was due at the time of early settlement
	WithoutAllowance            bool
	WithoutInterest             bool
}

func (e *EarlySettlementDetails) EarlySettlementTotalAmountDue() *money.Money {
	return money.NewMoney(e.EarlySettlementPrincipalDue.UnitsOrZero() + e.EarlySettlementFeesDue.UnitsOrZero())
}

func (l *Loan) IsEarlySettlementAvailable() bool {
	// Early Settlement is only available for loans that are active
	// AND that have at least 1 repayment made
	if l.CurrentStatus().statusType != LoanStatusActive {
		return false
	}
	// If all the repayments are paid, then early settlement is not available
	totalValidInstallments := 0
	numberOfInstallmentsPaid := 0
	for _, schedule := range l.paymentSchedule.lineItems {
		if schedule.IsCancelled() {
			continue
		}
		totalValidInstallments++
		if schedule.IsPaid() {
			numberOfInstallmentsPaid++
		}
	}
	return totalValidInstallments > 0 &&
		numberOfInstallmentsPaid > 0 &&
		numberOfInstallmentsPaid < totalValidInstallments
}

func (l *Loan) EarlySettlementDetails() EarlySettlementDetails {
	if !l.IsEarlySettlementAvailable() {
		return EarlySettlementDetails{
			IsEarlySettlementAvailable: false,
		}
	}
	totalDue := l.paymentSchedule.TotalDue()
	totalPrincipalDue := l.paymentSchedule.PrincipalDue()
	initialInterestReceivable := l.paymentSchedule.InterestDue()
	return calculateEarlySettlementFees(
		*totalDue,
		*totalPrincipalDue,
		*initialInterestReceivable,
		l.earlySettlementPercentBasisPoints,
	)
}

func calculateEarlySettlementFees(
	totalDue money.Money,
	principalDue money.Money,
	initialInterestDue money.Money,
	settlementPercentBasisPoints int,
) EarlySettlementDetails {
	// EarlySettlementFeePercentageBasisPoints % of totalDue
	// Always round up to the nearest whole number
	murabahaEarlySettlementAllowanceFloat := ((float64(settlementPercentBasisPoints) / 100) * float64(totalDue.UnitsOrZero())) / 100
	murabahaEarlySettlementAllowance := uint64(math.Ceil(murabahaEarlySettlementAllowanceFloat))
	return EarlySettlementDetails{
		IsEarlySettlementAvailable:  true,
		EarlySettlementPrincipalDue: &principalDue,
		InitialInterestReceivable:   &initialInterestDue,
		// Converts the pounds to cents
		EarlySettlementFeesDue: money.NewMoney(murabahaEarlySettlementAllowance * 100),
		WithoutAllowance:       EarlySettlementFeePercentageBasisPoints == 0,
		WithoutInterest:        initialInterestDue.UnitsOrZero() == 0,
	}
}
