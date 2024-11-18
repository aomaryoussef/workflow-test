package timex

import (
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestGenerateMonthlyAmmortizationScheduleInUTC(t *testing.T) {
	t.Run("when booking date is 1st of November 2024 then installment starts 9th December 2024", func(t *testing.T) {
		bookingTimeLocal := time.Date(2024, 11, 1, 0, 0, 0, 0, GetLocalTZ())
		installmentDates := GenerateMonthlyAmmortizationScheduleInUTC(bookingTimeLocal.UTC(), 3, 9)
		assert.Equal(t, 3, len(installmentDates))
		assert.Equal(t, time.Date(2024, 12, 9, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[0])
		assert.Equal(t, time.Date(2025, 1, 9, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[1])
		assert.Equal(t, time.Date(2025, 2, 9, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[2])
	})
	t.Run("when booking date is 10th of November 2024 then installment starts 9th December 2024", func(t *testing.T) {
		bookingTimeLocal := time.Date(2024, 11, 10, 0, 0, 0, 0, GetLocalTZ())
		installmentDates := GenerateMonthlyAmmortizationScheduleInUTC(bookingTimeLocal.UTC(), 3, 9)
		assert.Equal(t, 3, len(installmentDates))
		assert.Equal(t, time.Date(2024, 12, 9, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[0])
		assert.Equal(t, time.Date(2025, 1, 9, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[1])
		assert.Equal(t, time.Date(2025, 2, 9, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[2])
	})
	t.Run("when booking date is 11th of November 2024 then installment starts 8th January 2025", func(t *testing.T) {
		bookingTimeLocal := time.Date(2024, 11, 11, 0, 0, 0, 0, GetLocalTZ())
		installmentDates := GenerateMonthlyAmmortizationScheduleInUTC(bookingTimeLocal.UTC(), 3, 8)
		assert.Equal(t, 3, len(installmentDates))
		assert.Equal(t, time.Date(2025, 1, 8, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[0])
		assert.Equal(t, time.Date(2025, 2, 8, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[1])
		assert.Equal(t, time.Date(2025, 3, 8, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[2])
	})
	t.Run("when booking date is 30th of November 2024 then installment starts 8th January 2025", func(t *testing.T) {
		bookingTimeLocal := time.Date(2024, 11, 30, 0, 0, 0, 0, GetLocalTZ())
		installmentDates := GenerateMonthlyAmmortizationScheduleInUTC(bookingTimeLocal.UTC(), 3, 8)
		assert.Equal(t, 3, len(installmentDates))
		assert.Equal(t, time.Date(2025, 1, 8, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[0])
		assert.Equal(t, time.Date(2025, 2, 8, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[1])
		assert.Equal(t, time.Date(2025, 3, 8, 23, 59, 59, 0, GetLocalTZ()).UTC(), installmentDates[2])
	})
}
