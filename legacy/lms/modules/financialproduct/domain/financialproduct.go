package domain

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms-lite/pkg/timex"
	"math"
	"time"

	financemath "github.com/btechlabs/lms-lite/pkg/finance_math"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/money"
)

var (
	ErrInvalidTenorKey = errors.New("invalid tenor key for the financial product")
)

// FinancialProduct defines an immutable structure.
// All business calculations are always performed on the financial product
// level as this is the main business entity.
// All other related structs within the financial product are not available
// outside of this package.
//
// A builder function is provided to create a product.
// TODO: Question why is merchant fee part of product ?
type FinancialProduct struct {
	id              string     // Unique identifier
	key             string     // Unique key for a specific financial product
	version         string     // Version of a financial product
	previousVersion string     // Previous Version of from which this financial product was created, default "-1"
	name            string     // Name of the product
	description     string     // Description of the product
	activeSince     *time.Time // The date-time in UTC from which this financial product is/will be active (can be future date also)
	activeUntil     *time.Time // The date-time in UTC until which this financial product was/will be active (can be future date also)
	// Configuration params
	configRoundUpMonthlyToNearest bool
	// Global set of attributes that have financial impact, these attributes can be overridden on variant phase level
	globalAdminFee                   *FinancialProductAdminFee
	globalBadDebt                    *FinancialProductBadDebt
	globalGracePeriodInDays          uint8
	globalMinimumApplicablePrincipal *money.Money
	globalMaximumApplicablePrincipal *money.Money
	globalRepaymentDaysOfMonth       []uint8
	// Variants of the financial product
	tenorVariants []*FinancialProductTenorVariant
}

func (fp *FinancialProduct) Id() string {
	return fp.id
}

func (fp *FinancialProduct) Key() string {
	return fp.key
}

func (fp *FinancialProduct) Version() string {
	return fp.version
}

func (fp *FinancialProduct) PreviousVersion() string {
	return fp.previousVersion
}

func (fp *FinancialProduct) Name() string {
	return fp.name
}

func (fp *FinancialProduct) Description() string {
	return fp.description
}

func (fp *FinancialProduct) ActiveSince() *time.Time {
	return fp.activeSince
}

func (fp *FinancialProduct) ActiveUntil() *time.Time {
	return fp.activeUntil
}

func (fp *FinancialProduct) TenorVariants() []*FinancialProductTenorVariant {
	return fp.tenorVariants
}

func (fp *FinancialProduct) MaximumApplicablePrincipal() *money.Money {
	return fp.globalMaximumApplicablePrincipal
}

func (fp *FinancialProduct) MinimumApplicablePrincipal() *money.Money {
	return fp.globalMinimumApplicablePrincipal
}

func (fp *FinancialProduct) IsPrincipalAllowed(principal *money.Money) bool {
	return principal.Units() <= fp.globalMaximumApplicablePrincipal.Units() &&
		principal.Units() >= fp.globalMinimumApplicablePrincipal.Units()
}

// TotalInterestPayable calculates the total interest that will be paid
// for a selected principal amount and a tenor
func (fp *FinancialProduct) TotalInterestPayable(principal *money.Money, tenorVariantKey string) (*money.Money, error) {
	phase, err := fp._getPhaseByTenorKey(tenorVariantKey)
	if err != nil {
		return nil, err
	}

	if fp.configRoundUpMonthlyToNearest {
		monthlyInstalment, err := fp.MonthlyInstalment(principal, tenorVariantKey)
		if err != nil {
			return nil, err
		}
		totalNumOfInstallments := phase.DurationInMonths()
		return money.NewMoney(monthlyInstalment.Units()*uint64(totalNumOfInstallments) - principal.Units()), nil
	}

	return phase.interest.totalInterestPayableOnPrincipal(*principal), nil
}

func (fp *FinancialProduct) AnnualPercentageRate(principal *money.Money, fees *money.Money, tenorVariantKey string) (float64, error) {
	phase, err := fp._getPhaseByTenorKey(tenorVariantKey)
	if err != nil {
		return 0, err
	}
	totalInterest, err := fp.TotalInterestPayable(principal, tenorVariantKey)
	if err != nil {
		return 0, err
	}
	rate := ((float64(fees.Units()) + float64(totalInterest.Units())) / float64(principal.Units())) / (float64(phase.DurationInDays())) * 365
	return rate, nil
}

func (fp *FinancialProduct) AnnualInterestPercentage(tenorVariantKey string) (float64, error) {
	phase, err := fp._getPhaseByTenorKey(tenorVariantKey)
	if err != nil {
		return 0, err
	}

	AIP := (float64(phase.Interest().BasisPoints()) / 10000) / (float64(phase.DurationInMonths()) / 12)
	return AIP, nil
}

func (fp *FinancialProduct) FlatEffectiveRate(principal *money.Money, tenorVariantKey string) (float64, error) {
	totalInterest, err := fp.TotalInterestPayable(principal, tenorVariantKey)
	if err != nil {
		return 0, err
	}
	rate := float64(totalInterest.Units()) / float64(principal.Units())
	return rate, nil
}

func (fp *FinancialProduct) MonthlyInstalment(principal *money.Money, tenorVariantKey string) (*money.Money, error) {
	phase, err := fp._getPhaseByTenorKey(tenorVariantKey)
	if err != nil {
		return nil, err
	}

	totalNumOfInstallments := phase.DurationInMonths()
	interest := float64(phase.interest.interestBasisPoints) / 100

	principalPerInstallment := float64(principal.Units()) / float64(totalNumOfInstallments)
	totalFlatInterest := float64(principal.Units()) * (interest / 100)
	flatInterestPerInstallment := totalFlatInterest / float64(totalNumOfInstallments)
	monthlyInstallment := math.Round(principalPerInstallment + flatInterestPerInstallment)

	if fp.configRoundUpMonthlyToNearest {
		monthlyInstallment = math.Ceil(monthlyInstallment/100) * 100
	}
	return money.NewMoney(uint64(monthlyInstallment)), nil
}

// Get the lowest downpayment with which the resulting MonthlyInstalment will be equal to availableMonthlyPayment
func (fp *FinancialProduct) GetLowestPossibleDownpayment(principal *money.Money, tenorVariantKey string, availableMonthlyPayment *money.Money) (*money.Money, error) {
	phase, err := fp._getPhaseByTenorKey(tenorVariantKey)
	if err != nil {
		return nil, err
	}

	totalNumOfInstallments := phase.DurationInMonths()
	interest := float64(phase.interest.interestBasisPoints) / 100

	// We get this by taking the equation used in MonthlyInstalment(), and substituting principal to (principal-downpayment)
	// and checking with what downpayment that equals availableMonthlyPayment. We express the downpayment from that
	nonDownpaymentPart := (float64(totalNumOfInstallments) * float64(availableMonthlyPayment.Units())) / (1 + (interest / 100))
	// since minimum downpayment cannot be less than 0, we will set it to 0 if it would be
	downpayment := math.Max(0, float64(principal.Units())-nonDownpaymentPart)

	return money.NewMoney(uint64(math.Round(downpayment))), nil
}

// MonthlyEffectiveRate calculates the rate that is actually applied
// to the declining outstanding balance. Returns the effective rate
// as a fraction i.e. 5.25% is returned as 0.0525.
//
// Remember the effective interest rate is higher than the nominal / flat
// interest rate because it takes compounding interest into account.
// So a flat monthly of 3.66% i.e 176% for full 48 months will have an
// effective rate of 5.26%.
//
// See: https://www.investopedia.com/terms/e/effectiveinterest.asp for details
//
// See: https://www.wikihow.com/Calculate-Effective-Interest-Rate on formula of calculating
func (fp *FinancialProduct) MonthlyEffectiveRate(tenorVariantKey string, principal *money.Money) (float64, error) {
	phase, err := fp._getPhaseByTenorKey(tenorVariantKey)
	if err != nil {
		return 0, err
	}

	monthlyInstallments, err := fp.MonthlyInstalment(principal, tenorVariantKey)

	if err != nil {
		return 0, err
	}

	// TODO Write meaningful constant names below for fv, paymentType, guess
	interestRate, err := financemath.Rate(
		int(phase.DurationInMonths()), -float64(monthlyInstallments.Units()), float64(principal.Units()), 0, 0, 0.1,
	)
	if err != nil {
		return 0, err
	}

	if interestRate < 0 {
		// With 0% interest rate, financemath.Rate becomes unstable and can
		// yield slight negative monthly rate leading to underflow in interest due
		return 0, nil
	}

	// At this point we are calculating the interestRate (in decimals, e.g. 0.0167825) to
	// pure percent rounded off nearest 2 decimals (e.g. 1.68) and returning 168 (multiply by 100)

	return interestRate, err
}

// TODO Assuming MONTHLY repayment frequency for now
// TODO Improve the return type
func (fp *FinancialProduct) RepaymentDatesUTC(
	loanBookingTimeUTC time.Time,
	tenorVariantKey string,
	repaymentDay int,
) ([]time.Time, error) {

	phase, err := fp._getPhaseByTenorKey(tenorVariantKey)
	if err != nil {
		return nil, err
	}

	numberOfMonthlyInstallments := phase.DurationInMonths()
	repaymentDatesUTC := timex.GenerateMonthlyAmmortizationScheduleInUTC(loanBookingTimeUTC, numberOfMonthlyInstallments, repaymentDay)

	return repaymentDatesUTC, nil
}

func (fp *FinancialProduct) CreateAmmortizationSchedule(principal money.Money, tenorVariantKey string, loanBookingTimeUTC time.Time, repaymentDay int) ([]AmortizationScheduleInstalment, error) {
	if repaymentDay < 1 || repaymentDay > 11 {
		repaymentDay = 1
	}

	phase, err := fp._getPhaseByTenorKey(tenorVariantKey)
	if err != nil {
		return nil, err
	}

	totalInterestPayable, err := fp.TotalInterestPayable(&principal, tenorVariantKey)
	if err != nil {
		return nil, err
	}
	monthlyInstalments, err := fp.MonthlyInstalment(&principal, tenorVariantKey)
	if err != nil {
		return nil, err
	}
	monthlyEffectiveRate, err := fp.MonthlyEffectiveRate(tenorVariantKey, &principal)
	if err != nil {
		return nil, err
	}

	repaymentDatesUTC, err := fp.RepaymentDatesUTC(loanBookingTimeUTC, tenorVariantKey, repaymentDay)
	if err != nil {
		return nil, err
	}

	if len(repaymentDatesUTC) != int(phase.DurationInMonths()) {
		errMsg := fmt.Sprintf(
			"financial_product#CreateAmmortizationSchedule - repayment dates length does not match the duration of the phase, calculated repayments=%d v/s expected tenorInMonths=%d",
			len(repaymentDatesUTC),
			phase.DurationInMonths(),
		)
		return nil, errors.New(errMsg)
	}

	amortizationSchedule := make([]AmortizationScheduleInstalment, phase.DurationInMonths())

	loanBalance := principal
	for i := 0; i < int(phase.DurationInMonths()); i++ {
		// Calculate interest
		interestPaymentDue := moneyTimesFloat64(&loanBalance, monthlyEffectiveRate)
		principalPaymentDue := money.NewMoney(monthlyInstalments.Units() - interestPaymentDue.Units())
		totalInstalmentDue := money.NewMoney(interestPaymentDue.Units() + principalPaymentDue.Units())

		amortizationSchedule[i] = AmortizationScheduleInstalment{
			InstalmentDueDateUTC:  repaymentDatesUTC[i],
			GracePeriodEndDateUTC: repaymentDatesUTC[i].AddDate(0, 0, int(fp.globalGracePeriodInDays)),
			LoanBalance:           loanBalance,
			InterestDue:           *interestPaymentDue,
			PrincipalDue:          *principalPaymentDue,
			TotalInstalmentDue:    *totalInstalmentDue,
		}

		loanBalance = *money.NewMoney(loanBalance.Units() - principalPaymentDue.Units())
	}

	// What are we doing here ?
	// If you have a look at the code before that are many math.Round on a float64
	// This creates some rounding errors between the sumInterest (how much we calculated) v/s
	// totalInterestPayable (what are we expecting)
	// The code below ensures that the rounding differences is basically accommodated in the
	// last installment. Usually the differences are not more than 5-10 cents due to rounding.
	// We also looked at many other ways how banks do it, spoke to the accountants, and this is
	// the way
	// fmt.Printf("\nAmortization schedule before rounding diff handling:\n")
	// printSchedule(amortizationSchedule)
	fp.handleRoundingDifferences(
		amortizationSchedule,
		*totalInterestPayable,
		principal,
	)
	// fmt.Printf("\nAmortization schedule after rounding diff handling:\n")
	// printSchedule(amortizationSchedule)

	return amortizationSchedule, nil
}

// func printSchedule(amortizationSchedule []*AmortizationScheduleInstalment) {
// 	for _, s := range amortizationSchedule {
// 		fmt.Printf("Schedule line %s w interest due %s, principal due %s\n", s.InstalmentDueDateUTC, s.InterestDue, s.PrincipalDue)
// 	}
// }

func (fp *FinancialProduct) handleRoundingDifferences(amortizationSchedule []AmortizationScheduleInstalment, totalInterestPayable, principal money.Money) {
	sumInterest := money.NewMoney(0)
	sumPrincipal := money.NewMoney(0)

	for _, instalment := range amortizationSchedule {
		sumInterest.AddMoney(&instalment.InterestDue)
		sumPrincipal.AddMoney(&instalment.PrincipalDue)
	}

	if sumInterest.Ne(&totalInterestPayable) {
		difference := int64(totalInterestPayable.Units()) - int64(sumInterest.Units())
		fp.handleRoundingDifference(&amortizationSchedule[len(amortizationSchedule)-1].InterestDue, difference)
		fp.handleRoundingDifference(&amortizationSchedule[len(amortizationSchedule)-1].TotalInstalmentDue, difference)
	}

	if sumPrincipal.Ne(&principal) {
		difference := int64(principal.Units()) - int64(sumPrincipal.Units())
		fp.handleRoundingDifference(&amortizationSchedule[len(amortizationSchedule)-1].PrincipalDue, difference)
		fp.handleRoundingDifference(&amortizationSchedule[len(amortizationSchedule)-1].TotalInstalmentDue, difference)
	}
}

func (fp *FinancialProduct) handleRoundingDifference(moneyObj *money.Money, difference int64) {
	if difference < 0 {
		difference = -difference
		_, err := moneyObj.SubMoney(money.NewMoney(uint64(difference)))
		if err != nil {
			logging.LogHandle.WithContext(context.Background()).Errorf("error in rounding difference", err)
		}
	} else {
		moneyObj.AddMoney(money.NewMoney(uint64(difference)))
	}
}

func (fp *FinancialProduct) IsActive() bool {
	now := time.Now().UTC()
	isActivatedInFuture := now.Before(*fp.activeSince)
	isActiveUntilInFuture := fp.activeUntil != nil && now.Before(*fp.activeUntil)

	return !isActivatedInFuture && isActiveUntilInFuture
}

/************ Private utility methods ************/
func (fp *FinancialProduct) _getPhaseByTenorKey(tenorKey string) (*FinancialProductTenorPhase, error) {
	var phase *FinancialProductTenorPhase
	for _, tenor := range fp.tenorVariants {
		if tenor.key == tenorKey {
			// Assuming only 1 phase is present, when we have
			// different interest rate for different phases, this
			// need to change
			phase = tenor.tenorPhases[0]
		}
	}
	if phase == nil {
		return nil, ErrInvalidTenorKey
	}
	return phase, nil
}

// roundToNearest10000 rounds the given float64 number to the nearest 10000.
//
// Parameter:
// - x: The input float64 number.
//
// Return type:
// - float64: The rounded result.
func roundToNearest10000(x float64) float64 {
	return math.Round(x*10000) / 10000
}

func moneyTimesFloat64(oldMoney *money.Money, multiplier float64) *money.Money {
	//fmt.Printf("moneyTimesFloat64 input: %s, %f\n", oldMoney, multiplier)
	result := float64(oldMoney.Units()) * multiplier
	//fmt.Printf("moneyTimesFloat64 result 1: %f\n", result)
	result = roundToNearest10000(result)
	//fmt.Printf("moneyTimesFloat64 result rounded to nearest 10.000: %f\n", result)
	result = math.Round(result)
	//fmt.Printf("moneyTimesFloat64 result float rounded: %f\n", result)
	return money.NewMoney(uint64(result))
}
