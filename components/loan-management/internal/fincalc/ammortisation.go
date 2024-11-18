package fincalc

import (
	"errors"
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/timex"
	"math"
	"time"
)

type AmmortisationLineItem struct {
	InstalmentDueDate  timex.UtcTime
	GracePeriodEndDate timex.UtcTime
	LoanBalance        money.Money
	PrincipalDue       money.Money
	InterestDue        money.Money
	CumulativeInterest money.Money
	TotalInstalmentDue money.Money
}

// CalculatePaymentDates calculates the payment dates for a loan based on the initial booking date,
// the total number of payments, the specific day of the month designated for repayments, and a cutoff day
// of the month which influences the date of the first payment. This function ensures that all payment dates
// are adjusted to the end of the day (23:59:59) in the local timezone before converting them to UTC, to
// maintain consistency with local time practices and daylight saving adjustments.
//
// Parameters:
// - numberOfPayments: The total number of payments to be made.
// - bookingDateUtc: The booking date of the loan in UTC.
// - repaymentDay: The day of the month on which repayments are scheduled.
// - dayOfMonthCutOff: A cutoff day of the month that affects the scheduling of the first payment.
//
// Returns:
// - A slice of timex.UtcTime objects representing the due dates for each payment in UTC.
func CalculatePaymentDates(numberOfPayments uint32, bookingDateUtc timex.UtcTime, repaymentDay int, dayOfMonthCutOff int) []timex.UtcTime {
	bookingDateLocal := bookingDateUtc.InLocalTZ()
	if bookingDateLocal.Before(config.LocalDateRepaymentDayToStaticFirstOfMonth) {
		return paymentDatesMatchBookingDateLocal(numberOfPayments, bookingDateUtc)
	}
	if bookingDateLocal.Before(config.LocalDateRepaymentDayToConsumerLevelDefined) {
		return paymentDatesMatchFirstOfMonth(numberOfPayments, bookingDateUtc)
	}
	return paymentDatesMatchConsumerLevelDefinedDate(numberOfPayments, bookingDateUtc, repaymentDay, dayOfMonthCutOff)
}

func paymentDatesMatchBookingDateLocal(numberOfPayments uint32, bookingDateUtc timex.UtcTime) []timex.UtcTime {
	bookingTimeLocal := bookingDateUtc.InLocalTZ()
	installmentPaymentDateLocal := time.Date(
		bookingTimeLocal.Year(),
		bookingTimeLocal.Month(),
		bookingTimeLocal.Day(),
		23,
		59,
		59,
		0,
		time.Local)

	repaymentDatesUTC := make([]timex.UtcTime, numberOfPayments)

	for i := 0; i < int(numberOfPayments); i++ {
		repaymentDatesUTC[i] = timex.NewUtcTime(installmentPaymentDateLocal.AddDate(0, i+1, 0))
	}

	return repaymentDatesUTC
}

func paymentDatesMatchFirstOfMonth(numberOfPayments uint32, bookingDateUtc timex.UtcTime) []timex.UtcTime {
	bookingTimeLocal := bookingDateUtc.InLocalTZ()
	bookingDate := bookingTimeLocal.Day()

	// Get the first day of the month when the loan is booked
	// E.g. if loan is booked on any day of March 2024, firstInstallmentDateLocal = 1st March 2024
	firstInstallmentDateLocal := time.Date(bookingTimeLocal.Year(), bookingTimeLocal.Month(), 1, 23, 59, 59, 0, time.Local)
	if bookingDate <= 10 {
		// If the booking date is on or before 10th of the month, the first installment is due on the 1st of the next month
		firstInstallmentDateLocal = firstInstallmentDateLocal.AddDate(0, 1, 0)
	} else {
		// If the booking date is after 10th of the month, the first installment is due on the 1st of the month after the next month
		firstInstallmentDateLocal = firstInstallmentDateLocal.AddDate(0, 2, 0)
	}

	repaymentDatesUTC := make([]timex.UtcTime, numberOfPayments)

	for i := 0; i < int(numberOfPayments); i++ {
		repaymentDatesUTC[i] = timex.NewUtcTime(firstInstallmentDateLocal.AddDate(0, i, 0))
	}

	return repaymentDatesUTC
}

func paymentDatesMatchConsumerLevelDefinedDate(numberOfPayments uint32, bookingDateUtc timex.UtcTime, repaymentDay int, dayOfMonthCutOff int) []timex.UtcTime {
	bookingDateLocal := bookingDateUtc.InLocalTZ()
	bookingDay := bookingDateLocal.Day()
	firstInstalmentDate := time.Date(bookingDateLocal.Year(), bookingDateLocal.Month(), repaymentDay, 23, 59, 59, 0, time.Local)
	if bookingDay > dayOfMonthCutOff {
		firstInstalmentDate = firstInstalmentDate.AddDate(0, 2, 0)
	} else {
		firstInstalmentDate = firstInstalmentDate.AddDate(0, 1, 0)
	}

	dates := make([]timex.UtcTime, 0)
	for i := 0; i < int(numberOfPayments); i++ {
		dates = append(dates, timex.NewUtcTime(firstInstalmentDate.AddDate(0, i, 0)))
	}
	return dates
}

// AmmortizationSchedule calculates the amortization schedule for a loan given its parameters.
// It generates a list of AmmortisationLineItem, each representing an installment with its due date,
// grace period end date, loan balance, principal due, interest due, and total installment due.
//
// This function assumes a monthly payment frequency and calculates the repayment dates based on the
// loan term, booking date, repayment day, and a cutoff day of the month. It then iterates through
// each repayment date to calculate the interest due, principal due, and updates the loan balance
// accordingly. If the loan balance becomes less than the principal due at any installment, it returns
// an error indicating a possible miscalculation of the monthly effective rate.
//
// In the end, if there's any remaining loan balance after all installments are paid, it is added
// to the last installment as interest. This ensures that the entire loan balance is accounted for
// in the amortization schedule.
//
// Parameters:
// - principalAmount: The total loan amount.
// - bookingDateUtc: The booking date of the loan in UTC.
// - loanTermInDays: The total term of the loan in days.
// - monthlyInstalment: The expected monthly installment amount.
// - monthlyEffectiveRate: The monthly interest rate.
// - repaymentDay: The day of the month on which repayments are scheduled.
// - dayOfMonthCutOff: A cutoff day of the month that affects the scheduling of the first payment.
// - gracePeriodInDays: The grace period in days after the installment due date.
//
// Returns:
// - A slice of AmmortisationLineItem representing the amortization schedule.
// - An error if the loan balance is less than the principal due at any installment.
func AmmortizationSchedule(
	principalAmount money.Money,
	bookingDateUtc timex.UtcTime,
	loanTermInDays uint32,
	monthlyInstalment money.Money,
	monthlyEffectiveRate float64,
	repaymentDay int,
	dayOfMonthCutOff int,
	gracePeriodInDays uint32,
) ([]AmmortisationLineItem, error) {

	// assuming monthly payment frequency
	totalNumberOfPayments := loanTermInDays / config.DaysInMonth
	repaymentDates := CalculatePaymentDates(totalNumberOfPayments, bookingDateUtc, repaymentDay, dayOfMonthCutOff)
	loanBalance := money.NewMoney(principalAmount.Amount(), principalAmount.Currency().Code)

	ammortizationScheduleInstalments := make([]AmmortisationLineItem, 0)
	cumulativeInterestUnits := uint64(0)

	for i, repaymentDateUTC := range repaymentDates {
		interestDue := math.Round(monthlyEffectiveRate * float64(loanBalance.Amount()))
		interestDueMoney := money.NewMoney(uint64(interestDue), principalAmount.Currency().Code)
		principalDue := monthlyInstalment.MustSub(interestDueMoney)
		totalDue := principalDue.MustAdd(interestDueMoney)
		if totalDue.Amount() != monthlyInstalment.Amount() {
			return nil, errors.New(fmt.Sprintf("principal and interest due do not sum up to total instalment due at instalment number %d", i+1))
		}

		if i == len(repaymentDates)-1 {
			diff := loanBalance.Amount() - principalDue.Amount()
			if diff > 0 {
				principalDue = money.NewMoney(loanBalance.Amount(), principalAmount.Currency().Code)
				interestDueMoney = money.NewMoney(uint64(interestDue)-diff, principalAmount.Currency().Code)
			}
		}

		if interestDueMoney.Amount() < 0 {
			return nil, errors.New(fmt.Sprintf("interest due cannot be less than 0 for instalment: %d", i+1))
		}

		cumulativeInterestUnits += interestDueMoney.Amount()
		ammortizationScheduleInstalments = append(ammortizationScheduleInstalments, AmmortisationLineItem{
			InstalmentDueDate:  repaymentDateUTC,
			GracePeriodEndDate: timex.NewUtcTime(repaymentDateUTC.AddDate(0, 0, int(gracePeriodInDays))),
			LoanBalance:        *loanBalance,
			PrincipalDue:       *principalDue,
			InterestDue:        *interestDueMoney,
			CumulativeInterest: *money.NewMoney(cumulativeInterestUnits, interestDueMoney.Currency().Code),
			TotalInstalmentDue: monthlyInstalment,
		})

		loanBalance.MustMutateSub(principalDue)
	}

	//ammortizationScheduleInstalments = adjustDeltaOnCollectedPrincipal(ammortizationScheduleInstalments, principalAmount)
	return ammortizationScheduleInstalments, nil
}
