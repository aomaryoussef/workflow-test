package aggregate

import (
	"errors"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/fincalc"
	"github.com/btechlabs/lms/pkg/money"
)

type EarlySettlementUnavailabilityReason string // EarlySettlementUnavailabilityReason is the reason why early settlement is not available

const (
	earlySettlementUnavailabilityReason_ACCOUNT_NOT_ACTIVE = EarlySettlementUnavailabilityReason("ACCOUNT_NOT_ACTIVE")
	earlySettlementUnavailabilityReason_SUBSTATE_INVALID   = EarlySettlementUnavailabilityReason("SUBSTATE_INVALID")
	earlySettlementUnavailabilityReason_ALL_PAID           = EarlySettlementUnavailabilityReason("ALL_PAID")
	earlySettlementUnavailabilityReason_LAST_UNPAID        = EarlySettlementUnavailabilityReason("LAST_UNPAID")
	earlySettlementUnavailabilityReason_NONE_PAID          = EarlySettlementUnavailabilityReason("NONE_PAID")
)

type EarlySettlementForLoanAccount struct {
	IsEarlySettlementAvailable bool
	// Will be available if IsEarlySettlementAvailable is false
	ReasonForUnavailability *string
	// Will not be available if IsEarlySettlementAvailable is false
	EarlySettlementPrincipalDue *money.Money // EarlySettlementPrincipalDue is the sum of all outstanding principal
	EarlySettlementFeesDue      *money.Money // EarlySettlementFeesDue is the fees
	InitialInterestReceivable   *money.Money // InitialInterestReceivable is the sum of all the interest that was due at the time of early settlement
}

// earlySettlementAllowed checks if early settlement is allowed for the loan account.
//   - it validates the current state as ACTIVE
//   - no special sub-state of the loan account
//   - at least one installment has been paid
//   - not all installments have been paid
//   - not the last installment is unpaid (because it doesn't make sense to settle early if only one installment is left)
//
// Returns:
// - A boolean indicating whether early settlement is allowed.
// - An error if early settlement is not allowed, with a reason for the unavailability.
func (la *LoanAccountAggregate) earlySettlementAllowed() (bool, error) {
	if la.state != pbevent.LoanAccountState_ACTIVE {
		return false, errors.New(string(earlySettlementUnavailabilityReason_ACCOUNT_NOT_ACTIVE))
	}
	if la.subState != pbevent.LoanAccountSubState_NOT_AVAILABLE {
		return false, errors.New(string(earlySettlementUnavailabilityReason_SUBSTATE_INVALID))
	}

	totalValidInstallments := 0
	numberOfInstallmentsPaid := 0
	for _, schedule := range la.AmmortisationLineItems {
		if schedule.Canceled {
			continue
		}
		totalValidInstallments++
		if schedule.IsPaid() {
			numberOfInstallmentsPaid++
		}
	}

	if totalValidInstallments == 0 {
		return false, errors.New("no valid installments found")
	}
	if numberOfInstallmentsPaid == 0 {
		return false, errors.New(string(earlySettlementUnavailabilityReason_NONE_PAID))
	}

	if totalValidInstallments == numberOfInstallmentsPaid {
		return false, errors.New(string(earlySettlementUnavailabilityReason_ALL_PAID))
	}
	if totalValidInstallments-numberOfInstallmentsPaid == 1 {
		return false, errors.New(string(earlySettlementUnavailabilityReason_LAST_UNPAID))
	}

	return true, nil
}

// GetEarlySettlementDetails retrieves the early settlement details for the loan account.
// It checks if early settlement is allowed and returns the appropriate details.
//
// Returns:
//   - An EarlySettlementForLoanAccount struct containing the early settlement details.
//     If early settlement is not allowed, the struct will contain the reason for unavailability.
func (la *LoanAccountAggregate) GetEarlySettlementDetails() EarlySettlementForLoanAccount {
	earlySettlementAllowed, reason := la.earlySettlementAllowed()

	if !earlySettlementAllowed {
		reasonMsg := reason.Error()
		return EarlySettlementForLoanAccount{
			IsEarlySettlementAvailable: false,
			ReasonForUnavailability:    &reasonMsg,
		}
	}

	totalPrincipalDue := la.AmmortisationLineItems.TotalPrincipalDue()
	initialInterestReceivable := la.AmmortisationLineItems.TotalInterestReceivableDue()
	earlySettlementFees := fincalc.CalculateEarlySettlementFees(totalPrincipalDue, initialInterestReceivable, la.EarlySettlementFeeBasisPoints)
	return EarlySettlementForLoanAccount{
		IsEarlySettlementAvailable:  true,
		EarlySettlementPrincipalDue: &totalPrincipalDue,
		EarlySettlementFeesDue:      &earlySettlementFees,
		InitialInterestReceivable:   &initialInterestReceivable,
	}
}
