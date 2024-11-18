package domain

import (
	"errors"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/stretchr/testify/assert"
)

var fp *FinancialProduct
var fpRounded *FinancialProduct

func TestMain(m *testing.M) {
	activeSince, _ := time.Parse(time.RFC3339, "2023-09-29T15:04:05Z")
	activeUntil, _ := time.Parse(time.RFC3339, "2099-09-28T15:04:05Z")

	fp = &FinancialProduct{
		id:                            "AQBPM5420B",
		key:                           "test-financial-product",
		version:                       "1",
		previousVersion:               "NIL",
		name:                          "test-loan-1",
		description:                   "This is the first test loan",
		activeSince:                   &activeSince,
		activeUntil:                   &activeUntil,
		configRoundUpMonthlyToNearest: false,
		tenorVariants: []*FinancialProductTenorVariant{
			{
				key:            "12_Months",
				durationInDays: 360,
				tenorPhases: []*FinancialProductTenorPhase{
					{
						durationInDays: 360,
						interest: &FinancialProductInterest{
							interestBasisPoints:          8700,
							interestMethodology:          "DECLINING",
							interestCompoundingFrequency: "MONTHLY",
							interestType:                 "PERCENT",
						},
						lateFee: &FinancialProductLateFee{
							lateFeeBasisPoints: 5000,
							feeType:            "FIXED",
						},
					},
				},
			},
			{
				key:            "24_Months",
				durationInDays: 720,
				tenorPhases: []*FinancialProductTenorPhase{
					{
						durationInDays: 720,
						interest: &FinancialProductInterest{
							interestBasisPoints:          10300,
							interestMethodology:          "DECLINING",
							interestCompoundingFrequency: "MONTHLY",
							interestType:                 "PERCENT",
						},
						lateFee: &FinancialProductLateFee{
							lateFeeBasisPoints: 5000,
							feeType:            "FIXED",
						},
					},
				},
			},
			{
				key:            "48_Months",
				durationInDays: 1440,
				tenorPhases: []*FinancialProductTenorPhase{
					{
						durationInDays: 1440,
						interest: &FinancialProductInterest{
							interestBasisPoints:          17600,
							interestMethodology:          "DECLINING",
							interestCompoundingFrequency: "MONTHLY",
							interestType:                 "PERCENT",
						},
						lateFee: &FinancialProductLateFee{
							lateFeeBasisPoints: 5000,
							feeType:            "FIXED",
						},
					},
				},
			},
		},
		globalAdminFee: &FinancialProductAdminFee{
			feeType:  "MONETARY",
			fixedFee: money.NewMoney(3008),
		},
		globalBadDebt: &FinancialProductBadDebt{
			badDebtBasisPoints: 107,
		},
		globalGracePeriodInDays:          3,
		globalMinimumApplicablePrincipal: money.NewMoney(1000),
		globalMaximumApplicablePrincipal: money.NewMoney(100000000),
		globalRepaymentDaysOfMonth:       []uint8{8, 20},
	}

	fpRounded = &FinancialProduct{
		id:                            "AQBPM5420B",
		key:                           "test-financial-product",
		version:                       "1",
		previousVersion:               "NIL",
		name:                          "test-loan-1",
		description:                   "This is the first test loan",
		activeSince:                   &activeSince,
		activeUntil:                   &activeUntil,
		configRoundUpMonthlyToNearest: true,
		tenorVariants: []*FinancialProductTenorVariant{
			{
				key:            "12_Months",
				durationInDays: 360,
				tenorPhases: []*FinancialProductTenorPhase{
					{
						durationInDays: 360,
						interest: &FinancialProductInterest{
							interestBasisPoints:          4400,
							interestMethodology:          "DECLINING",
							interestCompoundingFrequency: "MONTHLY",
							interestType:                 "PERCENT",
						},
						lateFee: &FinancialProductLateFee{
							lateFeeBasisPoints: 5000,
							feeType:            "FIXED",
						},
					},
				},
			},
			{
				key:            "24_Months",
				durationInDays: 720,
				tenorPhases: []*FinancialProductTenorPhase{
					{
						durationInDays: 720,
						interest: &FinancialProductInterest{
							interestBasisPoints:          10300,
							interestMethodology:          "DECLINING",
							interestCompoundingFrequency: "MONTHLY",
							interestType:                 "PERCENT",
						},
						lateFee: &FinancialProductLateFee{
							lateFeeBasisPoints: 5000,
							feeType:            "FIXED",
						},
					},
				},
			},
			{
				key:            "48_Months",
				durationInDays: 1440,
				tenorPhases: []*FinancialProductTenorPhase{
					{
						durationInDays: 1440,
						interest: &FinancialProductInterest{
							interestBasisPoints:          17600,
							interestMethodology:          "DECLINING",
							interestCompoundingFrequency: "MONTHLY",
							interestType:                 "PERCENT",
						},
						lateFee: &FinancialProductLateFee{
							lateFeeBasisPoints: 5000,
							feeType:            "FIXED",
						},
					},
				},
			},
		},
		globalAdminFee: &FinancialProductAdminFee{
			feeType:  "MONETARY",
			fixedFee: money.NewMoney(3008),
		},
		globalBadDebt: &FinancialProductBadDebt{
			badDebtBasisPoints: 107,
		},
		globalGracePeriodInDays:          3,
		globalMinimumApplicablePrincipal: money.NewMoney(1000),
		globalMaximumApplicablePrincipal: money.NewMoney(100000000),
		globalRepaymentDaysOfMonth:       []uint8{8, 20},
	}

	// Run the tests
	exitCode := m.Run()

	// Clean up any resources if needed

	os.Exit(exitCode)
}
func TestFinancialProduct_IsActive(t *testing.T) {

}

func TestMonthlyInstalment(t *testing.T) {
	testCases := []struct {
		name                      string
		principal                 *money.Money
		tenorVariantKey           string
		expectedMonthlyInstalment uint64
		expectedError             error
		fp                        *FinancialProduct
	}{
		{
			name:                      "Test Monthly Instalment valid",
			principal:                 money.NewMoney(80000), // Principal amount in cents
			tenorVariantKey:           "48_Months",
			expectedMonthlyInstalment: 4600, // Expected monthly installment in cents
			expectedError:             nil,
			fp:                        fp,
		},
		{
			name:                      "Test Monthly Instalment invalid tenor",
			principal:                 money.NewMoney(80000), // Principal amount in cents
			tenorVariantKey:           "48_M",
			expectedMonthlyInstalment: 4600, // Expected monthly installment in cents
			expectedError:             errors.New("invalid tenor key for the financial product"),
			fp:                        fp,
		},
		{
			name:                      "Test Monthly Instalment rounded up as expected",
			principal:                 money.NewMoney(77000),
			tenorVariantKey:           "12_Months",
			expectedMonthlyInstalment: 9300,
			expectedError:             nil,
			fp:                        fpRounded,
		},
		{
			name:                      "Test Monthly Instalment rounded up does not change when rounded expected",
			principal:                 money.NewMoney(75000),
			tenorVariantKey:           "12_Months",
			expectedMonthlyInstalment: 9000,
			expectedError:             nil,
			fp:                        fpRounded,
		},
	}

	for _, tc := range testCases {
		t.Run(fmt.Sprintf("%s Principal=%d, TenorVariantKey=%s", tc.name, tc.principal.Units(), tc.tenorVariantKey), func(t *testing.T) {

			monthlyInstalment, err := tc.fp.MonthlyInstalment(tc.principal, tc.tenorVariantKey)

			// Check if the error matches the expected error
			assert.Equal(t, tc.expectedError, err)

			if err == nil {
				// Check if the monthly installment matches the expected installment within a small tolerance
				assert.Equal(t, tc.expectedMonthlyInstalment, monthlyInstalment.Units(), "monthly installment %d does not match expected %d value", monthlyInstalment.Units, tc.expectedMonthlyInstalment)
			}
		})
	}
}

func TestMonthlyEffectiveRate(t *testing.T) {
	testCases := []struct {
		name                  string
		principal             *money.Money
		tenorVariantKey       string
		expectedEffectiveRate float64
		expectedError         error
		fp                    *FinancialProduct
	}{
		{
			name:                  "Test Monthly Effective Rate valid",
			principal:             money.NewMoney(80000), // Principal amount in cents
			tenorVariantKey:       "48_Months",
			expectedEffectiveRate: 0.0526, // Expected effective rate (decimal)
			expectedError:         nil,
			fp:                    fp,
		},
		{
			name:                  "Test Monthly Effective Rate invalid tenor",
			principal:             money.NewMoney(80000), // Principal amount in cents
			tenorVariantKey:       "48_M",
			expectedEffectiveRate: 0, // Expected effective rate is 0 for invalid tenor
			expectedError:         errors.New("invalid tenor key for the financial product"),
			fp:                    fp,
		},
	}

	for _, tc := range testCases {
		t.Run(fmt.Sprintf("%s Principal=%d, TenorVariantKey=%s", tc.name, tc.principal.Units(), tc.tenorVariantKey), func(t *testing.T) {
			effectiveRate, err := tc.fp.MonthlyEffectiveRate(tc.tenorVariantKey, tc.principal)

			// Check if the error matches the expected error
			assert.Equal(t, tc.expectedError, err)

			if err == nil {
				// Check if the effective rate matches the expected rate within a small tolerance
				assert.InDelta(t, tc.expectedEffectiveRate, effectiveRate, 0.0001, "effective rate does not match")
			}
		})
	}
}

func TestAnnualPercentageRate(t *testing.T) {
	testCases := []struct {
		name               string
		principal          *money.Money
		fees               *money.Money
		tenorVariantKey    string
		expectedAnnualRate float64
		expectedError      error
		fp                 *FinancialProduct
	}{
		{
			name:               "Test Annual Percentage Rate valid 1",
			tenorVariantKey:    "12_Months",
			principal:          money.NewMoney(80000),
			fees:               money.NewMoney(200),
			expectedAnnualRate: 0.8846, // Expected annual percentage rate (decimal)
			fp:                 fp,
		},
		{
			name:               "Test Annual Percentage Rate valid 2",
			tenorVariantKey:    "24_Months",
			principal:          money.NewMoney(1232131),
			fees:               money.NewMoney(0),
			expectedAnnualRate: 0.5221, // Expected annual percentage rate (decimal)
			fp:                 fp,
		},
		{
			name:               "Test Annual Percentage Rate valid 3",
			tenorVariantKey:    "48_Months",
			principal:          money.NewMoney(324224),
			fees:               money.NewMoney(344),
			expectedAnnualRate: 0.4463, // Expected annual percentage rate (decimal)
			fp:                 fp,
		},
		{
			name:               "Test Annual Percentage Rate invalid tenor",
			tenorVariantKey:    "48_M",
			principal:          money.NewMoney(80000),
			fees:               money.NewMoney(200),
			expectedAnnualRate: 0, // Expected annual percentage rate is 0 for invalid tenor
			expectedError:      errors.New("invalid tenor key for the financial product"),
			fp:                 fp,
		},
	}

	for _, tc := range testCases {
		t.Run(fmt.Sprintf("%s TenorVariantKey=%s", tc.name, tc.tenorVariantKey), func(t *testing.T) {
			annualPercentageRate, err := tc.fp.AnnualPercentageRate(tc.principal, tc.fees, tc.tenorVariantKey)

			// Check if the error matches the expected error
			assert.Equal(t, tc.expectedError, err)

			if err == nil {
				// Check if the annual interest rate matches the expected rate within a small tolerance
				assert.InDelta(t, tc.expectedAnnualRate, annualPercentageRate, 0.0001, "annual percentage rate does not match")
			}
		})
	}
}

func TestTotalInterestPayable(t *testing.T) {
	testCases := []struct {
		name                   string
		principal              *money.Money
		tenorVariantKey        string
		expectedInterestAmount uint64
		expectedError          error
		fp                     *FinancialProduct
	}{
		{
			name:                   "Test Total Interest Payable valid",
			principal:              money.NewMoney(80000), // Principal amount in cents
			tenorVariantKey:        "48_Months",
			expectedInterestAmount: 140800, // Expected total interest payable in cents
			expectedError:          nil,
			fp:                     fp,
		},
		{
			name:                   "Test Total Interest Payable invalid tenor",
			principal:              money.NewMoney(80000), // Principal amount in cents
			tenorVariantKey:        "48_M",
			expectedInterestAmount: 0, // Expected interest amount is 0 for invalid tenor
			expectedError:          errors.New("invalid tenor key for the financial product"),
			fp:                     fp,
		},
	}

	for _, tc := range testCases {
		t.Run(fmt.Sprintf("%s Principal=%d, TenorVariantKey=%s", tc.name, tc.principal.Units(), tc.tenorVariantKey), func(t *testing.T) {
			interestAmount, err := tc.fp.TotalInterestPayable(tc.principal, tc.tenorVariantKey)

			// Check if the error matches the expected error
			assert.Equal(t, tc.expectedError, err)

			if err == nil {
				// Check if the interest amount matches the expected amount
				assert.Equal(t, tc.expectedInterestAmount, interestAmount.Units(), "interest amount does not match")
			}
		})
	}
}

func TestRepaymentDates(t *testing.T) {
	cairoTime := func(t string) time.Time {
		cairo, _ := time.Parse(time.RFC3339, t)
		return cairo
	}

	// Define a test case with a specific booking date and tenor variant key
	testCases := []struct {
		name               string
		loanBookingDateUTC time.Time
		repaymentDay       int
		tenorVariantKey    string
		expectedDates      []time.Time
		expectedError      error
		fp                 *FinancialProduct
	}{
		{
			name: "Test Repayment Dates valid",
			// Loan Booked At: 1st January 2024 at 1:59 AM Cairo = 31st December 2023 at 11:59 PM UTC
			loanBookingDateUTC: cairoTime("2024-01-01T01:59:58+02:00").UTC(),
			repaymentDay:       5,
			tenorVariantKey:    "12_Months",
			expectedDates: func() []time.Time {
				dates := make([]time.Time, 12)
				// First repayment due date is 5th February at 11:59 PM Cairo = 4th January at 9:59 PM UTC
				dates[0] = cairoTime("2024-02-05T23:59:59+02:00").UTC()
				// Second repayment due date is 5th March at 11:59 PM Cairo = 4th February at 9:59 PM UTC
				dates[1] = cairoTime("2024-03-05T23:59:59+02:00").UTC()
				// Third repayment due date is 5th April at 11:59 PM Cairo = 4th March at 9:59 PM UTC
				dates[2] = cairoTime("2024-04-05T23:59:59+02:00").UTC()
				// Fourth repayment due date is 5th May at 11:59 PM Cairo = 4th April at 8:59 PM UTC
				dates[3] = cairoTime("2024-05-05T23:59:59+03:00").UTC()
				// Fifth repayment due date is 5th June at 11:59 PM Cairo = 4th May at 8:59 PM UTC
				dates[4] = cairoTime("2024-06-05T23:59:59+03:00").UTC()
				// Sixth repayment due date is 5th July at 11:59 PM Cairo = 4th June at 8:59 PM UTC
				dates[5] = cairoTime("2024-07-05T23:59:59+03:00").UTC()
				// Seventh repayment due date is 5th August at 11:59 PM Cairo = 4th July at 8:59 PM UTC
				dates[6] = cairoTime("2024-08-05T23:59:59+03:00").UTC()
				// Eighth repayment due date is 5th September at 11:59 PM Cairo = 4th August at 8:59 PM UTC
				dates[7] = cairoTime("2024-09-05T23:59:59+03:00").UTC()
				// Ninth repayment due date is 5th October at 11:59 PM Cairo = 4th September at 8:59 PM UTC
				dates[8] = cairoTime("2024-10-05T23:59:59+03:00").UTC()
				// Tenth repayment due date is 5th November at 11:59 PM Cairo = 4th October at 9:59 PM UTC
				dates[9] = cairoTime("2024-11-05T23:59:59+02:00").UTC()
				// Eleventh repayment due date is 5th December at 11:59 PM Cairo = 4th November at 9:59 PM UTC
				dates[10] = cairoTime("2024-12-05T23:59:59+02:00").UTC()
				// Twelfth repayment due date is 5th January 2025 at 11:59 PM Cairo = 4th December 2024 at 9:59 PM UTC
				dates[11] = cairoTime("2025-01-05T23:59:59+02:00").UTC()
				return dates
			}(),
			expectedError: nil,
			fp:            fp,
		},
		{
			name:               "Test Repayment Dates invalid tenor",
			loanBookingDateUTC: time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC),
			repaymentDay:       5,
			tenorVariantKey:    "48_M",
			expectedDates:      nil,
			expectedError:      errors.New("invalid tenor key for the financial product"),
			fp:                 fp,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			repaymentDates, err := tc.fp.RepaymentDatesUTC(tc.loanBookingDateUTC, tc.tenorVariantKey, tc.repaymentDay)

			// Check if the error matches the expected error
			assert.Equal(t, tc.expectedError, err)

			if err == nil {
				// Check if the repayment dates match the expected dates
				assert.Equal(t, tc.expectedDates, repaymentDates, "repayment dates do not match")
			}
		})
	}
}

func TestMoneyTimesFloat64(t *testing.T) {
	testCases := []struct {
		name           string
		oldMoney       *money.Money
		multiplier     float64
		expectedResult *money.Money
	}{
		{
			name:           "Test Money Times Float64 1",
			oldMoney:       money.NewMoney(80000), // 800.00 EGP
			multiplier:     0.0525879,
			expectedResult: money.NewMoney(4207), // 42.07 EGP
		},
		{
			name:           "Test Money Times Float64 2",
			oldMoney:       money.NewMoney(78758), // 787.58 EGP
			multiplier:     0.0525879,
			expectedResult: money.NewMoney(4142), // 41.42 EGP
		},
		{
			name:           "Test Money Times Float64 3",
			oldMoney:       money.NewMoney(79193), // 791.93 EGP
			multiplier:     0.0525879,
			expectedResult: money.NewMoney(4165), // 41.65 EGP
		},
		{
			name:           "Test Money Times Float64 4",
			oldMoney:       money.NewMoney(79193), // 791.93 EGP
			multiplier:     0,
			expectedResult: money.NewMoney(0), // 0 EGP
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result := moneyTimesFloat64(tc.oldMoney, tc.multiplier)
			// Check if the result matches the expected result
			assert.Equal(t, tc.expectedResult, result, "result does not match expected result")
		})
	}
}

func TestHandleRoundingDifference(t *testing.T) {
	testCases := []struct {
		name           string
		moneyObj       money.Money
		difference     int64
		expectedResult money.Money
	}{
		{
			name:           "Test Handle Rounding Difference with negative difference",
			moneyObj:       *money.NewMoney(1000), // 10.00 EGP
			difference:     -500,                  // -5.00 EGP
			expectedResult: *money.NewMoney(500),  // 5.00 EGP
		},
		{
			name:           "Test Handle Rounding Difference with positive difference",
			moneyObj:       *money.NewMoney(2000), // 20.00 EGP
			difference:     750,                   // 7.50 EGP
			expectedResult: *money.NewMoney(2750), // 27.50 EGP
		},
		{
			name:           "Test Handle Rounding Difference with zero difference",
			moneyObj:       *money.NewMoney(3000), // 30.00 EGP
			difference:     0,                     // No change
			expectedResult: *money.NewMoney(3000), // 30.00 EGP
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			fp.handleRoundingDifference(&tc.moneyObj, tc.difference)

			// Check if the money object matches the expected result
			assert.Equal(t, tc.expectedResult.Units(), tc.moneyObj.Units(), "money object does not match expected result")
		})
	}
}

func TestHandleRoundingDifferences(t *testing.T) {

	testCases := []struct {
		name                 string
		amortizationSchedule []AmortizationScheduleInstalment
		principal            *money.Money
		totalInterestPayable *money.Money
		expectedSchedule     []AmortizationScheduleInstalment
	}{
		{
			name: "Test Handle Rounding Differences with matching sums",
			amortizationSchedule: []AmortizationScheduleInstalment{
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
			},
			principal:            money.NewMoney(1000),
			totalInterestPayable: money.NewMoney(1000),
			expectedSchedule: []AmortizationScheduleInstalment{
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
			},
		},
		{
			name: "Test Handle Rounding Differences with interest mismatch",
			amortizationSchedule: []AmortizationScheduleInstalment{
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
			},
			principal:            money.NewMoney(1000),
			totalInterestPayable: money.NewMoney(900),
			expectedSchedule: []AmortizationScheduleInstalment{
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
				{InterestDue: *money.NewMoney(400), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(900)}, // Adjusted
			},
		},
		{
			name: "Test Handle Rounding Differences with principal mismatch",
			amortizationSchedule: []AmortizationScheduleInstalment{
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
			},
			principal:            money.NewMoney(900),
			totalInterestPayable: money.NewMoney(1000),
			expectedSchedule: []AmortizationScheduleInstalment{
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(500), TotalInstalmentDue: *money.NewMoney(1000)},
				{InterestDue: *money.NewMoney(500), PrincipalDue: *money.NewMoney(400), TotalInstalmentDue: *money.NewMoney(900)}, // Adjusted
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			fp.handleRoundingDifferences(tc.amortizationSchedule, *tc.totalInterestPayable, *tc.principal)

			// Check if the modified schedule matches the expected schedule
			assert.Equal(t, tc.expectedSchedule, tc.amortizationSchedule, "amortization schedule does not match expected schedule")
		})
	}
}

func TestCreateAmmortizationSchedule(t *testing.T) {
	// Define some example input values for testing
	principal := money.NewMoney(80000) // 100.00 EGP
	desiredLoanBookingDate := time.Date(2022, 12, 1, 0, 0, 0, 0, time.UTC)

	testCases := []struct {
		name             string
		principal        *money.Money
		tenorVariantKey  string
		bookingDate      *time.Time
		repaymentDay     int
		expectedSchedule []*AmortizationScheduleInstalment
		expectedError    error
		fp               *FinancialProduct
	}{
		{
			name:             "Test Create Ammortization Schedule with valid inputs",
			principal:        principal,
			tenorVariantKey:  "48_Months",
			repaymentDay:     1,
			bookingDate:      &desiredLoanBookingDate,
			expectedSchedule: []*AmortizationScheduleInstalment{
				//TODO Define expected instalments here
			},
			expectedError: nil,
			fp:            fp,
		},
		{
			name:             "Test Create Ammortization Schedule with invalid tenor key",
			principal:        principal,
			tenorVariantKey:  "InvalidTenor",
			repaymentDay:     1,
			bookingDate:      &desiredLoanBookingDate,
			expectedSchedule: nil,
			expectedError:    errors.New("invalid tenor key for the financial product"),
			fp:               fp,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			amortizationSchedule, err := tc.fp.CreateAmmortizationSchedule(*tc.principal, tc.tenorVariantKey, *tc.bookingDate, tc.repaymentDay)

			if tc.expectedError != nil {
				// Check if an error is expected
				assert.EqualError(t, err, tc.expectedError.Error(), "error does not match expected error")
				assert.Nil(t, amortizationSchedule, "amortization schedule should be nil on error")
			} else {
				// Check if the created schedule matches the expected schedule
				assert.NoError(t, err, "unexpected error")
				assert.NotNil(t, amortizationSchedule, "amortization schedule should not be nil")
				//TODO Check if the created schedule matches the expected schedule
			}
		})
	}
}

func TestAdminFee(t *testing.T) {
	testCases := []struct {
		name               string
		principal          *money.Money
		adminFeeFlat       *money.Money
		adminFeePercentage uint64
		feeType            adminFeeType
		expected           uint64
	}{
		{
			name:               "Test Admin Fee with both flat and percentage",
			principal:          money.NewMoney(100000), // EGP 1000.00
			adminFeeFlat:       money.NewMoney(1234),   // EGP 12.34
			adminFeePercentage: 100,                    // 1%
			feeType:            FormulaAdminFeeType,
			expected:           uint64(2234),
		},
		{
			name:               "Test Admin Fee with flat fee",
			principal:          money.NewMoney(100000), // EGP 1000.00
			adminFeeFlat:       money.NewMoney(1234),   // EGP 12.34
			adminFeePercentage: 0,                      // 0%
			feeType:            MonetaryAdminFeeType,
			expected:           uint64(1234),
		},
		{
			name:               "Test Admin Fee with percentage fee",
			principal:          money.NewMoney(100000), // EGP 1000.00
			adminFeeFlat:       money.NewMoney(0),      // EGP 0.00
			adminFeePercentage: 100,                    // 1%
			feeType:            FormulaAdminFeeType,
			expected:           uint64(1000),
		},
		{
			name:               "Test Admin Fee with no admin fee",
			principal:          money.NewMoney(100000), // EGP 1000.00
			adminFeeFlat:       money.NewMoney(0),      // EGP 0.00
			adminFeePercentage: 0,                      // 0%
			feeType:            FormulaAdminFeeType,
			expected:           uint64(0),
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			fp := &FinancialProduct{
				globalAdminFee: &FinancialProductAdminFee{
					feeType:                  FormulaAdminFeeType,
					fixedFee:                 tc.adminFeeFlat,
					percentageFeeBasisPoints: tc.adminFeePercentage,
				},
				tenorVariants: []*FinancialProductTenorVariant{
					{
						key:            "12_Months",
						durationInDays: 360,
						adminFee:       nil,
					},
				},
			}

			adminFee, err := fp.AdminFee(tc.principal, 0, "12_Months")
			assert.Nil(t, err)
			assert.Equal(t, tc.expected, adminFee.Units(), "admin fee does not match expected admin fee")

		})
	}
}

func TestGetLowestPossibleDownpayment(t *testing.T) {
	fp := &FinancialProduct{
		tenorVariants: []*FinancialProductTenorVariant{
			{
				key:            "12_Months",
				durationInDays: 360,
				tenorPhases: []*FinancialProductTenorPhase{
					{
						durationInDays: 360,
						interest: &FinancialProductInterest{
							interestBasisPoints:          1000,
							interestMethodology:          "DECLINING",
							interestCompoundingFrequency: "MONTHLY",
							interestType:                 "PERCENT",
						},
						lateFee: &FinancialProductLateFee{
							lateFeeBasisPoints: 5000,
							feeType:            "FIXED",
						},
					},
				},
			},
		},
	}

	principal := money.NewMoney(100000)
	monthlyAvailablePayment := money.NewMoney(3000)

	res, err := fp.GetLowestPossibleDownpayment(principal, "12_Months", monthlyAvailablePayment)
	assert.Nil(t, err)

	// We expect that if we reduce the principal with the resulting downpayment, the monthly instalment will exactly be the availableMonthlyInstalment
	principalMinusDownpayment, err := principal.SubMoney(res)
	assert.Nil(t, err)

	instalment, err := fp.MonthlyInstalment(principalMinusDownpayment, "12_Months")
	assert.Nil(t, err)
	assert.Equal(t, monthlyAvailablePayment.Units(), instalment.Units())
}
