package aggregate

import (
	"time"

	"github.com/btechlabs/lms/config"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/stringx"
	"github.com/btechlabs/lms/pkg/timex"
)

type LoanAccountAggregate struct {
	*cqrs.BaseAggregate
	state                         pbevent.LoanAccountState
	subState                      pbevent.LoanAccountSubState
	BorrowerId                    string
	BorrowerRepaymentDayOfMonth   uint32
	CommercialOfferId             string
	FinancialProductId            string
	FinancialProductTenorKey      string
	TenorDays                     uint32
	GracePeriodInDays             uint32
	BookedAt                      timex.UtcTime
	ActivatedAt                   *timex.UtcTime
	MerchantId                    string
	MerchantCode                  string // TODO
	LenderSource                  string
	OriginationChannel            string
	FlatRateBasisPoints           types.PercentBasisPoints
	MonthlyEffectiveRate          float64
	TotalEffectiveRate            float64
	AnnualPercentageRate          float64
	VatPercentageBasisPoints      types.PercentBasisPoints
	AdminFeePercentageBasisPoints types.PercentBasisPoints
	EarlySettlementFeeBasisPoints types.PercentBasisPoints
	BadDebtFeeBasisPoints         types.PercentBasisPoints
	RoundingUpEstimatedGain       money.Money
	MonetaryLineItems             LoanAccountMonetaryLineItems
	AmmortisationLineItems        LoanAccountAmmortisationLineItems
	MonthlyInstalment             money.Money

	// Feature Flag to be removed after migration
	AllowLoanCancellationAfterInterestRecognition bool
}

func NewInitLoanAccountAggregate() *LoanAccountAggregate {
	return &LoanAccountAggregate{
		BaseAggregate: cqrs.NewBaseAggregate(types.AggregateTypeLoanAccount),
		AllowLoanCancellationAfterInterestRecognition: false,
	}
}

func (la *LoanAccountAggregate) State() pbevent.LoanAccountState {
	return la.state
}

func (la *LoanAccountAggregate) SubState() pbevent.LoanAccountSubState {
	return la.subState
}

func (la *LoanAccountAggregate) IsLoanCancellable(cancellationTime timex.UtcTime, returnPolicyDays *int) (bool, *string) {
	if la.state == pbevent.LoanAccountState_CREATED {
		return true, nil
	}
	if la.state != pbevent.LoanAccountState_ACTIVE {
		return false, stringx.ToPtr("loan account state is not active and hence cannot be cancelled")
	}

	// Cancellation time must be less than the first interest revenue recognition date
	if len(la.AmmortisationLineItems) == 0 {
		return false, stringx.ToPtr("loan account has no amortisation line items, this cannot happen and a serious bug")
	}

	for _, item := range la.AmmortisationLineItems {
		if item.IsPaid() {
			return false, stringx.ToPtr("instalment(s) is already paid and hence cannot be cancelled")
		}
	}

	// Feature Flag to be removed after migration
	if !la.AllowLoanCancellationAfterInterestRecognition {
		firstInstalmentDueAt := la.AmmortisationLineItems[0].InstalmentDueAt
		firstRevenueRecognitionDate := firstInstalmentDueAt.InLocalTZStartOfDay()
		if cancellationTime.ToStdLibTime().After(firstRevenueRecognitionDate.ToStdLibTime()) {
			return false, stringx.ToPtr("first interest revenue is already recognised, cannot cancel")
		}
	}

	returnPolicyDaysInNanoseconds := config.Duration30Days
	if returnPolicyDays != nil {
		// the return policy from the incoming request will be applied here if not null
		returnPolicyDaysInNanoseconds = time.Duration(*returnPolicyDays) * 24 * time.Hour
	}

	if la.ActivatedAt == nil {
		return false, stringx.ToPtr("loan account has been activated but no activation date found, this cannot happen and a serious bug")
	}

	timeDifference := cancellationTime.ToStdLibTime().Sub(la.ActivatedAt.ToStdLibTime())

	// Cancellation time must be [ReturnPolicyDays] days within loan activation
	if timeDifference.Nanoseconds() > returnPolicyDaysInNanoseconds.Nanoseconds() {
		return false, stringx.ToPtr("loan account cancellation time is outside the return policy days")
	}

	return true, nil
}

func (la *LoanAccountAggregate) IsRevenueRecognitionAllowed() bool {
	return la.state == pbevent.LoanAccountState_ACTIVE ||
		la.state == pbevent.LoanAccountState_ACTIVE_IN_ARREARS
}

func (la *LoanAccountAggregate) SetAllowLoanCancellationAfterInterestRecognition() {
	la.AllowLoanCancellationAfterInterestRecognition = true
}
