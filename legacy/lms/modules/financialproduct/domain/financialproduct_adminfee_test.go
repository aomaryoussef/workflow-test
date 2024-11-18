package domain

import (
	"testing"

	"github.com/btechlabs/lms-lite/pkg/money"

	"github.com/stretchr/testify/assert"
)

func TestAdminFee_WithGlobalConfig(t *testing.T) {
	testCases := []struct {
		name                  string
		builder               *FinancialProductAdminFeeBuilder
		expectedFixedFee      uint64
		expectedPercentageFee uint64
		shouldError           bool
	}{
		{
			name: "TestBuild_Valid_FixedFeeOnly",
			builder: &FinancialProductAdminFeeBuilder{
				FeeType:  "MONETARY",
				FeeValue: "100.00",
			},
			expectedFixedFee:      10000,
			expectedPercentageFee: 0,
			shouldError:           false,
		},
		{
			name: "TestBuild_Valid_PercentageFeeOnly",
			builder: &FinancialProductAdminFeeBuilder{
				FeeType:  "FORMULA",
				FeeValue: "10.00% + 0.00",
			},
			expectedFixedFee:      0,
			expectedPercentageFee: 1000,
			shouldError:           false,
		},
		{
			name: "TestBuild_Valid_FixedAndPercentageFee",
			builder: &FinancialProductAdminFeeBuilder{
				FeeType:  "FORMULA",
				FeeValue: "10.00% + 12.34",
			},
			expectedFixedFee:      1234,
			expectedPercentageFee: 1000,
			shouldError:           false,
		},
		{
			name: "TestBuild_Invalid_BadFormat_1",
			builder: &FinancialProductAdminFeeBuilder{
				FeeType:  "FORMULA",
				FeeValue: "10.00%",
			},
			expectedFixedFee:      0,
			expectedPercentageFee: 0,
			shouldError:           true,
		},
		{
			name: "TestBuild_Invalid_BadFormat_2",
			builder: &FinancialProductAdminFeeBuilder{
				FeeType:  "FORMULA",
				FeeValue: "10.00% + 12.34%",
			},
			expectedFixedFee:      0,
			expectedPercentageFee: 0,
			shouldError:           true,
		},
		{
			name: "TestBuild_Invalid_BadFormat_3",
			builder: &FinancialProductAdminFeeBuilder{
				FeeType:  "FORMULA",
				FeeValue: "10.00 + 12.34",
			},
			expectedFixedFee:      0,
			expectedPercentageFee: 0,
			shouldError:           true,
		},
		{
			name: "TestBuild_Invalid_BadFormat_4",
			builder: &FinancialProductAdminFeeBuilder{
				FeeType:  "FORMULA",
				FeeValue: "10.00  +",
			},
			expectedFixedFee:      0,
			expectedPercentageFee: 0,
			shouldError:           true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			adminFee, err := tc.builder.Build()

			if tc.shouldError && err == nil {
				t.Errorf("Test %s should have returned error and did not", tc.name)
			} else if !tc.shouldError && err != nil {
				t.Errorf("Test %s should not have returned error and did: %s", tc.name, err.Error())
			} else if err == nil {
				assert.Equal(t, adminFee.fixedFee.Units(), tc.expectedFixedFee)
				assert.Equal(t, adminFee.percentageFeeBasisPoints, tc.expectedPercentageFee)
			}

		})
	}
}

func TestAdminFee_WithTenorOverrides(t *testing.T) {
	vatPercentage := uint(14)
	testcases := []struct {
		name             string
		financialProduct *FinancialProduct
		inputPrincipal   *money.Money
		inputTenorKey    string
		expectedAdminFee money.Money
		expectedError    error
	}{
		{
			name:           "TestAdminFee_WithTenorOverrides_Monetary",
			inputPrincipal: money.NewMoney(100000),
			financialProduct: &FinancialProduct{
				globalAdminFee: &FinancialProductAdminFee{
					feeType:  MonetaryAdminFeeType,
					fixedFee: money.NewMoney(10000),
				},
				tenorVariants: []*FinancialProductTenorVariant{
					{
						key: "3_Months",
						adminFee: &FinancialProductAdminFee{
							feeType:  MonetaryAdminFeeType,
							fixedFee: money.NewMoney(20000),
						},
					},
				},
			},
			inputTenorKey:    "3_Months",
			expectedAdminFee: *money.NewMoney(22800),
			expectedError:    nil,
		},
		{
			name:           "TestAdminFee_WithTenorOverrides_Formula",
			inputPrincipal: money.NewMoney(100000),
			financialProduct: &FinancialProduct{
				globalAdminFee: &FinancialProductAdminFee{
					feeType:  MonetaryAdminFeeType,
					fixedFee: money.NewMoney(10000),
				},
				tenorVariants: []*FinancialProductTenorVariant{
					{
						key: "3_Months",
						adminFee: &FinancialProductAdminFee{
							feeType:                  FormulaAdminFeeType,
							fixedFee:                 money.NewMoney(20000),
							percentageFeeBasisPoints: 3000,
						},
					},
				},
			},
			inputTenorKey:    "3_Months",
			expectedAdminFee: *money.NewMoney(57000),
			expectedError:    nil,
		},
		{
			name:           "TestAdminFee_WithTenorOverrides_Formula_2",
			inputPrincipal: money.NewMoney(285100),
			financialProduct: &FinancialProduct{
				globalAdminFee: &FinancialProductAdminFee{
					feeType:  MonetaryAdminFeeType,
					fixedFee: money.NewMoney(10000),
				},
				tenorVariants: []*FinancialProductTenorVariant{
					{
						key: "3_Months",
						adminFee: &FinancialProductAdminFee{
							feeType:                  FormulaAdminFeeType,
							fixedFee:                 money.NewMoney(58100),
							percentageFeeBasisPoints: 2900,
						},
					},
				},
			},
			inputTenorKey:    "3_Months",
			expectedAdminFee: *money.NewMoney(160488),
			expectedError:    nil,
		},
		{
			name:           "TestAdminFee_WithTenorOverrides_zero",
			inputPrincipal: money.NewMoney(100000),
			financialProduct: &FinancialProduct{
				globalAdminFee: &FinancialProductAdminFee{
					feeType:  MonetaryAdminFeeType,
					fixedFee: money.NewMoney(10000),
				},
				tenorVariants: []*FinancialProductTenorVariant{
					{
						key: "3_Months",
						adminFee: &FinancialProductAdminFee{
							feeType:                  FormulaAdminFeeType,
							fixedFee:                 money.NewMoney(0),
							percentageFeeBasisPoints: 0,
						},
					},
				},
			},
			inputTenorKey:    "3_Months",
			expectedAdminFee: *money.NewMoney(0),
			expectedError:    nil,
		},
	}

	for _, tc := range testcases {
		t.Run(tc.name, func(t *testing.T) {
			// Implement me
			actualAdminFee, err := tc.financialProduct.AdminFee(tc.inputPrincipal, vatPercentage, tc.inputTenorKey)
			assert.Equal(t, tc.expectedError, err)
			if actualAdminFee != nil {
				assert.Equal(t, *actualAdminFee, tc.expectedAdminFee)
			}
		})
	}
}
