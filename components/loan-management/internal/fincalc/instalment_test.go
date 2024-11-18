package fincalc

import (
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/money"
	"testing"
)

func TestMonthlyInstalment(t *testing.T) {
	testcases := []struct {
		name                 string
		principalAmount      money.Money
		loanTermInDays       uint32
		interestBasisPoints  uint32
		instalmentRoundingUp bool
		want                 money.Money
	}{
		{
			name:                 "with principal amount of 0, monthly instalment is 0",
			principalAmount:      *money.NewMoney(0, money.EgyptianPound),
			loanTermInDays:       config.DaysInMonth,
			interestBasisPoints:  10_00,
			instalmentRoundingUp: false,
			want:                 *money.NewMoney(0, money.EgyptianPound),
		},
		{
			name:                 "with loan term of 0, monthly instalment is 0",
			principalAmount:      *money.NewMoney(1000_00, money.EgyptianPound),
			loanTermInDays:       0,
			interestBasisPoints:  10_00,
			instalmentRoundingUp: false,
			want:                 *money.NewMoney(0, money.EgyptianPound),
		},
		{
			name:                 "with principal amount of 1000 EGP, loan term of 30 days, interest of 10.00%, monthly instalment is 1000 EGP",
			principalAmount:      *money.NewMoney(1000_00, money.EgyptianPound),
			loanTermInDays:       config.DaysInMonth,
			interestBasisPoints:  10_00,
			instalmentRoundingUp: false,
			want:                 *money.NewMoney(1100_00, money.EgyptianPound),
		},
		{
			name:                 "with principal amount of 1000 EGP, loan term of 1 year, interest of 10.00%, monthly instalment is 91.67 EGP with no rounding up",
			principalAmount:      *money.NewMoney(1000_00, money.EgyptianPound),
			loanTermInDays:       12 * config.DaysInMonth,
			interestBasisPoints:  10_00,
			instalmentRoundingUp: false,
			want:                 *money.NewMoney(91_67, money.EgyptianPound),
		},
		{
			name:                 "with principal amount of 1000 EGP, loan term of 1 year, interest of 10.00%, monthly instalment is 92 EGP with rounding up",
			principalAmount:      *money.NewMoney(1000_00, money.EgyptianPound),
			loanTermInDays:       12 * config.DaysInMonth,
			interestBasisPoints:  10_00,
			instalmentRoundingUp: true,
			want:                 *money.NewMoney(92_00, money.EgyptianPound),
		},
	}

	for _, tc := range testcases {
		t.Run(tc.name, func(t *testing.T) {
			got := MonthlyInstalment(tc.principalAmount, tc.loanTermInDays, tc.interestBasisPoints, tc.instalmentRoundingUp)
			if !got.MustEquals(money.AsPtr(tc.want)) {
				t.Errorf("got %v, want %v", got.String(), tc.want.String())
			}
		})
	}
}
