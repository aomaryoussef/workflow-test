package aggregate

import (
	"fmt"

	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/timex"
	. "github.com/samber/lo"
)

func (la *LoanAccountAggregate) Reduce() error {
	for _, evnt := range la.BaseAggregate.Events() {
		switch evnt.EventType {
		case pbcommon.EventType_LOAN_ACCOUNT_CREATED:
			if err := la.onCreated(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_LOAN_ACCOUNT_ACTIVATED:
			if err := la.onActivation(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_LOAN_ACCOUNT_CANCELED:
			if err := la.onCancelled(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_LOAN_ACCOUNT_EARLY_SETTLEMENT:
			if err := la.onEarlySettled(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_LOAN_ACCOUNT_INTEREST_REVENUE_RECOGNIZED:
			if err := la.onInterestRevenueRecognized(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_LOAN_ACCOUNT_PAYMENT_BOOKED:
			if err := la.onPaymentApplied(evnt); err != nil {
				return err
			}
		default:
			return fmt.Errorf("eventsource type not supported for loan account reduce function: %s", evnt.EventType.String())
		}
	}

	la.BaseAggregate.BaseAggregateReduce()
	return nil
}

func (la *LoanAccountAggregate) onCreated(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.LoanAccountCreatedEventPayload)

	la.state = payload.State
	la.subState = payload.SubState
	la.BorrowerId = payload.BorrowerId
	la.BorrowerRepaymentDayOfMonth = payload.RepaymentDayOfMonth
	la.CommercialOfferId = payload.CommercialOfferId
	la.FinancialProductId = payload.FinancialProductId
	la.FinancialProductTenorKey = payload.FinancialProductTenorKey
	la.TenorDays = payload.TenorDays
	la.GracePeriodInDays = payload.GracePeriodInDays
	la.BookedAt = timex.NewUtcTime(payload.BookedAt.AsTime())
	la.MerchantId = payload.MerchantId
	la.MerchantCode = payload.MerchantCode
	la.LenderSource = payload.LenderSource
	la.OriginationChannel = payload.OriginationChannel
	la.FlatRateBasisPoints = types.PercentBasisPoints(payload.FlatRateBasisPoints)
	la.MonthlyEffectiveRate = payload.MonthlyEffectiveRate
	la.TotalEffectiveRate = payload.TotalEffectiveRate
	la.AnnualPercentageRate = payload.AnnualPercentageRate
	la.VatPercentageBasisPoints = types.PercentBasisPoints(payload.VatPercentageBasisPoints)
	la.AdminFeePercentageBasisPoints = types.PercentBasisPoints(payload.AdminFeePercentageBasisPoints)
	la.EarlySettlementFeeBasisPoints = types.PercentBasisPoints(payload.EarlySettlementFeePercentageBasisPoints)
	la.BadDebtFeeBasisPoints = types.PercentBasisPoints(payload.BadDebtFeePercentageBasisPoints)
	la.RoundingUpEstimatedGain = *money.NewMoney(payload.RoundingUpEstimatedGainUnits, payload.AppliedCurrency)
	la.MonetaryLineItems = Map(payload.MonetaryLineItems, func(item *pbevent.LoanAccountMonetaryLineItem, _ int) LoanAccountMonetaryLineItem {
		return LoanAccountMonetaryLineItem{
			Amount:         *money.NewMoney(item.Money.Units, payload.AppliedCurrency),
			Type:           item.Type,
			CollectionType: item.CollectionType,
			BookingTime:    timex.NewUtcTime(payload.BookedAt.AsTime()),
		}
	})
	la.MonthlyInstalment = *money.NewMoney(payload.MonthlyInstalment.Units, payload.AppliedCurrency)

	return nil
}

func (la *LoanAccountAggregate) onActivation(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.LoanAccountActivatedEventPayload)
	la.state = payload.State
	la.subState = payload.SubState
	la.ActivatedAt = &e.CreatedAt

	loanAmount := la.MonetaryLineItems.FinancedAmount()
	appliedCurrency := loanAmount.Currency().Code

	la.AmmortisationLineItems = Map(payload.AmmortisationLineItems, func(item *pbevent.LoanAccountAmmortisationLineItem, _ int) LoanAccountAmmortisationLineItem {
		return LoanAccountAmmortisationLineItem{
			InstalmentDueAt:    timex.NewUtcTime(item.InstalmentDueAt.AsTime()),
			GracePeriodDueAt:   timex.NewUtcTime(item.GracePeriodEndAt.AsTime()),
			LoanBalance:        *money.NewMoney(item.LoanBalance.Units, appliedCurrency),
			PrincipalDue:       *money.NewMoney(item.PrincipalDue.Units, appliedCurrency),
			InterestDue:        *money.NewMoney(item.InterestDue.Units, appliedCurrency),
			CumulativeInterest: *money.NewMoney(item.CumulativeInterestDue.Units, appliedCurrency),
			PenaltyDue:         *money.NewMoney(item.PenaltyDue.Units, appliedCurrency),
			AdminFeeDue:        *money.NewMoney(item.AdminFeeDue.Units, appliedCurrency),
			VatDue:             *money.NewMoney(item.VatDue.Units, appliedCurrency),
			ScheduleNumber:     item.ScheduleNumber,
			Canceled:           item.Cancelled,
		}
	})

	return nil
}

func (la *LoanAccountAggregate) onCancelled(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.LoanAccountCanceledEventPayload)
	la.state = payload.State
	la.subState = payload.SubState

	cancellationReason := payload.CancellationReason
	for i, item := range la.AmmortisationLineItems {
		item.Canceled = true
		item.CanceledAt = &e.CreatedAt
		item.CanceledReason = &cancellationReason
		la.AmmortisationLineItems[i] = item
	}

	return nil
}

func (la *LoanAccountAggregate) onEarlySettled(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.LoanAccountEarlySettledEventPayload)
	la.subState = payload.SubState
	for _, cancelledSchedule := range payload.CancelledScheduleNumbers {
		for i, item := range la.AmmortisationLineItems {
			substateStr := payload.SubState.String()
			if item.ScheduleNumber == cancelledSchedule {
				item.Canceled = true
				item.CanceledAt = &e.CreatedAt
				item.CanceledReason = &substateStr
				la.AmmortisationLineItems[i] = item
			}
		}
	}

	appliedCurrency := la.MonetaryLineItems.FinancedAmount().Currency().Code
	la.AmmortisationLineItems = append(la.AmmortisationLineItems, LoanAccountAmmortisationLineItem{
		InstalmentDueAt:  timex.NewUtcTime(payload.AddedEarlySettlementAmmortisation.InstalmentDueAt.AsTime()),
		GracePeriodDueAt: timex.NewUtcTime(payload.AddedEarlySettlementAmmortisation.GracePeriodEndAt.AsTime()),
		LoanBalance:      *money.NewMoney(payload.AddedEarlySettlementAmmortisation.LoanBalance.Units, appliedCurrency),
		PrincipalDue:     *money.NewMoney(payload.AddedEarlySettlementAmmortisation.PrincipalDue.Units, appliedCurrency),
		InterestDue:      *money.NewMoney(payload.AddedEarlySettlementAmmortisation.InterestDue.Units, appliedCurrency),
		PenaltyDue:       *money.NewMoney(payload.AddedEarlySettlementAmmortisation.PenaltyDue.Units, appliedCurrency),
		AdminFeeDue:      *money.NewMoney(payload.AddedEarlySettlementAmmortisation.AdminFeeDue.Units, appliedCurrency),
		VatDue:           *money.NewMoney(payload.AddedEarlySettlementAmmortisation.VatDue.Units, appliedCurrency),
		ScheduleNumber:   payload.AddedEarlySettlementAmmortisation.ScheduleNumber,
		Canceled:         payload.AddedEarlySettlementAmmortisation.Cancelled,

		PrincipalPaid: *money.NewMoney(0, appliedCurrency),
		InterestPaid:  *money.NewMoney(0, appliedCurrency),
		VatPaid:       *money.NewMoney(0, appliedCurrency),
		AdminFeePaid:  *money.NewMoney(0, appliedCurrency),
		PenaltyPaid:   *money.NewMoney(0, appliedCurrency),
	})

	return nil
}

func (la *LoanAccountAggregate) onInterestRevenueRecognized(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.LoanAccountRevenueRecognisedEventPayload)

	for _, item := range la.AmmortisationLineItems {
		if item.ScheduleNumber == payload.ScheduleNumber && payload.Type == pbevent.MonetaryLineItemType_INTEREST_ACCRUAL {
			item.InterestRevenueRecognised = true
			break
		}
	}

	la.MonetaryLineItems = append(la.MonetaryLineItems, LoanAccountMonetaryLineItem{
		Amount:         *money.NewMoney(payload.Money.Units, payload.Money.Currency),
		Type:           payload.Type,
		BookingTime:    timex.NewUtcTime(payload.BookingTime.AsTime()),
		CollectionType: pbevent.MonetaryLineItemCollectionType_NONE,
	})

	return nil
}

func (la *LoanAccountAggregate) onPaymentApplied(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.LoanAccountPaymentAppliedEventPayload)
	for i, item := range la.AmmortisationLineItems {
		if item.ScheduleNumber == payload.ScheduleNumber {
			item.PrincipalPaid = *money.NewMoney(payload.PrincipalPaid.Units, payload.PrincipalPaid.Currency)
			item.InterestPaid = *money.NewMoney(payload.InterestPaid.Units, payload.InterestPaid.Currency)
			item.VatPaid = *money.NewMoney(payload.VatPaid.Units, payload.VatPaid.Currency)
			item.AdminFeePaid = *money.NewMoney(payload.AdminFeePaid.Units, payload.AdminFeePaid.Currency)
			item.PenaltyPaid = *money.NewMoney(payload.PenaltyPaid.Units, payload.PenaltyPaid.Currency)
			item.PaidAt = timex.NewUtcTime(payload.BookingTime.AsTime()).AsPtr()
			item.LinkedPaymentReference = append(item.LinkedPaymentReference, payload.PaymentReference)

			la.AmmortisationLineItems[i] = item
			break
		}
	}

	return nil
}
