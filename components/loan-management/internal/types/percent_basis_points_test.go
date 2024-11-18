package types

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestFloatRoundedToNearestPrecision(t *testing.T) {
	t.Run("given precision of 2, with no decimals", func(t *testing.T) {
		got := FloatRoundedToNearestPrecision(51, 2)
		expect := float64(51)
		assert.Equal(t, expect, got)
	})
	t.Run("given precision of 2, with one decimal point", func(t *testing.T) {
		got := FloatRoundedToNearestPrecision(51.5, 2)
		expect := 51.50
		assert.Equal(t, expect, got)
	})
	t.Run("given precision of 2, with three decimal point (not rounding up)", func(t *testing.T) {
		got := FloatRoundedToNearestPrecision(51.534, 2)
		expect := 51.53
		assert.Equal(t, expect, got)
	})
	t.Run("given precision of 2, with three decimal point (with rounding up)", func(t *testing.T) {
		got := FloatRoundedToNearestPrecision(51.535, 2)
		expect := 51.54
		assert.Equal(t, expect, got)
	})
	t.Run("given precision of 2, with four decimal point (no cascading rounding up)", func(t *testing.T) {
		got := FloatRoundedToNearestPrecision(51.5349, 2)
		expect := 51.53
		assert.Equal(t, expect, got)
	})
}

func Test_StrPercentToBasisPoints(t *testing.T) {
	t.Run("given a string with no decimal point", func(t *testing.T) {
		got, err := StrPercentToBasisPoints("15")
		assert.NoError(t, err)
		assert.Equal(t, uint32(15_00), got.Primitive())
	})
	t.Run("given a string with one decimal point", func(t *testing.T) {
		got, err := StrPercentToBasisPoints("15.5")
		assert.NoError(t, err)
		assert.Equal(t, uint32(15_50), got.Primitive())
	})
	t.Run("given a string with three decimal point", func(t *testing.T) {
		got, err := StrPercentToBasisPoints("15.765")
		assert.NoError(t, err)
		assert.Equal(t, uint32(15_77), got.Primitive())
	})
	t.Run("given a string with invalid format", func(t *testing.T) {
		_, err := StrPercentToBasisPoints("15.765.5")
		assert.Error(t, err)
	})
}
