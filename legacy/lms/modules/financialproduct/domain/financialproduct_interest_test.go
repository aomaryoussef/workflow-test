package domain

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestFinancialProductInterest_InvalidCharsInInterest(t *testing.T) {
	_, err := NewFinancialProductInterestBuilder().SetInterest("123,09").Build()
	assert.NotNil(t, err)
	assert.Equal(t, "bad interest format: 123,09\ninvalid integer part: 123,09", err.Error())
}

func TestFinancialProductInterest_IntegerInterest(t *testing.T) {
	fpInt, err := NewFinancialProductInterestBuilder().SetInterest("123").Build()
	assert.Nil(t, err)
	assert.Equal(t, uint64(12300), fpInt.interestBasisPoints)
	assert.Equal(t, MonthlyInterestCompounding, fpInt.interestCompoundingFrequency)
	assert.Equal(t, FixedInterestType, fpInt.interestType)
	assert.Equal(t, uint8(2), fpInt.precision)
	assert.Equal(t, DecliningInterestMethodology, fpInt.interestMethodology)
}

func TestFinancialProductInterest_SingleDecimalWhole(t *testing.T) {
	fpInt, err := NewFinancialProductInterestBuilder().SetInterest("123.0").Build()
	assert.Nil(t, err)
	assert.Equal(t, uint64(12300), fpInt.interestBasisPoints)
	assert.Equal(t, MonthlyInterestCompounding, fpInt.interestCompoundingFrequency)
	assert.Equal(t, FixedInterestType, fpInt.interestType)
	assert.Equal(t, uint8(2), fpInt.precision)
	assert.Equal(t, DecliningInterestMethodology, fpInt.interestMethodology)
}

func TestFinancialProductInterest_DoubleDecimalWhole(t *testing.T) {
	fpInt, err := NewFinancialProductInterestBuilder().SetInterest("123.00").Build()
	assert.Nil(t, err)
	assert.Equal(t, uint64(12300), fpInt.interestBasisPoints)
	assert.Equal(t, MonthlyInterestCompounding, fpInt.interestCompoundingFrequency)
	assert.Equal(t, FixedInterestType, fpInt.interestType)
	assert.Equal(t, uint8(2), fpInt.precision)
	assert.Equal(t, DecliningInterestMethodology, fpInt.interestMethodology)
}

func TestFinancialProductInterest_TripleDecimalWhole(t *testing.T) {
	fpInt, err := NewFinancialProductInterestBuilder().SetInterest("123.009").Build()
	assert.Nil(t, err)
	assert.Equal(t, uint64(12300), fpInt.interestBasisPoints)
	assert.Equal(t, MonthlyInterestCompounding, fpInt.interestCompoundingFrequency)
	assert.Equal(t, FixedInterestType, fpInt.interestType)
	assert.Equal(t, uint8(2), fpInt.precision)
	assert.Equal(t, DecliningInterestMethodology, fpInt.interestMethodology)
}

func TestFinancialProductInterest_DoubleDecimal(t *testing.T) {
	fpInt, err := NewFinancialProductInterestBuilder().SetInterest("123.09").Build()
	assert.Nil(t, err)
	assert.Equal(t, uint64(12309), fpInt.interestBasisPoints)
	assert.Equal(t, MonthlyInterestCompounding, fpInt.interestCompoundingFrequency)
	assert.Equal(t, FixedInterestType, fpInt.interestType)
	assert.Equal(t, uint8(2), fpInt.precision)
	assert.Equal(t, DecliningInterestMethodology, fpInt.interestMethodology)
}

func TestFinancialProductInterest_TripleDecimalNoRounding(t *testing.T) {
	fpInt, err := NewFinancialProductInterestBuilder().SetInterest("123.099").Build()
	assert.Nil(t, err)
	assert.Equal(t, uint64(12309), fpInt.interestBasisPoints)
	assert.Equal(t, MonthlyInterestCompounding, fpInt.interestCompoundingFrequency)
	assert.Equal(t, FixedInterestType, fpInt.interestType)
	assert.Equal(t, uint8(2), fpInt.precision)
	assert.Equal(t, DecliningInterestMethodology, fpInt.interestMethodology)
}
