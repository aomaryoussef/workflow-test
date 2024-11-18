package aggregate

import (
	"github.com/btechlabs/lms/internal/fincalc"
)

type AmortizationSchedule struct {
	Tenor                FinancialProductTenor
	ScheduledInstalments []fincalc.AmmortisationLineItem
}

//func (fp *FinancialProductAggregate) AmmortizationScheduleForAllTenors(
//	principalAmount money.Money,
//	bookingDateUtc timex.UtcTime,
//	repaymentDate int) ([]AmortizationSchedule, error) {
//
//	if principalAmount.IsZero() {
//		return nil, errors.New("principal amount cannot be zero")
//	}
//
//	ammortizationSchedules := make([]AmortizationSchedule, 0)
//	for _, tenor := range fp.Tenors {
//		ammortizationSchedule, err := fp.AmmortizationSchedule(principalAmount, tenor.Key, bookingDateUtc, repaymentDate)
//		if err != nil {
//			return nil, err
//		}
//		ammortizationSchedules = append(ammortizationSchedules, *ammortizationSchedule)
//	}
//	return ammortizationSchedules, nil
//}
//
//func (fp *FinancialProductAggregate) AmmortizationSchedule(
//	principalAmount money.Money,
//	tenorKey string,
//	bookingDateUtc timex.UtcTime,
//	repaymentDay int) (*AmortizationSchedule, error) {
//
//	tenor, err := fp.GetTenorByKey(tenorKey)
//	if err != nil {
//		return nil, err
//	}
//
//	scheduleLineItems, err := fincalc.AmmortizationSchedule(
//		principalAmount,
//		bookingDateUtc,
//		tenor.DurationInDays,
//		tenor.Interest.Primitive(),
//		repaymentDay,
//		config.LoanAmmoritisationBookingCutOffDay,
//		fp.InstallmentRoundingType == RoundingTypeUp,
//		fp.GracePeriodInDays,
//	)
//	if err != nil {
//		return nil, err
//	}
//
//	return &AmortizationSchedule{
//		Tenor:                *tenor,
//		ScheduledInstalments: scheduleLineItems,
//	}, nil
//}
