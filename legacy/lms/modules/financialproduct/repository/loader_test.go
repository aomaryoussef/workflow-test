package repository

import (
	"testing"
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/stretchr/testify/assert"
	"gopkg.in/yaml.v3"
)

func TestValidFileExtensionFinancialProduct(t *testing.T) {
	assert.True(t, _validFileExtensionFinancialProduct("yml"))
	assert.True(t, _validFileExtensionFinancialProduct("yaml"))
	assert.False(t, _validFileExtensionFinancialProduct("anything"))
}

func TestConstructFPFromMap_HappyPath(t *testing.T) {
	ymlStr := `
id: "AQBPM5420B"
key: "test-financial-product"
version: "1"
previous_version: "NIL"
name: "test-loan-1"
description: "This is the first test loan"
active_since: "2023-09-29T15:04:05Z"
active_until: "2099-09-28T15:04:05Z"

approvers:
  pricing:
    name: "Mohamed Hashish"
    email: "mohamed.hashish@btech.com"
    date: "2023-09-01T15:04:05Z"
    comment: "Approved. GH_PR: https://github.com/btechlabs/consumer-finance-lms-lite/pull/XX"
  finance:
    name: "Marie Khalil"
    email: "marie.khalil@btech.com"
    date: "2023-09-01T15:04:05Z"
    comment: "Approved. GH_PR: https://github.com/btechlabs/consumer-finance-lms-lite/pull/XX"

creator:
  name: "Sid Moitra"
  email: "siddhartha.external@btech.com"
  date: "2023-09-01T15:04:05Z"
  comment: "Created: GH_PR: https://github.com/btechlabs/consumer-finance-lms-lite/pull/XX"

# Configuration is not yet loaded or processed
configuration:
  # Interest configs are right now hard-coded
  # Adding this as configuration is rather very low effort
  interest:
    # This means that the interest rate does not change over time.
    type: FIXED
    # This means that the interest rate calculation is done on the declining outstanding balance.
    methodology: DECLINING
    # This means that the interest rate calculation is done based on a monthly compounding frequency.
    compounding_frequency: MONTHLY

# Global attributes are loaded by the financial product loader
global_attributes:
  # Admin Fee is paid by the debtor (consumer)
  admin_fee:
    # 2 types are supported: MONETARY | FORMULA
    # Only MONETARY is implemented
    # In case of MONETARY, the value means the fixed money itself e.g. EGP 30.08
    type: "MONETARY"
    # Only max 2 decimal precision is used, if extra decimal places are added,
    # then the rest of them will be omitted. No rounding off will be used
    value: "30.08"
  bad_debt:
    type: PERCENT
    value: "1.07"
  grace_period:
    in_days: 3
  allowed_principal_range:
    min: "10.00"
    max: "1000000.00"
  repayment_days_in_month: "8, 20"

tenor_variants:
  - key: "12_Months"
    duration_in_days: 360
    minimum_downpayment:
      type: "FORMULA"
      value: "10.00% + 10.00"
    maximum_downpayment:
      type: "FORMULA"
      value: "20.00% + 20.00"
    phases:
      - duration_in_days: 360
        interest:
          type: "PERCENT"
          value: "46.00"
        late_fee:
          type: "MONETARY"
          value: "50.00"
    # Admin Fee is paid by the debtor (consumer)
    admin_fee:
      # 2 types are supported: MONETARY | FORMULA
      # Only MONETARY is implemented
      # In case of MONETARY, the value means the fixed money itself e.g. EGP 30.08
      type: "MONETARY"
      # Only max 2 decimal precision is used, if extra decimal places are added,
      # then the rest of them will be omitted. No rounding off will be used
      value: "30.08"

  - key: "24_Months"
    duration_in_days: 720
    minimum_downpayment:
      type: "FORMULA"
      value: "10.00% + 10.00"
    maximum_downpayment:
      type: "FORMULA"
      value: "20.00% + 20.00"
    phases:
      - duration_in_days: 720
        interest:
          type: "PERCENT"
          value: "92.00"
        late_fee:
          type: "MONETARY"
          value: "50.00"
    # Admin Fee is paid by the debtor (consumer)
    admin_fee:
      # 2 types are supported: MONETARY | FORMULA
      # Only MONETARY is implemented
      # In case of MONETARY, the value means the fixed money itself e.g. EGP 30.08
      type: "MONETARY"
      # Only max 2 decimal precision is used, if extra decimal places are added,
      # then the rest of them will be omitted. No rounding off will be used
      value: "40.08"
`
	financialProductYml := &FinancialProductYaml{}
	err := yaml.Unmarshal([]byte(ymlStr), financialProductYml)
	if err != nil {
		t.Fatal(err)
	}

	fp, err := constructFinancialProductFromMap(financialProductYml)
	if err != nil {
		t.Fatal(err)
	}

	assert.Nil(t, err)
	assert.NotNil(t, fp)

	assert.Equal(t, "AQBPM5420B", fp.Id())
	assert.Equal(t, "test-loan-1", fp.Name())
	assert.Equal(t, "This is the first test loan", fp.Description())
	assert.Equal(t, "test-financial-product", fp.Key())
	assert.Equal(t, "1", fp.Version())
	assert.Equal(t, "NIL", fp.PreviousVersion())

	assert.Equal(t, "2023-09-29T15:04:05Z", fp.ActiveSince().Format(time.RFC3339))
	assert.Equal(t, "2099-09-28T15:04:05Z", fp.ActiveUntil().Format(time.RFC3339))

	assert.True(t, fp.IsActive())

	// Test admin fee
	testPrincipalAmount := money.NewMoney(100000)
	vatPercentage := uint(14)

	// Test global admin fee
	testTenor1 := fp.TenorVariants()[0]
	adminFee, err := fp.AdminFee(testPrincipalAmount, vatPercentage, testTenor1.Key())

	assert.Nil(t, err)
	assert.Equal(t, adminFee, money.NewMoney(uint64(3429)))

	// Test admin fee on tenor level
	testTenor2 := fp.TenorVariants()[1]
	adminFee, err = fp.AdminFee(testPrincipalAmount, vatPercentage, testTenor2.Key())

	assert.Nil(t, err)
	assert.Equal(t, adminFee, money.NewMoney(uint64(4569)))
}

// TODO: More tests to be added
