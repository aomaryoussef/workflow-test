package fincalc

import (
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/money"
	"testing"
)

func TestCalculateEarlySettlementFees(t *testing.T) {
	testCases := []struct {
		name                         string
		principalDue                 money.Money
		interestDue                  money.Money
		settlementPercentBasisPoints types.PercentBasisPoints
		expect                       money.Money
	}{
		{
			name:                         "with no settlement %, resulting fees equals principal due",
			principalDue:                 *money.NewMoney(14000, money.EgyptianPound),
			interestDue:                  *money.NewMoney(3000, money.EgyptianPound),
			settlementPercentBasisPoints: types.PercentBasisPoints(0),
			expect:                       *money.NewMoney(0, money.EgyptianPound),
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			got := CalculateEarlySettlementFees(tc.principalDue, tc.interestDue, tc.settlementPercentBasisPoints)
			if !got.MustEquals(money.AsPtr(tc.expect)) {
				t.Errorf("CalculateEarlySettlementFees(%s, %s, %d) - got %v, expected %v",
					tc.principalDue.String(),
					tc.interestDue.String(),
					tc.settlementPercentBasisPoints,
					got.String(),
					tc.expect.String())
			}
		})
	}
}
