package domain

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDownpaymentBuilder(t *testing.T) {
	testCases := []struct {
		name            string
		downpaymentType string
		value           string
		expectedFixed   uint64
		expectedPercent uint64
		expectedType    downpaymentType
		shouldError     bool
	}{
		{
			name:            "TestDownpaymentBuilder_Valid_FixedFeeOnly",
			downpaymentType: "FORMULA",
			value:           "10.00 + 0.00%",
			expectedFixed:   1000,
			expectedPercent: 0,
			expectedType:    FormulaDownpaymentType,
		},
		{
			name:            "TestDownpaymentBuilder_Valid_PercentageFeeOnly",
			downpaymentType: "FORMULA",
			value:           "10.00% + 0.00",
			expectedFixed:   0,
			expectedPercent: 1000,
			expectedType:    FormulaDownpaymentType,
		},
		{
			name:            "TestDownpaymentBuilder_Valid_FixedAndPercentageFee",
			downpaymentType: "FORMULA",
			value:           "12.34% + 56.78",
			expectedFixed:   5678,
			expectedPercent: 1234,
			expectedType:    FormulaDownpaymentType,
		},
		{
			name:            "TestDownpaymentBuilder_Invalid_Format_1",
			downpaymentType: "FORMULA",
			value:           "10.00%",
			expectedFixed:   0,
			expectedPercent: 0,
			expectedType:    FormulaDownpaymentType,
			shouldError:     true,
		},
		{
			name:            "TestDownpaymentBuilder_Invalid_Format_2",
			downpaymentType: "FORMULA",
			value:           "10.00",
			expectedFixed:   0,
			expectedPercent: 0,
			expectedType:    FormulaDownpaymentType,
			shouldError:     true,
		},
		{
			name:            "TestDownpaymentBuilder_Invalid_Type",
			downpaymentType: "INVALID",
			value:           "10.00% + 10.00",
			expectedFixed:   0,
			expectedPercent: 0,
			expectedType:    FormulaDownpaymentType,
			shouldError:     true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			builder := NewFinancialProductDownpaymentBuilder().SetType(tc.downpaymentType).SetValue(tc.value)
			downpayment, err := builder.Build()
			if tc.shouldError {
				assert.NotNil(t, err)
			} else {
				assert.Nil(t, err)
				assert.Equal(t, tc.expectedType, downpayment.GetType())
				assert.Equal(t, uint64(tc.expectedPercent), downpayment.GetPercentage())
				assert.Equal(t, uint64(tc.expectedFixed), downpayment.GetFixed().Units())
			}
		})
	}
}
