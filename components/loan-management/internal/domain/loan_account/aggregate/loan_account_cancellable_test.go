package aggregate

import (
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/stringx"
	"github.com/btechlabs/lms/pkg/timex"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestLoanAccountAggregate_IsLoanCancellable(t *testing.T) {
	testcases := []struct {
		name             string
		la               *LoanAccountAggregate
		cancellationTime timex.UtcTime
		returnPolicyDays *int
		wantIsCancelled  bool
		wantReason       *string
	}{
		{
			name: "when loan state is closed, it cannot be cancelled",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_CLOSED,
			},
			cancellationTime: timex.NewUtcTimeNow(),
			returnPolicyDays: nil,
			wantIsCancelled:  false,
			wantReason:       stringx.ToPtr("loan account state is not active and hence cannot be cancelled"),
		},
		{
			name: "when loan state is locked, it cannot be cancelled",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_LOCKED,
			},
			cancellationTime: timex.NewUtcTimeNow(),
			returnPolicyDays: nil,
			wantIsCancelled:  false,
			wantReason:       stringx.ToPtr("loan account state is not active and hence cannot be cancelled"),
		},
		{
			name: "when loan state is terminated, it cannot be cancelled",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_TERMINATED,
			},
			cancellationTime: timex.NewUtcTimeNow(),
			returnPolicyDays: nil,
			wantIsCancelled:  false,
			wantReason:       stringx.ToPtr("loan account state is not active and hence cannot be cancelled"),
		},
		{
			name: "when loan state is active in arrears, it cannot be cancelled",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE_IN_ARREARS,
			},
			cancellationTime: timex.NewUtcTimeNow(),
			returnPolicyDays: nil,
			wantIsCancelled:  false,
			wantReason:       stringx.ToPtr("loan account state is not active and hence cannot be cancelled"),
		},
		{
			name: "when loan state is active but has one instalment paid, it cannot be cancelled",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						ScheduleNumber:         1,
						PrincipalDue:           *money.NewMoney(1000, money.EgyptianPound),
						InterestDue:            *money.NewMoney(10, money.EgyptianPound),
						AdminFeeDue:            *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:             *money.NewMoney(0, money.EgyptianPound),
						VatDue:                 *money.NewMoney(0, money.EgyptianPound),
						LoanBalance:            *money.NewMoney(3000, money.EgyptianPound),
						PrincipalPaid:          *money.NewMoney(1000, money.EgyptianPound),
						InterestPaid:           *money.NewMoney(10, money.EgyptianPound),
						AdminFeePaid:           *money.NewMoney(0, money.EgyptianPound),
						PenaltyPaid:            *money.NewMoney(0, money.EgyptianPound),
						VatPaid:                *money.NewMoney(0, money.EgyptianPound),
						InstalmentDueAt:        timex.NewUtcTime(time.Date(2024, 3, 3, 0, 0, 0, 0, time.Local)),
						PaidAt:                 timex.NewUtcTime(time.Date(2024, 3, 2, 0, 0, 0, 0, time.Local)).AsPtr(),
						GracePeriodDueAt:       timex.NewUtcTime(time.Date(2024, 3, 7, 0, 0, 0, 0, time.Local)),
						LinkedPaymentReference: make([]string, 0),
					},
					{
						ScheduleNumber:   2,
						PrincipalDue:     *money.NewMoney(1000, money.EgyptianPound),
						InterestDue:      *money.NewMoney(10, money.EgyptianPound),
						AdminFeeDue:      *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:       *money.NewMoney(0, money.EgyptianPound),
						VatDue:           *money.NewMoney(0, money.EgyptianPound),
						LoanBalance:      *money.NewMoney(2000, money.EgyptianPound),
						PrincipalPaid:    *money.NewMoney(0, money.EgyptianPound),
						InterestPaid:     *money.NewMoney(0, money.EgyptianPound),
						AdminFeePaid:     *money.NewMoney(0, money.EgyptianPound),
						PenaltyPaid:      *money.NewMoney(0, money.EgyptianPound),
						VatPaid:          *money.NewMoney(0, money.EgyptianPound),
						InstalmentDueAt:  timex.NewUtcTime(time.Date(2024, 4, 3, 0, 0, 0, 0, time.Local)),
						GracePeriodDueAt: timex.NewUtcTime(time.Date(2024, 4, 7, 0, 0, 0, 0, time.Local)),
					},
					{
						ScheduleNumber:   3,
						PrincipalDue:     *money.NewMoney(1000, money.EgyptianPound),
						InterestDue:      *money.NewMoney(10, money.EgyptianPound),
						AdminFeeDue:      *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:       *money.NewMoney(0, money.EgyptianPound),
						VatDue:           *money.NewMoney(0, money.EgyptianPound),
						LoanBalance:      *money.NewMoney(3000, money.EgyptianPound),
						PrincipalPaid:    *money.NewMoney(0, money.EgyptianPound),
						InterestPaid:     *money.NewMoney(0, money.EgyptianPound),
						AdminFeePaid:     *money.NewMoney(0, money.EgyptianPound),
						PenaltyPaid:      *money.NewMoney(0, money.EgyptianPound),
						VatPaid:          *money.NewMoney(0, money.EgyptianPound),
						InstalmentDueAt:  timex.NewUtcTime(time.Date(2024, 5, 3, 0, 0, 0, 0, time.Local)),
						GracePeriodDueAt: timex.NewUtcTime(time.Date(2024, 5, 7, 0, 0, 0, 0, time.Local)),
					},
				},
			},
			cancellationTime: timex.NewUtcTimeNow(),
			returnPolicyDays: nil,
			wantIsCancelled:  false,
			wantReason:       stringx.ToPtr("instalment(s) is already paid and hence cannot be cancelled"),
		},
		{
			name: "when loan state is active but the first revenue has been recognised, it cannot be cancelled",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						ScheduleNumber:   1,
						PrincipalDue:     *money.NewMoney(1000, money.EgyptianPound),
						InterestDue:      *money.NewMoney(10, money.EgyptianPound),
						AdminFeeDue:      *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:       *money.NewMoney(0, money.EgyptianPound),
						VatDue:           *money.NewMoney(0, money.EgyptianPound),
						LoanBalance:      *money.NewMoney(3000, money.EgyptianPound),
						PrincipalPaid:    *money.NewMoney(0, money.EgyptianPound),
						InterestPaid:     *money.NewMoney(0, money.EgyptianPound),
						AdminFeePaid:     *money.NewMoney(0, money.EgyptianPound),
						PenaltyPaid:      *money.NewMoney(0, money.EgyptianPound),
						VatPaid:          *money.NewMoney(0, money.EgyptianPound),
						InstalmentDueAt:  timex.NewUtcTime(time.Date(2024, 3, 3, 23, 59, 59, 0, time.Local)),
						GracePeriodDueAt: timex.NewUtcTime(time.Date(2024, 3, 7, 23, 59, 59, 0, time.Local)),
					},
					{
						ScheduleNumber:   2,
						PrincipalDue:     *money.NewMoney(1000, money.EgyptianPound),
						InterestDue:      *money.NewMoney(10, money.EgyptianPound),
						AdminFeeDue:      *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:       *money.NewMoney(0, money.EgyptianPound),
						VatDue:           *money.NewMoney(0, money.EgyptianPound),
						LoanBalance:      *money.NewMoney(2000, money.EgyptianPound),
						PrincipalPaid:    *money.NewMoney(0, money.EgyptianPound),
						InterestPaid:     *money.NewMoney(0, money.EgyptianPound),
						AdminFeePaid:     *money.NewMoney(0, money.EgyptianPound),
						PenaltyPaid:      *money.NewMoney(0, money.EgyptianPound),
						VatPaid:          *money.NewMoney(0, money.EgyptianPound),
						InstalmentDueAt:  timex.NewUtcTime(time.Date(2024, 4, 3, 23, 59, 59, 0, time.Local)),
						GracePeriodDueAt: timex.NewUtcTime(time.Date(2024, 4, 7, 23, 59, 59, 0, time.Local)),
					},
					{
						ScheduleNumber:   3,
						PrincipalDue:     *money.NewMoney(1000, money.EgyptianPound),
						InterestDue:      *money.NewMoney(10, money.EgyptianPound),
						AdminFeeDue:      *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:       *money.NewMoney(0, money.EgyptianPound),
						VatDue:           *money.NewMoney(0, money.EgyptianPound),
						LoanBalance:      *money.NewMoney(3000, money.EgyptianPound),
						PrincipalPaid:    *money.NewMoney(0, money.EgyptianPound),
						InterestPaid:     *money.NewMoney(0, money.EgyptianPound),
						AdminFeePaid:     *money.NewMoney(0, money.EgyptianPound),
						PenaltyPaid:      *money.NewMoney(0, money.EgyptianPound),
						VatPaid:          *money.NewMoney(0, money.EgyptianPound),
						InstalmentDueAt:  timex.NewUtcTime(time.Date(2024, 5, 3, 23, 59, 59, 0, time.Local)),
						GracePeriodDueAt: timex.NewUtcTime(time.Date(2024, 5, 7, 23, 59, 59, 0, time.Local)),
					},
				},
			},
			cancellationTime: timex.NewUtcTime(time.Date(2024, 3, 3, 10, 25, 34, 0, time.Local)),
			returnPolicyDays: nil,
			wantIsCancelled:  false,
			wantReason:       stringx.ToPtr("first interest revenue is already recognised, cannot cancel"),
		},
		{
			name: "loan is cancelled if cancellation is < 30 days",
			la: &LoanAccountAggregate{
				state:       pbevent.LoanAccountState_ACTIVE,
				BookedAt:    timex.NewUtcTime(time.Date(2024, 4, 3, 10, 59, 23, 0, time.Local)), // 2024-04-03 10:59:23
				ActivatedAt: timex.NewUtcTime(time.Date(2024, 4, 3, 10, 59, 23, 0, time.Local)).AsPtr(),
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						ScheduleNumber:         1,
						PrincipalDue:           *money.NewMoney(1000, money.EgyptianPound),
						InterestDue:            *money.NewMoney(10, money.EgyptianPound),
						AdminFeeDue:            *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:             *money.NewMoney(0, money.EgyptianPound),
						VatDue:                 *money.NewMoney(0, money.EgyptianPound),
						LoanBalance:            *money.NewMoney(3000, money.EgyptianPound),
						PrincipalPaid:          *money.NewMoney(0, money.EgyptianPound),
						InterestPaid:           *money.NewMoney(0, money.EgyptianPound),
						AdminFeePaid:           *money.NewMoney(0, money.EgyptianPound),
						PenaltyPaid:            *money.NewMoney(0, money.EgyptianPound),
						VatPaid:                *money.NewMoney(0, money.EgyptianPound),
						InstalmentDueAt:        timex.NewUtcTime(time.Date(2024, 5, 3, 0, 0, 0, 0, time.Local)),
						GracePeriodDueAt:       timex.NewUtcTime(time.Date(2024, 5, 7, 0, 0, 0, 0, time.Local)),
						LinkedPaymentReference: make([]string, 0),
					},
				},
			},
			cancellationTime: timex.NewUtcTime(time.Date(2024, 5, 2, 12, 45, 36, 0, time.Local)), // 2024-05-02 12:45:36
			returnPolicyDays: nil,
			wantIsCancelled:  true,
		},
		{
			name: "when no return policy date is specified a default return policy day of 30 days is taken and loan is cancelled if cancellation is < 30 days",
			la: &LoanAccountAggregate{
				state:       pbevent.LoanAccountState_ACTIVE,
				BookedAt:    timex.NewUtcTime(time.Date(2024, 4, 3, 10, 59, 23, 0, time.Local)), // 2024-04-03 10:59:23
				ActivatedAt: timex.NewUtcTime(time.Date(2024, 4, 3, 10, 59, 23, 0, time.Local)).AsPtr(),
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						ScheduleNumber:   1,
						PrincipalDue:     *money.NewMoney(1000, money.EgyptianPound),
						InterestDue:      *money.NewMoney(10, money.EgyptianPound),
						AdminFeeDue:      *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:       *money.NewMoney(0, money.EgyptianPound),
						VatDue:           *money.NewMoney(0, money.EgyptianPound),
						LoanBalance:      *money.NewMoney(3000, money.EgyptianPound),
						PrincipalPaid:    *money.NewMoney(0, money.EgyptianPound),
						InterestPaid:     *money.NewMoney(0, money.EgyptianPound),
						AdminFeePaid:     *money.NewMoney(0, money.EgyptianPound),
						PenaltyPaid:      *money.NewMoney(0, money.EgyptianPound),
						VatPaid:          *money.NewMoney(0, money.EgyptianPound),
						InstalmentDueAt:  timex.NewUtcTime(time.Date(2024, 5, 3, 0, 0, 0, 0, time.Local)),
						GracePeriodDueAt: timex.NewUtcTime(time.Date(2024, 5, 7, 0, 0, 0, 0, time.Local)),
					},
				},
			},
			cancellationTime: timex.NewUtcTime(time.Date(2024, 5, 2, 21, 46, 23, 0, time.Local)), // 2024-05-02 12:45:36
			returnPolicyDays: nil,
			wantIsCancelled:  true,
		},
	}

	for _, tt := range testcases {
		t.Run(tt.name, func(t *testing.T) {
			got, gotReason := tt.la.IsLoanCancellable(tt.cancellationTime, tt.returnPolicyDays)
			assert.True(t, tt.wantIsCancelled == got)
			if gotReason != nil && *gotReason != *tt.wantReason {
				t.Errorf("got: %s, wantIsCancelled: %s", *gotReason, *tt.wantReason)
			}
		})
	}
}
