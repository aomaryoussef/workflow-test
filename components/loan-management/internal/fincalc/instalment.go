package fincalc

import (
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/money"
	"math"
)

// MonthlyInstalment calculates the monthly instalment amount for a loan.
// This function takes into account the principal amount, loan term in days,
// interest rate in basis points, and whether the instalment should be rounded up.
// The monthly instalment is calculated by dividing the principal amount and total interest
// payable by the total number of instalments. The function supports rounding up the instalment
// to the nearest whole unit of currency.
//
// Parameters:
// - principalAmount: The principal amount of the loan as a money.Money instance.
// - loanTermInDays: The total term of the loan in days.
// - interestBasisPoints: The interest rate in basis points (1 basis point = 0.01%).
// - instalmentRoundingUp: A boolean flag indicating whether to round up the instalment amount.
//
// Returns:
//   - A money.Money instance representing the monthly instalment amount, optionally rounded up
//     to the nearest whole unit of currency.
//
// Note:
//   - If the loan term in days is 0, the function returns a money.Money instance with a value of 0,
//     indicating no instalment is necessary.
//   - The function calculates the total number of instalments based on the loan term and the predefined
//     number of days in a month from the configuration.
//   - The interest per instalment is calculated by dividing the total interest payable by the total number
//     of instalments.
//   - The function supports rounding up the final monthly instalment to the nearest whole unit of currency
//     for easier financial management.
func MonthlyInstalment(principalAmount money.Money, loanTermInDays uint32, interestBasisPoints uint32, instalmentRoundingUp bool) money.Money {
	if loanTermInDays == 0 {
		return *money.NewMoney(0, principalAmount.Currency().Code)
	}

	totalNumOfInstallments := uint32(math.Floor(float64(loanTermInDays / config.DaysInMonth)))
	interestAsPercent := float64(interestBasisPoints) / config.Hundred

	principalPerInstallment := float64(principalAmount.Amount()) / float64(totalNumOfInstallments)

	totalInterestPayable := float64(principalAmount.Amount()) * (interestAsPercent / 100)
	interestPerInstallment := totalInterestPayable / float64(totalNumOfInstallments)
	// rounded to the nearest 100 i.e. monthlyInstallment is still in cents
	monthlyInstallment := math.Round(principalPerInstallment + interestPerInstallment)

	if instalmentRoundingUp {
		monthlyInstallment = math.Ceil(monthlyInstallment/100) * 100
	}

	return *money.NewMoney(uint64(monthlyInstallment), principalAmount.Currency().Code)
}
