package timex

import "time"

var localLocation *time.Location

func LoadLocalTZ() {
	l, err := time.LoadLocation("Africa/Cairo")
	if err != nil {
		panic(err)
	}
	localLocation = l
}

func GetLocalTZ() *time.Location {
	if localLocation == nil {
		LoadLocalTZ()
	}
	return localLocation
}

func GenerateMonthlyAmmortizationScheduleInUTC(bookingTimeUTC time.Time, numberOfInstallments uint16, repaymentDay int) []time.Time {
	installmentDates := make([]time.Time, numberOfInstallments)

	bookingTimeLocal := bookingTimeUTC.In(GetLocalTZ())
	bookingDate := bookingTimeLocal.Day()

	// Get the "repaymentDay" of the month when the loan is booked
	// E.g. if loan is booked on any day of March 2024, firstInstallmentDateLocal = RepaymentDay(th) March 2024
	firstInstallmentDateLocal := time.Date(bookingTimeLocal.Year(), bookingTimeLocal.Month(), repaymentDay, 23, 59, 59, 0, GetLocalTZ())
	if bookingDate <= 10 {
		// If the booking date is on or before 10th of the month, the first installment is due on the 1st of the next month
		firstInstallmentDateLocal = firstInstallmentDateLocal.AddDate(0, 1, 0)
	} else {
		// If the booking date is after 10th of the month, the first installment is due on the 1st of the month after the next month
		firstInstallmentDateLocal = firstInstallmentDateLocal.AddDate(0, 2, 0)
	}

	for i := 0; i < int(numberOfInstallments); i++ {
		installmentDates[i] = firstInstallmentDateLocal.AddDate(0, i, 0).UTC()
	}

	return installmentDates
}
