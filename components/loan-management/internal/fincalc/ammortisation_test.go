package fincalc

import (
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/timex"
	"testing"
	"time"
)

func TestCalculatePaymentDates(t *testing.T) {
	cairoTz, err := time.LoadLocation("Africa/Cairo")
	if err != nil {
		t.Fatal(err)
	}
	time.Local = cairoTz

	dayOfMonthCutOff := 10

	type testCase struct {
		name             string
		numberOfPayments uint32
		bookingDateUtc   timex.UtcTime
		repaymentDay     int
		want             []timex.UtcTime
	}
	tests := []testCase{
		{
			name:             "when a loan is booked on 1st of the month and repayment day is 9th, then payment schedule starts next month 9th",
			numberOfPayments: 3,
			bookingDateUtc:   timex.NewUtcTime(time.Date(2025, 1, 1, 10, 43, 35, 0, time.Local)),
			repaymentDay:     9,
			want: []timex.UtcTime{
				timex.NewUtcTime(time.Date(2025, 2, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2025, 3, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2025, 4, 9, 23, 59, 59, 0, time.Local)),
			},
		},
		{
			name:             "when a loan is booked on 10th of the month and repayment day is 9th, then payment schedule starts next month 9th",
			numberOfPayments: 3,
			bookingDateUtc:   timex.NewUtcTime(time.Date(2025, 1, 10, 10, 43, 35, 0, time.Local)),
			repaymentDay:     9,
			want: []timex.UtcTime{
				timex.NewUtcTime(time.Date(2025, 2, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2025, 3, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2025, 4, 9, 23, 59, 59, 0, time.Local)),
			},
		},
		{
			name:             "when a loan is booked on 11th of the month and repayment day is 9th, then payment schedule starts next to next month 9th",
			numberOfPayments: 3,
			bookingDateUtc:   timex.NewUtcTime(time.Date(2025, 1, 11, 10, 43, 35, 0, time.Local)),
			repaymentDay:     9,
			want: []timex.UtcTime{
				timex.NewUtcTime(time.Date(2025, 3, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2025, 4, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2025, 5, 9, 23, 59, 59, 0, time.Local)),
			},
		},
		{
			name:             "when a loan is booked on 29th February leap year and repayment day is 9th, then payment schedule starts next to next month 9th",
			numberOfPayments: 3,
			bookingDateUtc:   timex.NewUtcTime(time.Date(2025, 2, 29, 10, 43, 35, 0, time.Local)),
			repaymentDay:     9,
			want: []timex.UtcTime{
				timex.NewUtcTime(time.Date(2025, 4, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2025, 5, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2025, 6, 9, 23, 59, 59, 0, time.Local)),
			},
		},
		{
			name:             "when a loan is booked on 30th Nov and repayment day is 9th, then payment schedule starts next year 9th",
			numberOfPayments: 3,
			bookingDateUtc:   timex.NewUtcTime(time.Date(2025, 11, 30, 10, 43, 35, 0, time.Local)),
			repaymentDay:     9,
			want: []timex.UtcTime{
				timex.NewUtcTime(time.Date(2026, 1, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2026, 2, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2026, 3, 9, 23, 59, 59, 0, time.Local)),
			},
		},
		{
			// loan is booked on 01 Nov 2025 00:23:35 Cairo which is 31st Oct 2025 22:23:35 UTC
			// the repayment dates will use localtime i.e. Nov to calculate the payment dates starting December and not use UTC
			name:             "when a loan is booked, it always uses the local time to calculate the payment dates",
			numberOfPayments: 3,
			bookingDateUtc:   timex.NewUtcTime(time.Date(2025, 11, 01, 00, 23, 35, 0, time.Local)),
			repaymentDay:     9,
			want: []timex.UtcTime{
				timex.NewUtcTime(time.Date(2025, 12, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2026, 1, 9, 23, 59, 59, 0, time.Local)),
				timex.NewUtcTime(time.Date(2026, 2, 9, 23, 59, 59, 0, time.Local)),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := CalculatePaymentDates(tt.numberOfPayments, tt.bookingDateUtc, tt.repaymentDay, dayOfMonthCutOff)
			if len(got) != len(tt.want) {
				t.Errorf("calculatePaymentDates() got = %v, want %v", got, tt.want)
			}
			for i := range got {
				if !got[i].ToStdLibTime().Equal(tt.want[i].ToStdLibTime()) {
					t.Errorf("calculatePaymentDates() got = %v, want %v", got[i], tt.want[i])
				}
			}
		})
	}
}

func TestAmmortizationSchedule(t *testing.T) {
	type testcase struct {
		name                 string
		principalAmount      money.Money
		bookingDateUtc       timex.UtcTime
		loanTermInDays       uint32
		monthlyInstalment    money.Money
		monthlyEffectiveRate float64
		repaymentDate        int
		dayOfMonthCutOff     int
		gracePeriodInDays    uint32
		wantSchedule         []AmmortisationLineItem
		wantErr              error
	}
	tests := []testcase{
		{
			name:                 "given principal amount is 3120 EGP, flat rate of 44.00% and tenor of 3 months, when booking date is 1st Jan 2025, repayment date is 9th, then schedule is 3 instalments",
			principalAmount:      *money.NewMoney(3120_00, money.EgyptianPound),
			bookingDateUtc:       timex.NewUtcTime(time.Date(2025, 1, 1, 10, 43, 35, 0, time.Local)),
			loanTermInDays:       3 * config.DaysInMonth,
			monthlyInstalment:    *money.NewMoney(1498_00, money.EgyptianPound),
			monthlyEffectiveRate: 0.207256388,
			repaymentDate:        9,
			dayOfMonthCutOff:     config.LoanAmmoritisationBookingCutOffDay,
			gracePeriodInDays:    3,
			wantSchedule: []AmmortisationLineItem{
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 2, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 2, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(3120_00, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(851_36, money.EgyptianPound),
					InterestDue:        *money.NewMoney(646_64, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(1498_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 3, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 3, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(2268_64, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(1027_81, money.EgyptianPound),
					InterestDue:        *money.NewMoney(470_19, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(1498_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 4, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 4, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(1240_83, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(1240_83, money.EgyptianPound),
					InterestDue:        *money.NewMoney(257_17, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(1498_00, money.EgyptianPound),
				},
			},
			wantErr: nil,
		},
		{
			name:                 "given principal amount is 3120 EGP, flat rate of 0% and tenor of 2 months, then no interest is charged and paid",
			principalAmount:      *money.NewMoney(312000, money.EgyptianPound),
			bookingDateUtc:       timex.NewUtcTime(time.Date(2025, 1, 1, 10, 43, 35, 0, time.Local)),
			loanTermInDays:       2 * config.DaysInMonth,
			monthlyInstalment:    *money.NewMoney(1560_00, money.EgyptianPound),
			monthlyEffectiveRate: 0,
			repaymentDate:        9,
			dayOfMonthCutOff:     config.LoanAmmoritisationBookingCutOffDay,
			gracePeriodInDays:    3,
			wantSchedule: []AmmortisationLineItem{
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 2, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 2, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(3120_00, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(1560_00, money.EgyptianPound),
					InterestDue:        *money.NewMoney(0_00, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(1560_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 3, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 3, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(1560_00, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(1560_00, money.EgyptianPound),
					InterestDue:        *money.NewMoney(0_00, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(1560_00, money.EgyptianPound),
				},
			},
			wantErr: nil,
		},
		{
			name:                 "given principal amount is 3163 EGP, flat rate of 0% and tenor of 3 months, then no interest is charged but some amount is paid due to rounding up",
			principalAmount:      *money.NewMoney(3163_00, money.EgyptianPound),
			bookingDateUtc:       timex.NewUtcTime(time.Date(2025, 1, 1, 10, 43, 35, 0, time.Local)),
			loanTermInDays:       3 * config.DaysInMonth,
			monthlyInstalment:    *money.NewMoney(1055_00, money.EgyptianPound),
			monthlyEffectiveRate: 0.000316122,
			repaymentDate:        9,
			dayOfMonthCutOff:     config.LoanAmmoritisationBookingCutOffDay,
			gracePeriodInDays:    3,
			wantSchedule: []AmmortisationLineItem{
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 2, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 2, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(3163_00, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(1054_00, money.EgyptianPound),
					InterestDue:        *money.NewMoney(1_00, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(1055_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 3, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 3, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(2109_00, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(1054_33, money.EgyptianPound),
					InterestDue:        *money.NewMoney(67, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(1055_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 4, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 4, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(1054_67, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(1054_67, money.EgyptianPound),
					InterestDue:        *money.NewMoney(33, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(1055_00, money.EgyptianPound),
				},
			},
			wantErr: nil,
		},
		{
			name:                 "given principal amount is 2350 EGP, flat rate of 0% and tenor of 6 months, then no interest is charged but some amount is paid due to rounding up",
			principalAmount:      *money.NewMoney(2350_00, money.EgyptianPound),
			bookingDateUtc:       timex.NewUtcTime(time.Date(2025, 1, 1, 10, 43, 35, 0, time.Local)),
			loanTermInDays:       6 * config.DaysInMonth,
			monthlyInstalment:    *money.NewMoney(392_00, money.EgyptianPound),
			monthlyEffectiveRate: 0.000243,
			repaymentDate:        9,
			dayOfMonthCutOff:     config.LoanAmmoritisationBookingCutOffDay,
			gracePeriodInDays:    3,
			wantSchedule: []AmmortisationLineItem{
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 2, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 2, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(2350_00, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(391_43, money.EgyptianPound),
					InterestDue:        *money.NewMoney(57, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(392_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 3, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 3, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(1958_57, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(391_52, money.EgyptianPound),
					InterestDue:        *money.NewMoney(48, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(392_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 4, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 4, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(1567_05, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(391_62, money.EgyptianPound),
					InterestDue:        *money.NewMoney(38, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(392_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 5, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 5, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(1175_43, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(391_71, money.EgyptianPound),
					InterestDue:        *money.NewMoney(29, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(392_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 6, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 6, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(783_72, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(391_81, money.EgyptianPound),
					InterestDue:        *money.NewMoney(19, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(392_00, money.EgyptianPound),
				},
				{
					InstalmentDueDate:  timex.NewUtcTime(time.Date(2025, 7, 9, 23, 59, 59, 0, time.Local)),
					GracePeriodEndDate: timex.NewUtcTime(time.Date(2025, 7, 12, 23, 59, 59, 0, time.Local)),
					LoanBalance:        *money.NewMoney(391_91, money.EgyptianPound),
					PrincipalDue:       *money.NewMoney(391_91, money.EgyptianPound),
					InterestDue:        *money.NewMoney(9, money.EgyptianPound),
					TotalInstalmentDue: *money.NewMoney(392_00, money.EgyptianPound),
				},
			},
			wantErr: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := AmmortizationSchedule(tt.principalAmount, tt.bookingDateUtc, tt.loanTermInDays, tt.monthlyInstalment, tt.monthlyEffectiveRate, tt.repaymentDate, tt.dayOfMonthCutOff, tt.gracePeriodInDays)
			if tt.wantErr != nil && err.Error() != tt.wantErr.Error() {
				t.Errorf("AmmortizationSchedule() error = %v, want %v", err, tt.wantErr)
			}
			if got != nil {
				if len(got) != len(tt.wantSchedule) {
					t.Errorf("AmmortizationSchedule() got = %v, want %v", got, tt.wantSchedule)
				}
				for i := range len(got) {
					if !got[i].InstalmentDueDate.ToStdLibTime().Equal(tt.wantSchedule[i].InstalmentDueDate.ToStdLibTime()) ||
						!got[i].GracePeriodEndDate.ToStdLibTime().Equal(tt.wantSchedule[i].GracePeriodEndDate.ToStdLibTime()) ||
						got[i].LoanBalance.Amount() != tt.wantSchedule[i].LoanBalance.Amount() ||
						got[i].PrincipalDue.Amount() != tt.wantSchedule[i].PrincipalDue.Amount() ||
						got[i].InterestDue.Amount() != tt.wantSchedule[i].InterestDue.Amount() ||
						got[i].TotalInstalmentDue.Amount() != tt.wantSchedule[i].TotalInstalmentDue.Amount() {

						t.Errorf(fmt.Sprintf("Start: Details for schedule no. [%d]", i))
						t.Errorf("AmmortizationSchedule - InstalmentDueDate got = %v, want %v", got[i].InstalmentDueDate, tt.wantSchedule[i].InstalmentDueDate)
						t.Errorf("AmmortizationSchedule - GracePeriodEndDate got = %v, want %v", got[i].GracePeriodEndDate, tt.wantSchedule[i].GracePeriodEndDate)
						t.Errorf("AmmortizationSchedule - LoanBalance got = %v, want %v", got[i].LoanBalance.String(), tt.wantSchedule[i].LoanBalance.String())
						t.Errorf("AmmortizationSchedule - PrincipalDue got = %v, want %v", got[i].PrincipalDue.String(), tt.wantSchedule[i].PrincipalDue.String())
						t.Errorf("AmmortizationSchedule - InterestDue got = %v, want %v", got[i].InterestDue.String(), tt.wantSchedule[i].InterestDue.String())
						t.Errorf("AmmortizationSchedule - TotalInstalmentDue got = %v, want %v", got[i].TotalInstalmentDue.String(), tt.wantSchedule[i].TotalInstalmentDue.String())
						t.Errorf(fmt.Sprintf("End: Details for schedule no. [%d]\n", i))
					}
				}
			}
		})
	}
}
