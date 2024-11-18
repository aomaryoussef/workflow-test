package fincalc

import (
	"errors"
	financecore "github.com/alpeb/go-finance/fin"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/money"
	"math"
)

// MonthlyEffectiveRate calculates the monthly effective interest rate for a loan.
// The effective interest rate accounts for the compounding of interest, making it
// higher than the nominal rate. This function is designed for loans with monthly
// repayment schedules and uses the RATE function from the go-finance library.
//
// Parameters:
// - principalAmount: The principal amount of the loan as a money.Money instance.
// - loanTermInDays: The total term of the loan in days.
// - monthlyInstalment: The monthly instalment amount as a money.Money instance.
//
// Returns:
//   - The effective monthly interest rate as a float64. This rate is expressed as a fraction
//     (e.g., 5.25% is returned as 0.0525).
//   - An error if the monthly instalment is zero or if there's an error calculating the rate.
//
// Note:
//   - The function returns 0 with no error if the principal amount is zero, indicating no loan.
//   - If the calculated effective rate is negative, which can occur with a 0% interest rate due
//     to the instability of the financecore.Rate function, the function returns 0.0 and nil for error.
//   - The parameters for the RATE function include the total number of payment periods (nper),
//     the payment amount per period (pmt), the present value of the loan (pv), the future value (fv),
//     the payment type (ptype), and an initial guess for the rate (guess). The future value (fv) is
//     assumed to be 0, indicating that the loan is fully paid off by the end of the term, and payments
//     are assumed to be made at the end of each period (ptype = financecore.PayEnd).
//
// See: https://www.investopedia.com/terms/e/effectiveinterest.asp for details
//
// See: https://www.wikihow.com/Calculate-Effective-Interest-Rate on formula of calculating
func MonthlyEffectiveRate(principalAmount money.Money, loanTermInDays uint32, monthlyInstalment money.Money) (float64, error) {
	if principalAmount.IsZero() {
		return 0, nil
	}

	if monthlyInstalment.IsZero() {
		return -1, errors.New("monthly effective rate requires non-zero monthly instalment")
	}

	var effectiveRatePercent float64 = -1

	// Rate function: =RATE(nper, pmt, pv, [fv], [type], [guess])
	// 1. Nper – The total number of periods (months, quarters, years, etc.) over which the
	//	loan or investment is to be paid.
	// 2. Pmt – This is the payment for each period. This number must be unchanged over the
	// 	life of the loan. Pmt includes principal and interest but no other fees or taxes. If pmt
	//	is omitted, fv must be inputted.
	// 3. Pv – The present value, or the total amount that a series of future payments is worth now.
	// 4. Fv – This is the future value, or a cash balance you want to attain after the last payment is made.
	// 5. Type – This is the number 0 or 1 and indicates when payments are due.
	// 6. Guess – This is your guess for what the rate will be. If you omit guess, RATE uses 10 percent.

	// update this if the payment frequency changes
	nper := int(math.Ceil(float64(loanTermInDays / config.DaysInMonth)))
	pmt := -float64(monthlyInstalment.Amount() / 100)
	pv := float64(principalAmount.Amount()) / 100
	fv := float64(0)
	ptype := financecore.PayEnd // means payment for each period occurs towards the end of period
	guess := 0.1

	mer, err := financecore.Rate(nper, pmt, pv, fv, ptype, guess)
	if err != nil {
		return effectiveRatePercent, err
	}
	effectiveRatePercent = mer
	if effectiveRatePercent < 0 {
		// With 0% interest rate, financecore.Rate becomes unstable and can
		// yield slight negative monthly rate leading to underflow in interest due
		return 0.0, nil
	} else {
		return effectiveRatePercent, nil
	}
}

// MonthlyEffectiveRateRoundedPercent calculates the monthly effective interest rate for a loan,
// rounded to two decimal places. This function first calculates the monthly effective rate using
// the MonthlyEffectiveRate function. It then multiplies this rate by 100 to convert it to a percentage,
// rounds it to two decimal places for readability, and returns the rounded percentage.
//
// Parameters:
// - principalAmount: The principal amount of the loan as a money.Money instance.
// - loanTermInDays: The total term of the loan in days.
// - monthlyInstalment: The monthly instalment amount as a money.Money instance.
//
// Returns:
// - The effective monthly interest rate as a percentage, rounded to two decimal places (e.g., 5.25 for 5.25%).
// - An error if the MonthlyEffectiveRate function returns an error, typically due to invalid input parameters.
func MonthlyEffectiveRateRoundedPercent(principalAmount money.Money, loanTermInDays uint32, monthlyInstalment money.Money) (float64, error) {
	mer, err := MonthlyEffectiveRate(principalAmount, loanTermInDays, monthlyInstalment)
	if err != nil {
		return -1, err
	}

	merPercent := mer * 100
	merPercent = math.Round(merPercent*100) / 100 // (round to 2 decimal places)
	return merPercent, nil
}

// TotalEffectiveRate calculates the total effective rate over the entire loan term.
// This function multiplies the monthly effective rate by the total number of instalments,
// providing a simple aggregate measure of the rate over the loan period. It does not account
// for compounding, making it a straightforward way to estimate the total rate impact over time.
//
// Parameters:
//   - monthlyEffectiveRate: The monthly effective interest rate as a float64. This should be
//     the rate per month, expressed as a decimal (e.g., 0.05 for 5% per month).
//   - numberOfInstalments: The total number of monthly instalments for the loan, as a uint32.
//
// Returns:
//   - The total effective rate as a float64, representing the aggregate rate impact over the
//     entire term of the loan.
func TotalEffectiveRate(monthlyEffectiveRate float64, numberOfInstalments uint32) float64 {
	return monthlyEffectiveRate * float64(numberOfInstalments)
}

// AnnualPercentageRate calculates the annual percentage rate (APR) for a loan.
// The APR represents the annual rate charged for borrowing or earned through an investment,
// including any fees or additional costs associated with the transaction. The APR provides
// a comprehensive measure of the cost of borrowing on an annual basis, expressed as a percentage.
//
// Parameters:
// - financedAmount: The total amount of the loan as a money.Money instance.
// - monthlyInstallment: The monthly installment amount as a money.Money instance.
// - totalFees: The total fees associated with the loan as a money.Money instance.
// - loanTermInDays: The total term of the loan in days.
//
// Returns:
//   - The APR as a float64, rounded to two decimal places. This value represents the actual yearly cost
//     of funds over the term of a loan, accounting for the interest rate as well as any additional fees.
//
// Note:
//   - The function calculates the total interest payable over the term of the loan, adds any additional fees,
//     and then divides this total by the financed amount to determine the percentage gain. This percentage is
//     then annualized by dividing by the loan term in days and multiplying by the number of days in a year.
//   - The APR is rounded to two decimal places for readability and consistency with financial reporting standards.
func AnnualPercentageRate(financedAmount money.Money, monthlyInstallment money.Money, totalFees money.Money, loanTermInDays uint32) float64 {
	totalInterestPayable := TotalInterestPayable(financedAmount, monthlyInstallment, loanTermInDays)
	totalGainUnits := totalInterestPayable.Amount() + totalFees.Amount()
	percentGain := float64(totalGainUnits) / float64(financedAmount.Amount())
	apr := (percentGain / float64(loanTermInDays)) * float64(config.DaysInYear)
	return math.Round(apr*100*100) / (100 * 100)
}
