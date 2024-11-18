package fincalc

import (
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/money"
	"math"
)

// CalculateAdminFee calculates the administrative fee based on a percentage of the financed amount.
// The fee is calculated using basis points for precision and is rounded to the nearest whole unit of currency.
//
// Parameters:
// - percentBasisPoints: The fee percentage in basis points (1 basis point = 0.01%).
// - financedAmount: The amount of money being financed, represented as a money.Money instance.
//
// Returns:
// - A money.Money instance representing the administrative fee, rounded to the nearest whole unit of currency.
func CalculateAdminFee(percentBasisPoints uint32, financedAmount money.Money) money.Money {
	percent := float64(percentBasisPoints) / config.Hundred
	adminFee := (float64(financedAmount.Amount()) * percent) / config.Hundred
	// units means in cents. This rounding just removes the decimal from
	// the cents value
	adminFee = math.Round(adminFee)
	return *money.NewMoney(uint64(adminFee), financedAmount.Currency().Code)
}

// CalculateVatAmount calculates the VAT amount on given fees.
// The VAT is calculated based on a percentage (in basis points) of the fees and is rounded to the nearest whole unit of currency.
//
// Parameters:
// - vatPercentBasisPoints: The VAT percentage in basis points.
// - fees: The fees on which VAT is to be calculated, represented as a money.Money instance.
//
// Returns:
// - A money.Money instance representing the VAT amount, rounded to the nearest whole unit of currency.
func CalculateVatAmount(vatPercentBasisPoints uint32, fees money.Money) money.Money {
	percent := float64(vatPercentBasisPoints) / config.Hundred
	vatAmount := (float64(fees.Amount()) * percent) / config.Hundred
	// units means in cents. This rounding just removes the decimal from
	// the cents value
	vatAmount = math.Round(vatAmount)
	return *money.NewMoney(uint64(vatAmount), fees.Currency().Code)
}

// TotalInterestPayable calculates the total interest payable over the term of a loan.
// This is calculated as the difference between the total payment over the loan term and the principal amount.
//
// Parameters:
// - financedAmount: The principal amount of the loan as a money.Money instance.
// - monthlyInstalment: The monthly instalment amount as a money.Money instance.
// - loanTermInDays: The total term of the loan in days.
//
// Returns:
// - A money.Money instance representing the total interest payable over the loan term.
func TotalInterestPayable(financedAmount money.Money, monthlyInstalment money.Money, loanTermInDays uint32) money.Money {
	// total interest payable = total payment - principal amount
	totalPaymentUnits := monthlyInstalment.Amount() * uint64(loanTermInDays/config.DaysInMonth)
	return *money.NewMoney(totalPaymentUnits-financedAmount.Amount(), financedAmount.Currency().Code)
}

// TotalOriginationFees calculates the total origination fees, including administrative and VAT fees.
// The function optionally rounds up the total fees to the nearest whole unit of currency.
//
// Parameters:
// - adminFee: The administrative fee as a money.Money instance.
// - vatFee: The VAT fee as a money.Money instance.
// - roundingUp: A boolean flag indicating whether to round up the total fees.
//
// Returns:
// - A money.Money instance representing the total origination fees, optionally rounded up to the nearest whole unit of currency.
//
// Note:
// - The VAT fee is fixed and cannot be modified in case of rounding up, as it represents a government tax.
// - The admin fee currency is assumed to be the same as the VAT fee currency, and is used as the currency for the returned total fees.
func TotalOriginationFees(adminFee money.Money, vatFee money.Money, roundingUp bool) money.Money {
	totalFee := float64(adminFee.Amount()+vatFee.Amount()) / config.Hundred
	if roundingUp {
		// round up the admin fee
		totalFee = math.Ceil(totalFee)
	}

	return *money.NewMoney(uint64(totalFee*config.Hundred), adminFee.Currency().Code)
}
