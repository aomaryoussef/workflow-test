package aggregate

import (
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/timex"
	"testing"
	"time"
)

func TestEarlySettlementAllowed(t *testing.T) {
	var paidAt = func(t time.Time) *timex.UtcTime {
		utcTime := timex.NewUtcTime(t)
		return &utcTime
	}
	testcases := []struct {
		name           string
		la             *LoanAccountAggregate
		wantAllowed    bool
		wantErr        bool
		expectedErrMsg string
	}{
		{
			name: "when loan state is not active, early settlement is not allowed",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_CLOSED,
			},
			wantAllowed:    false,
			wantErr:        true,
			expectedErrMsg: string(earlySettlementUnavailabilityReason_ACCOUNT_NOT_ACTIVE),
		},
		{
			name: "when loan sub-state is invalid, early settlement is not allowed",
			la: &LoanAccountAggregate{
				state:    pbevent.LoanAccountState_ACTIVE,
				subState: pbevent.LoanAccountSubState_PAID_OFF,
			},
			wantAllowed:    false,
			wantErr:        true,
			expectedErrMsg: string(earlySettlementUnavailabilityReason_SUBSTATE_INVALID),
		},
		{
			name: "when no valid installments found, early settlement is not allowed",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
			},
			wantAllowed:    false,
			wantErr:        true,
			expectedErrMsg: "no valid installments found",
		},
		{
			name: "when no installments are paid, early settlement is not allowed",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{Canceled: false, PrincipalPaid: *money.NewMoney(0, money.EgyptianPound)},
				},
			},
			wantAllowed:    false,
			wantErr:        true,
			expectedErrMsg: string(earlySettlementUnavailabilityReason_NONE_PAID),
		},
		{
			name: "when all installments are paid, early settlement is not allowed",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						Canceled:      false,
						PrincipalDue:  *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:   *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:        *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:   *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:    *money.NewMoney(10_00, money.EgyptianPound),
						PaidAt:        paidAt(time.Now()),
						PrincipalPaid: *money.NewMoney(10_00, money.EgyptianPound),
						InterestPaid:  *money.NewMoney(10_00, money.EgyptianPound),
						VatPaid:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeePaid:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyPaid:   *money.NewMoney(10_00, money.EgyptianPound),
					},
					{
						Canceled:      false,
						PrincipalDue:  *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:   *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:        *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:   *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:    *money.NewMoney(10_00, money.EgyptianPound),
						PaidAt:        paidAt(time.Now()),
						PrincipalPaid: *money.NewMoney(10_00, money.EgyptianPound),
						InterestPaid:  *money.NewMoney(10_00, money.EgyptianPound),
						VatPaid:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeePaid:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyPaid:   *money.NewMoney(10_00, money.EgyptianPound),
					},
				},
			},
			wantAllowed:    false,
			wantErr:        true,
			expectedErrMsg: string(earlySettlementUnavailabilityReason_ALL_PAID),
		},
		{
			name: "when only the last installment is unpaid, early settlement is not allowed",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						Canceled:      false,
						PrincipalDue:  *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:   *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:        *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:   *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:    *money.NewMoney(10_00, money.EgyptianPound),
						PaidAt:        paidAt(time.Now()),
						PrincipalPaid: *money.NewMoney(10_00, money.EgyptianPound),
						InterestPaid:  *money.NewMoney(10_00, money.EgyptianPound),
						VatPaid:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeePaid:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyPaid:   *money.NewMoney(10_00, money.EgyptianPound),
					},
					{
						Canceled:     false,
						PrincipalDue: *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:  *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:   *money.NewMoney(10_00, money.EgyptianPound),
					},
				},
			},
			wantAllowed:    false,
			wantErr:        true,
			expectedErrMsg: string(earlySettlementUnavailabilityReason_LAST_UNPAID),
		},
		{
			name: "when early settlement is allowed",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						Canceled:      false,
						PrincipalDue:  *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:   *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:        *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:   *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:    *money.NewMoney(10_00, money.EgyptianPound),
						PaidAt:        paidAt(time.Now()),
						PrincipalPaid: *money.NewMoney(10_00, money.EgyptianPound),
						InterestPaid:  *money.NewMoney(10_00, money.EgyptianPound),
						VatPaid:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeePaid:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyPaid:   *money.NewMoney(10_00, money.EgyptianPound),
					},
					{
						Canceled:     false,
						PrincipalDue: *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:  *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:   *money.NewMoney(10_00, money.EgyptianPound),
					},
					{
						Canceled:     false,
						PrincipalDue: *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:  *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:   *money.NewMoney(10_00, money.EgyptianPound),
					},
				},
			},
			wantAllowed: true,
			wantErr:     false,
		},
	}

	for _, tt := range testcases {
		t.Run(tt.name, func(t *testing.T) {
			gotAllowed, err := tt.la.earlySettlementAllowed()
			if gotAllowed != tt.wantAllowed {
				t.Errorf("earlySettlementAllowed() gotAllowed = %v, wantIsCancelled %v", gotAllowed, tt.wantAllowed)
			}
			if (err != nil) != tt.wantErr {
				t.Errorf("earlySettlementAllowed() error = %v, wantErr %v", err, tt.wantErr)
			}
			if err != nil && err.Error() != tt.expectedErrMsg {
				t.Errorf("earlySettlementAllowed() error message = %v, expectedErrMsg %v", err.Error(), tt.expectedErrMsg)
			}
		})
	}
}

func TestEarlySettlementDetails(t *testing.T) {
	var paidAt = func(t time.Time) *timex.UtcTime {
		utcTime := timex.NewUtcTime(t)
		return &utcTime
	}
	testcases := []struct {
		name          string
		la            *LoanAccountAggregate
		wantAvailable bool
		wantReason    *string
		wantPrincipal *money.Money
		wantFees      *money.Money
		wantInterest  *money.Money
	}{
		{
			name: "when early settlement is not allowed due to account not active",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_CLOSED,
			},
			wantAvailable: false,
			wantReason:    stringPtr(string(earlySettlementUnavailabilityReason_ACCOUNT_NOT_ACTIVE)),
		},
		{
			name: "when early settlement is not allowed due to invalid sub-state",
			la: &LoanAccountAggregate{
				state:    pbevent.LoanAccountState_ACTIVE,
				subState: pbevent.LoanAccountSubState_PAID_OFF,
			},
			wantAvailable: false,
			wantReason:    stringPtr(string(earlySettlementUnavailabilityReason_SUBSTATE_INVALID)),
		},
		{
			name: "when early settlement is not allowed due to no valid installments",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
			},
			wantAvailable: false,
			wantReason:    stringPtr("no valid installments found"),
		},
		{
			name: "when early settlement is not allowed due to no installments paid",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{Canceled: false, PrincipalPaid: *money.NewMoney(0, money.EgyptianPound)},
				},
			},
			wantAvailable: false,
			wantReason:    stringPtr(string(earlySettlementUnavailabilityReason_NONE_PAID)),
		},
		{
			name: "when early settlement is not allowed due to all installments paid",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						Canceled:      false,
						PrincipalDue:  *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:   *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:        *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:   *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:    *money.NewMoney(10_00, money.EgyptianPound),
						PaidAt:        paidAt(time.Now()),
						PrincipalPaid: *money.NewMoney(10_00, money.EgyptianPound),
						InterestPaid:  *money.NewMoney(10_00, money.EgyptianPound),
						VatPaid:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeePaid:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyPaid:   *money.NewMoney(10_00, money.EgyptianPound),
					},
					{
						Canceled:      false,
						PrincipalDue:  *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:   *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:        *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:   *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:    *money.NewMoney(10_00, money.EgyptianPound),
						PaidAt:        paidAt(time.Now()),
						PrincipalPaid: *money.NewMoney(10_00, money.EgyptianPound),
						InterestPaid:  *money.NewMoney(10_00, money.EgyptianPound),
						VatPaid:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeePaid:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyPaid:   *money.NewMoney(10_00, money.EgyptianPound),
					},
				},
			},
			wantAvailable: false,
			wantReason:    stringPtr(string(earlySettlementUnavailabilityReason_ALL_PAID)),
		},
		{
			name: "when early settlement is not allowed due to last installment unpaid",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						Canceled:      false,
						PrincipalDue:  *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:   *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:        *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:   *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:    *money.NewMoney(10_00, money.EgyptianPound),
						PaidAt:        paidAt(time.Now()),
						PrincipalPaid: *money.NewMoney(10_00, money.EgyptianPound),
						InterestPaid:  *money.NewMoney(10_00, money.EgyptianPound),
						VatPaid:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeePaid:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyPaid:   *money.NewMoney(10_00, money.EgyptianPound),
					},
					{
						Canceled:     false,
						PrincipalDue: *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:  *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:       *money.NewMoney(10_00, money.EgyptianPound),
						AdminFeeDue:  *money.NewMoney(10_00, money.EgyptianPound),
						PenaltyDue:   *money.NewMoney(10_00, money.EgyptianPound),
					},
				},
			},
			wantAvailable: false,
			wantReason:    stringPtr(string(earlySettlementUnavailabilityReason_LAST_UNPAID)),
		},
		{
			name: "when early settlement is allowed",
			la: &LoanAccountAggregate{
				state: pbevent.LoanAccountState_ACTIVE,
				AmmortisationLineItems: []LoanAccountAmmortisationLineItem{
					{
						Canceled:      false,
						PrincipalDue:  *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:   *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:        *money.NewMoney(0, money.EgyptianPound),
						AdminFeeDue:   *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:    *money.NewMoney(0, money.EgyptianPound),
						PaidAt:        paidAt(time.Now()),
						PrincipalPaid: *money.NewMoney(10_00, money.EgyptianPound),
						InterestPaid:  *money.NewMoney(10_00, money.EgyptianPound),
						VatPaid:       *money.NewMoney(0, money.EgyptianPound),
						AdminFeePaid:  *money.NewMoney(0, money.EgyptianPound),
						PenaltyPaid:   *money.NewMoney(0, money.EgyptianPound),
					},
					{
						Canceled:     false,
						PrincipalDue: *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:  *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:       *money.NewMoney(0, money.EgyptianPound),
						AdminFeeDue:  *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:   *money.NewMoney(0, money.EgyptianPound),
					},
					{
						Canceled:     false,
						PrincipalDue: *money.NewMoney(10_00, money.EgyptianPound),
						InterestDue:  *money.NewMoney(10_00, money.EgyptianPound),
						VatDue:       *money.NewMoney(0, money.EgyptianPound),
						AdminFeeDue:  *money.NewMoney(0, money.EgyptianPound),
						PenaltyDue:   *money.NewMoney(0, money.EgyptianPound),
					},
				},
				EarlySettlementFeeBasisPoints: 1_00,
			},
			wantAvailable: true,
			wantPrincipal: money.AsPtr(*money.NewMoney(20_00, money.EgyptianPound)),
			wantFees:      money.AsPtr(*money.NewMoney(1_00, money.EgyptianPound)),
			wantInterest:  money.AsPtr(*money.NewMoney(2000, money.EgyptianPound)),
		},
	}

	for _, tt := range testcases {
		t.Run(tt.name, func(t *testing.T) {
			gotDetails := tt.la.GetEarlySettlementDetails()
			if gotDetails.IsEarlySettlementAvailable != tt.wantAvailable {
				t.Errorf("GetEarlySettlementDetails() IsEarlySettlementAvailable = %v, wantIsCancelled %v", gotDetails.IsEarlySettlementAvailable, tt.wantAvailable)
			}
			if tt.wantReason != nil && *gotDetails.ReasonForUnavailability != *tt.wantReason {
				t.Errorf("GetEarlySettlementDetails() ReasonForUnavailability = %v, wantIsCancelled %v", *gotDetails.ReasonForUnavailability, *tt.wantReason)
			}
			if tt.wantPrincipal != nil && !gotDetails.EarlySettlementPrincipalDue.MustEquals(tt.wantPrincipal) {
				t.Errorf("GetEarlySettlementDetails() EarlySettlementPrincipalDue = %s, wantIsCancelled %s", gotDetails.EarlySettlementPrincipalDue.String(), tt.wantPrincipal.String())
			}
			if tt.wantFees != nil && !gotDetails.EarlySettlementFeesDue.MustEquals(tt.wantFees) {
				t.Errorf("GetEarlySettlementDetails() EarlySettlementFeesDue = %s, wantIsCancelled %s", gotDetails.EarlySettlementFeesDue.String(), tt.wantFees.String())
			}
			if tt.wantInterest != nil && !gotDetails.InitialInterestReceivable.MustEquals(tt.wantInterest) {
				t.Errorf("GetEarlySettlementDetails() InitialInterestReceivable = %s, wantIsCancelled %s", gotDetails.InitialInterestReceivable.String(), tt.wantInterest.String())
			}
		})
	}
}

func stringPtr(s string) *string {
	return &s
}
