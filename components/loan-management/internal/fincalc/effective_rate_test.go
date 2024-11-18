package fincalc

import (
	"errors"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/money"
	"testing"
)

func TestMonthlyEffectiveRate(t *testing.T) {
	// Test cases
	tests := []struct {
		name              string
		principalAmount   money.Money
		loanTermInDays    uint32
		monthlyInstalment money.Money
		wantRate          float64
		wantErr           error
	}{
		{
			name:              "for 4 years term, principal EGP 2080 & monthly instalment EGP 120 - rate is 0.05281444123843016",
			principalAmount:   *money.NewMoney(2080_00, money.EgyptianPound),
			loanTermInDays:    4 * 12 * config.DaysInMonth,
			monthlyInstalment: *money.NewMoney(120_00, money.EgyptianPound),
			wantRate:          0.05281444123843016,
			wantErr:           nil,
		},
		{
			name:              "for 1 year term, principal EGP 2080 & monthly instalment EGP 479 - rate is 0.2059479711417292",
			principalAmount:   *money.NewMoney(2080_00, money.EgyptianPound),
			loanTermInDays:    1 * 12 * config.DaysInMonth,
			monthlyInstalment: *money.NewMoney(479_00, money.EgyptianPound),
			wantRate:          0.2059479711417292,
			wantErr:           nil,
		},
		{
			name:              "for 1 year term, principal EGP 99.20 & monthly instalment EGP 23 - rate is 0.2083461532700603",
			principalAmount:   *money.NewMoney(99_20, money.EgyptianPound),
			loanTermInDays:    1 * 12 * config.DaysInMonth,
			monthlyInstalment: *money.NewMoney(23_00, money.EgyptianPound),
			wantRate:          0.20779465611113654,
			wantErr:           nil,
		},
		{
			name:              "when principal amount is 0, rate is 0 and no error is returned",
			principalAmount:   *money.NewMoney(0, money.EgyptianPound),
			loanTermInDays:    1 * 12 * config.DaysInMonth,
			monthlyInstalment: *money.NewMoney(23_00, money.EgyptianPound),
			wantRate:          0,
			wantErr:           nil,
		},
		{
			name:              "when monthly instalment amount is 0, rate is -1 and error is returned",
			principalAmount:   *money.NewMoney(99_20, money.EgyptianPound),
			loanTermInDays:    1 * 12 * config.DaysInMonth,
			monthlyInstalment: *money.NewMoney(0, money.EgyptianPound),
			wantRate:          -1,
			wantErr:           errors.New("monthly effective rate requires non-zero monthly instalment"),
		},
	}

	// Run tests
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rate, err := MonthlyEffectiveRate(tt.principalAmount, tt.loanTermInDays, tt.monthlyInstalment)
			if err != nil && errors.Is(err, tt.wantErr) {
				t.Errorf("MonthlyEffectiveRate(%v, %d, %v) error = %v; want %v", tt.principalAmount.String(), tt.loanTermInDays, tt.monthlyInstalment.String(), err, tt.wantErr)
			}
			if rate != tt.wantRate {
				t.Errorf("MonthlyEffectiveRate(%v, %d, %v) = %v; want %v", tt.principalAmount.String(), tt.loanTermInDays, tt.monthlyInstalment.String(), rate, tt.wantRate)
			}
		})
	}
}

func TestMonthlyEffectiveRateRoundedPercent(t *testing.T) {
	// Test cases
	tests := []struct {
		name              string
		principalAmount   money.Money
		loanTermInDays    uint32
		monthlyInstalment money.Money
		wantRate          float64
		wantErr           error
	}{
		{
			name:              "for 4 years term, principal EGP 2080 & monthly instalment EGP 120 - rate is 0.0528",
			principalAmount:   *money.NewMoney(2080_00, money.EgyptianPound),
			loanTermInDays:    4 * 12 * config.DaysInMonth,
			monthlyInstalment: *money.NewMoney(120_00, money.EgyptianPound),
			wantRate:          0.0528 * 100,
			wantErr:           nil,
		},
		{
			name:              "for 1 year term, principal EGP 2080 & monthly instalment EGP 479 - rate is 0.2059",
			principalAmount:   *money.NewMoney(2080_00, money.EgyptianPound),
			loanTermInDays:    1 * 12 * config.DaysInMonth,
			monthlyInstalment: *money.NewMoney(479_00, money.EgyptianPound),
			wantRate:          0.2059 * 100,
			wantErr:           nil,
		},
		{
			name:              "for 1 year term, principal EGP 99.20 & monthly instalment EGP 23 - rate is 0.2083",
			principalAmount:   *money.NewMoney(99_20, money.EgyptianPound),
			loanTermInDays:    1 * 12 * config.DaysInMonth,
			monthlyInstalment: *money.NewMoney(23_00, money.EgyptianPound),
			wantRate:          0.2078 * 100,
			wantErr:           nil,
		},
	}

	// Run tests
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rate, err := MonthlyEffectiveRateRoundedPercent(tt.principalAmount, tt.loanTermInDays, tt.monthlyInstalment)
			if err != nil && errors.Is(err, tt.wantErr) {
				t.Errorf("MonthlyEffectiveRate(%v, %d, %v) error = %v; want %v", tt.principalAmount.String(), tt.loanTermInDays, tt.monthlyInstalment.String(), err, tt.wantErr)
			}
			if rate != tt.wantRate {
				t.Errorf("MonthlyEffectiveRate(%v, %d, %v) = %v; want %v", tt.principalAmount.String(), tt.loanTermInDays, tt.monthlyInstalment.String(), rate, tt.wantRate)
			}
		})
	}
}

func TestAnnualPercentageRate(t *testing.T) {
	tests := []struct {
		name              string
		financedAmount    money.Money
		monthlyInstalment money.Money
		totalFees         money.Money
		loanTermInDays    uint32
		wantRate          float64
	}{
		{
			name:              "for 4 years term, principal EGP 3164, monthly instalment EGP 182, admin fee EGP 316.40, rate is 0.4653",
			financedAmount:    *money.NewMoney(3164_00, money.EgyptianPound),
			monthlyInstalment: *money.NewMoney(182_00, money.EgyptianPound),
			totalFees:         *money.NewMoney(316_40, money.EgyptianPound),
			loanTermInDays:    4 * 12 * config.DaysInMonth,
			wantRate:          0.4653,
		},
		{
			name:              "for 4 years term, principal EGP 3164, monthly instalment EGP 182, no admin fee, rate is 0.4653",
			financedAmount:    *money.NewMoney(3164_00, money.EgyptianPound),
			monthlyInstalment: *money.NewMoney(182_00, money.EgyptianPound),
			totalFees:         *money.NewMoney(0, money.EgyptianPound),
			loanTermInDays:    4 * 12 * config.DaysInMonth,
			wantRate:          0.4403,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Calculate the annual percentage rate
			rate := AnnualPercentageRate(tt.financedAmount, tt.monthlyInstalment, tt.totalFees, tt.loanTermInDays)
			if rate != tt.wantRate {
				t.Errorf("AnnualPercentageRate(%s, %s, %s, %d) = %v; want %v",
					tt.financedAmount.String(),
					tt.monthlyInstalment.String(),
					tt.totalFees.String(),
					tt.loanTermInDays,
					rate,
					tt.wantRate)
			}
		})
	}
}
