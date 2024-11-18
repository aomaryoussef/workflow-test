package fincalc

import (
	"github.com/btechlabs/lms/pkg/money"
	"testing"
)

func TestTotalOriginationFees_RoundsUpWhenFlagIsTrue(t *testing.T) {
	adminFee := money.NewMoney(10050, money.DefaultSystemCurrency) // $100.50
	vatFee := money.NewMoney(2050, money.DefaultSystemCurrency)    // $20.50
	roundingUp := true

	expected := money.NewMoney(12100, money.DefaultSystemCurrency) // $121.00 after rounding up
	got := TotalOriginationFees(*adminFee, *vatFee, roundingUp)

	if !got.MustEquals(expected) {
		t.Errorf("TotalOriginationFees() got = %v, want %v", got, expected)
	}
}

func TestTotalOriginationFees_NoRoundingWhenFlagIsFalse(t *testing.T) {
	adminFee := money.NewMoney(10025, money.DefaultSystemCurrency) // $100.25
	vatFee := money.NewMoney(1975, money.DefaultSystemCurrency)    // $19.75
	roundingUp := false

	expected := money.NewMoney(12000, money.DefaultSystemCurrency) // $120.00 without rounding up
	got := TotalOriginationFees(*adminFee, *vatFee, roundingUp)

	if !got.MustEquals(expected) {
		t.Errorf("TotalOriginationFees() got = %v, want %v", got, expected)
	}
}

func TestTotalOriginationFees_ZeroFeesReturnsZero(t *testing.T) {
	adminFee := money.NewMoney(0, money.DefaultSystemCurrency)
	vatFee := money.NewMoney(0, money.DefaultSystemCurrency)
	roundingUp := false

	expected := money.NewMoney(0, money.DefaultSystemCurrency)
	got := TotalOriginationFees(*adminFee, *vatFee, roundingUp)

	if !got.MustEquals(expected) {
		t.Errorf("TotalOriginationFees() got = %v, want %v", got, expected)
	}
}
