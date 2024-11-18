package money

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewMoney(t *testing.T) {
	var mny *Money
	mny = NewMoney(0)
	assert.Equal(t, uint64(0), mny.Units())
	assert.Equal(t, Currency_EGP.NumericCode, mny.Currency().NumericCode)
	assert.Equal(t, Currency_EGP.Fraction, mny.Currency().Fraction)
	assert.Equal(t, Currency_EGP.Grapheme, mny.Currency().Grapheme)
	assert.Equal(t, Currency_EGP.Code, mny.Currency().Code)

	mny = NewMoney(1)
	assert.Equal(t, uint64(1), mny.Units())
	assert.Equal(t, Currency_EGP.NumericCode, mny.Currency().NumericCode)
	assert.Equal(t, Currency_EGP.Fraction, mny.Currency().Fraction)
	assert.Equal(t, Currency_EGP.Grapheme, mny.Currency().Grapheme)
	assert.Equal(t, Currency_EGP.Code, mny.Currency().Code)
}

func TestMoney_AddMoney(t *testing.T) {
	originalMny := NewMoney(1000)
	assert.Equal(t, uint64(1000), originalMny.Units())

	toAdd := NewMoney(1300)
	originalMny.AddMoney(toAdd)
	assert.Equal(t, uint64(2300), originalMny.Units())
}

func TestMoney_SubMoney(t *testing.T) {
	var err error

	originalMny := NewMoney(1000)
	assert.Equal(t, uint64(1000), originalMny.Units())

	toSub := NewMoney(100)
	_, err = originalMny.SubMoney(toSub)
	assert.Nil(t, err)
	assert.Equal(t, uint64(900), originalMny.Units())

	makeNegativeMny := NewMoney(1000)
	_, err = originalMny.SubMoney(makeNegativeMny)
	assert.NotNil(t, err)
	assert.Equal(t, uint64(900), originalMny.Units(), "original money value unchanged")
	assert.Equal(t, ErrMoneyNegative, err)
}

func TestMoney_ReadableNotation(t *testing.T) {
	mny := NewMoney(1000)
	assert.Equal(t, "10.00", mny.ReadableNotation())

	mny = NewMoney(0)
	assert.Equal(t, "0", mny.ReadableNotation())

	mny = NewMoney(100)
	assert.Equal(t, "1.00", mny.ReadableNotation())

	mny = NewMoney(9)
	assert.Equal(t, "0.09", mny.ReadableNotation())

	mny = NewMoney(99)
	assert.Equal(t, "0.99", mny.ReadableNotation())
}
