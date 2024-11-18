package fincalc

import (
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/money"
	"math"
)

func CalculateBadDebtAllowance(percentBasisPoints uint32, financedAmount money.Money) money.Money {
	percent := float64(percentBasisPoints) / config.Hundred
	badDebtAllowance := (float64(financedAmount.Amount()) * percent) / config.Hundred
	// units means in cents. This rounding just removes the decimal from
	// the cents value
	badDebtAllowance = math.Round(badDebtAllowance)
	return *money.NewMoney(uint64(badDebtAllowance), financedAmount.Currency().Code)
}
