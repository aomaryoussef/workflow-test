package fincalc

import (
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/money"
	"math"
)

// CalculateEarlySettlementFees calculates the early settlement fees for a loan.
// This function computes the fees based on the principal due, interest due, and a settlement percentage.
// The settlement fee is calculated as a percentage of the total due (sum of principal and interest),
// rounded up to the nearest whole number. This ensures that the fee is always rounded up, favoring the lender.
//
// Parameters:
// - principalDue: The principal amount due on the loan at the time of early settlement.
// - interestDue: The interest amount due on the loan at the time of early settlement.
// - settlementPercentBasisPoints: The percentage (in basis points) of the total due that constitutes the settlement fee.
//
// Returns:
// - A money.Money instance representing the early settlement fee, in the same currency as the principal due.
//
// Note:
// - The function uses basis points for the settlement percentage to allow for more precise fee calculations.
// - The calculation always rounds up to the nearest whole number to ensure the fee is not underestimated.
func CalculateEarlySettlementFees(
	principalDue money.Money,
	interestDue money.Money,
	settlementPercentBasisPoints types.PercentBasisPoints,
) money.Money {
	totalDue := money.AsPtr(principalDue).MustAdd(money.AsPtr(interestDue))
	// EarlySettlementFeePercentageBasisPoints % of totalDue
	// Always round up to the nearest whole number
	// esa = earlySettlementAllowance
	esaCents := (float64(settlementPercentBasisPoints) / 100) * float64(totalDue.Amount()) / 100
	esaRoundedUpCents := uint64(math.Ceil(esaCents/100)) * 100
	return *money.NewMoney(esaRoundedUpCents, principalDue.Currency().Code)
}
