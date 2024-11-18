package aggregate

import (
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestCmdRecogniseRevenue(t *testing.T) {
	t.Run("revenue recognition allowed", func(t *testing.T) {
		la := &LoanAccountAggregate{
			state: pbevent.LoanAccountState_ACTIVE,
			BaseAggregate: &cqrs.BaseAggregate{
				AggregateVersion: cqrs.Version(3),
			},
			AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
				{
					ScheduleNumber:            1,
					InterestDue:               *money.NewMoney(100, "USD"),
					InterestRevenueRecognised: false,
				},
			},
		}
		cmd := &types.RecogniseRevenueCmd{
			InstalmentScheduleNumber: 1,
			RevenueUnits:             100,
			AppliedCurrency:          "USD",
		}
		event, err := la.onCmdRecogniseRevenue(cmd)
		assert.NoError(t, err)
		assert.NotNil(t, event)
	})

	t.Run("revenue recognition not allowed", func(t *testing.T) {
		la := &LoanAccountAggregate{
			state: pbevent.LoanAccountState_CLOSED,
		}
		cmd := &types.RecogniseRevenueCmd{}
		event, err := la.onCmdRecogniseRevenue(cmd)
		assert.Error(t, err)
		assert.Nil(t, event)
	})

	t.Run("interest revenue already recognised", func(t *testing.T) {
		la := &LoanAccountAggregate{
			state: pbevent.LoanAccountState_ACTIVE,
			AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
				{
					ScheduleNumber:            1,
					InterestDue:               *money.NewMoney(100, "USD"),
					InterestRevenueRecognised: true,
				},
			},
		}
		cmd := &types.RecogniseRevenueCmd{
			InstalmentScheduleNumber: 1,
			RevenueUnits:             100,
			AppliedCurrency:          "USD",
		}
		event, err := la.onCmdRecogniseRevenue(cmd)
		assert.Error(t, err)
		assert.Nil(t, event)
	})

	t.Run("interest revenue amount mismatch", func(t *testing.T) {
		la := &LoanAccountAggregate{
			state: pbevent.LoanAccountState_ACTIVE,
			AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
				{
					ScheduleNumber:            1,
					InterestDue:               *money.NewMoney(100, "USD"),
					InterestRevenueRecognised: false,
				},
			},
		}
		cmd := &types.RecogniseRevenueCmd{
			InstalmentScheduleNumber: 1,
			RevenueUnits:             200,
			AppliedCurrency:          "USD",
		}
		event, err := la.onCmdRecogniseRevenue(cmd)
		assert.Error(t, err)
		assert.Nil(t, event)
	})

	t.Run("interest revenue currency mismatch", func(t *testing.T) {
		la := &LoanAccountAggregate{
			state: pbevent.LoanAccountState_ACTIVE,
			AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
				{
					ScheduleNumber:            1,
					InterestDue:               *money.NewMoney(100, "USD"),
					InterestRevenueRecognised: false,
				},
			},
		}
		cmd := &types.RecogniseRevenueCmd{
			InstalmentScheduleNumber: 1,
			RevenueUnits:             100,
			AppliedCurrency:          "EUR",
		}
		event, err := la.onCmdRecogniseRevenue(cmd)
		assert.Error(t, err)
		assert.Nil(t, event)
	})
}
