package aggregate

import (
	"errors"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/btechlabs/lms/config"
	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/fincalc"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/timex"
	"github.com/btechlabs/lms/pkg/uid"
	. "github.com/samber/lo"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (la *LoanAccountAggregate) ApplyCommand(cmd cqrs.Command) (*cqrs.Event, error) {
	if cmd == nil {
		return nil, cqrs.ErrInvalidCommand
	}
	la.BaseAggregate.BaseAggregateApplyCommand(cmd)

	switch cmd.Type() {
	case cqrs.CmdTypeLoanAccountCreate:
		v, ok := cmd.(*types.CreateLoanAccountCmd)
		if !ok {
			return nil, cqrs.ErrInvalidCommand
		}
		if v.FinancialProduct == nil {
			return nil, errors.Join(cqrs.ErrInvalidCommand, errors.New("missing financial product data"))
		}
		return la.onCmdCreate(v)
	case cqrs.CmdTypeLoanAccountActivate:
		v, ok := cmd.(*types.ActivateLoanAccountCmd)
		if !ok {
			return nil, cqrs.ErrInvalidCommand
		}
		return la.onCmdActivate(v)
	case cqrs.CmdTypeLoanAccountCancel:
		v, ok := cmd.(*types.CancelLoanAccountCmd)
		if !ok {
			return nil, cqrs.ErrInvalidCommand
		}
		return la.onCmdCancel(v)
	case cqrs.CmdTypeLoanAccountEarlySettle:
		v, ok := cmd.(*types.EarlySettleLoanAccountCmd)
		if !ok {
			return nil, cqrs.ErrInvalidCommand
		}
		return la.onCmdEarlySettle(v)
	case cqrs.CmdTypeLoanAccountRevenueRecognition:
		v, ok := cmd.(*types.RecogniseRevenueCmd)
		if !ok {
			return nil, cqrs.ErrInvalidCommand
		}
		return la.onCmdRecogniseRevenue(v)
	case cqrs.CmdTypeLoanAccountPaymentProcess:
		v, ok := cmd.(*types.ApplyLoanPaymentCmd)
		if !ok {
			return nil, cqrs.ErrInvalidCommand
		}
		return la.onCmdApplyPayment(v)
	default:
		return nil, cqrs.ErrUnknownCommandType
	}
}

func (la *LoanAccountAggregate) onCmdCreate(cmd *types.CreateLoanAccountCmd) (*cqrs.Event, error) {
	originationAmount := money.MapApiMoneyToDomainMoney(cmd.OriginationAmount)
	currency := originationAmount.Currency()
	downPayment := money.MapApiMoneyToDomainMoney(cmd.DownPayment)
	financedAmount := originationAmount.MustSub(downPayment)

	if financedAmount.Amount() == 0 {
		return nil, errors.New(fmt.Sprintf("cannot create a loan for financed amount: %s", financedAmount.String()))
	}

	// assuming monthly payment frequency
	numberOfMonths := cmd.FinancialProduct.DurationInDays / config.DaysInMonth

	cmd.Logger.Debug(fmt.Sprintf("create loan account - borrower: %s, origination amount: %s, down payment: %s, loan amount: %s, number of months: %d",
		cmd.Borrower.BorrowerId,
		originationAmount.String(), downPayment.String(),
		financedAmount.String(), numberOfMonths))

	monthlyInstalmentWithNoRounding := fincalc.MonthlyInstalment(
		*financedAmount,
		cmd.FinancialProduct.DurationInDays,
		cmd.FinancialProduct.FlatRateBasisPoints,
		false,
	)
	cmd.Logger.Debug(fmt.Sprintf("monthly instalment without rounding: %s", monthlyInstalmentWithNoRounding.String()))

	monthlyInstalment := fincalc.MonthlyInstalment(
		*financedAmount,
		cmd.FinancialProduct.DurationInDays,
		cmd.FinancialProduct.FlatRateBasisPoints,
		cmd.FinancialProduct.InterestRoundingUp,
	)
	cmd.Logger.Debug(fmt.Sprintf("monthly instalment with rounding: %s", monthlyInstalment.String()))

	monthlyRoundingGainUnits := monthlyInstalment.Amount() - monthlyInstalmentWithNoRounding.Amount()

	monthlyEffectiveRate, err := fincalc.MonthlyEffectiveRate(
		*financedAmount,
		cmd.FinancialProduct.DurationInDays,
		monthlyInstalment,
	)
	if err != nil {
		return nil, err
	}
	cmd.Logger.Debug(fmt.Sprintf("monthly effective rate: %f", monthlyEffectiveRate))

	adminFee := fincalc.CalculateAdminFee(cmd.FinancialProductTenor.AdminFeeBasisPoints, *financedAmount)
	cmd.Logger.Debug(fmt.Sprintf("admin fee: %s", adminFee.String()))

	vatFee := fincalc.CalculateVatAmount(cmd.FinancialProduct.VatRateBasisPoints, adminFee)
	cmd.Logger.Debug(fmt.Sprintf("vat fee: %s", vatFee.String()))
	//adminFee, vatFee := fincalc.CalculateAdminFeeDeprecated(cmd.FinancialProductTenor.AdminFeeBasisPoints, cmd.FinancialProduct.VatRateBasisPoints, *financedAmount)
	//cmd.Logger.Debug(fmt.Sprintf("admin fee: %s", adminFee.String()))
	//cmd.Logger.Debug(fmt.Sprintf("vat fee: %s", vatFee.String()))

	apr := fincalc.AnnualPercentageRate(*financedAmount, monthlyInstalment, adminFee, cmd.FinancialProduct.DurationInDays)
	cmd.Logger.Debug(fmt.Sprintf("annual percentage rate: %f", apr))

	totalOriginationFees, _ := adminFee.Add(money.AsPtr(vatFee))
	cmd.Logger.Debug(fmt.Sprintf("total origination fees: %s", totalOriginationFees.String()))

	badDebtAllowance := fincalc.CalculateBadDebtAllowance(cmd.FinancialProduct.BadDebtFeeBasisPoints, *financedAmount)
	cmd.Logger.Debug(fmt.Sprintf("bad debt allowance: %s", badDebtAllowance.String()))

	payload := pbevent.LoanAccountCreatedEventPayload{
		State:                                   pbevent.LoanAccountState_CREATED,
		SubState:                                pbevent.LoanAccountSubState_NOT_AVAILABLE,
		BorrowerId:                              cmd.Borrower.BorrowerId,
		RepaymentDayOfMonth:                     uint32(cmd.Borrower.RepaymentDayOfMonth),
		CommercialOfferId:                       cmd.CommercialOfferId,
		FinancialProductId:                      cmd.FinancialProduct.FinancialProductId,
		FinancialProductTenorKey:                cmd.FinancialProductTenor.Key,
		TenorDays:                               cmd.FinancialProductTenor.DurationInDays,
		GracePeriodInDays:                       cmd.FinancialProduct.GracePeriodInDays,
		BookedAt:                                timestamppb.New(timex.NewUtcTime(cmd.BookingTimeUtc).ToStdLibTime()),
		MerchantId:                              cmd.MerchantId,
		MerchantCode:                            cmd.MerchantCode,
		LenderSource:                            strings.ToLower(string(cmd.LenderSource)),
		OriginationChannel:                      strings.ToLower(string(cmd.OriginationChannel)),
		AppliedCurrency:                         currency.Code,
		FlatRateBasisPoints:                     cmd.FinancialProductTenor.InterestRateBasisPoints,
		MonthlyEffectiveRate:                    monthlyEffectiveRate,
		TotalEffectiveRate:                      fincalc.TotalEffectiveRate(monthlyEffectiveRate, numberOfMonths),
		AnnualPercentageRate:                    apr,
		VatPercentageBasisPoints:                cmd.FinancialProduct.VatRateBasisPoints,
		AdminFeePercentageBasisPoints:           cmd.FinancialProductTenor.AdminFeeBasisPoints,
		EarlySettlementFeePercentageBasisPoints: cmd.FinancialProduct.EarlySettlementFeeBasisPoints,
		BadDebtFeePercentageBasisPoints:         cmd.FinancialProduct.BadDebtFeeBasisPoints,
		RoundingUpEstimatedGainUnits:            monthlyRoundingGainUnits * uint64(numberOfMonths),
		MonetaryLineItems: []*pbevent.LoanAccountMonetaryLineItem{
			{
				Money: &pbcommon.Money{
					Units:    originationAmount.Amount(),
					Currency: currency.Code,
				},
				Type:           pbevent.MonetaryLineItemType_ORIGINATION_AMOUNT,
				CollectionType: pbevent.MonetaryLineItemCollectionType_NONE,
			},
			{
				Money: &pbcommon.Money{
					Units:    downPayment.Amount(),
					Currency: currency.Code,
				},
				Type:           pbevent.MonetaryLineItemType_DOWN_PAYMENT,
				CollectionType: pbevent.MonetaryLineItemCollectionType_COLLECTED_BY_MERCHANT,
			},
			{
				Money: &pbcommon.Money{
					Units:    financedAmount.Amount(),
					Currency: currency.Code,
				},
				Type:           pbevent.MonetaryLineItemType_FINANCED_AMOUNT,
				CollectionType: pbevent.MonetaryLineItemCollectionType_NONE,
			},
			{
				Money: &pbcommon.Money{
					Units:    adminFee.Amount(),
					Currency: currency.Code,
				},
				Type:           pbevent.MonetaryLineItemType_ADMIN_FEE,
				CollectionType: pbevent.MonetaryLineItemCollectionType_COLLECTED_BY_MERCHANT,
			},
			{
				Money: &pbcommon.Money{
					Units:    vatFee.Amount(),
					Currency: currency.Code,
				},
				Type:           pbevent.MonetaryLineItemType_VAT,
				CollectionType: pbevent.MonetaryLineItemCollectionType_COLLECTED_BY_MERCHANT,
			},
		},
		MonthlyInstalment: &pbcommon.Money{
			Units:    monthlyInstalment.Amount(),
			Currency: monthlyInstalment.Currency().Code,
		},
	}

	// Check if cmd.LoanId is nil or empty, and generate a new UUID if it is
	// The generated UUID will be used as the aggregate ID
	aggregateId := func() string {
		if cmd.LoanId == nil || *cmd.LoanId == "" {
			return uid.MustNewUUID()
		}
		return *cmd.LoanId
	}()

	cmdMetadata := cmd.CommandMetadata()
	event := cqrs.NewEvent(
		pbcommon.EventType_LOAN_ACCOUNT_CREATED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		aggregateId,
		types.AggregateTypeLoanAccount,
		cqrs.Version(1),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)

	cmd.Logger.Debug(fmt.Sprintf("loan account created event with ID: %s", event.Id))

	return event, nil
}

func (la *LoanAccountAggregate) onCmdActivate(cmd *types.ActivateLoanAccountCmd) (*cqrs.Event, error) {
	if la.state != pbevent.LoanAccountState_CREATED {
		return nil, errors.New("loan account cannot be activated because it is not in the correct state")
	}
	activatedAtUtc := timex.NewUtcTime(cmd.CmdMetadata.CreatedAtUTC)
	if activatedAtUtc.Before(la.CreatedAtUTC.ToStdLibTime()) {
		return nil, errors.New("loan account cannot be activated in the past relative to its creation time")
	}

	ammortisationSchedule, err := fincalc.AmmortizationSchedule(
		la.MonetaryLineItems.FinancedAmount(),
		cmd.CommandMetadata().GetCommandBookedAt(),
		la.TenorDays,
		la.MonthlyInstalment,
		la.MonthlyEffectiveRate,
		int(la.BorrowerRepaymentDayOfMonth),
		config.LoanAmmoritisationBookingCutOffDay,
		la.GracePeriodInDays,
	)
	if err != nil {
		return nil, err
	}
	// confirm the sequence of schedule by sorting
	sort.Slice(ammortisationSchedule, func(i, j int) bool {
		return ammortisationSchedule[i].InstalmentDueDate.ToStdLibTime().
			Before(ammortisationSchedule[j].InstalmentDueDate.ToStdLibTime())
	})

	appliedCurrency := la.MonetaryLineItems.FinancedAmount().Currency().Code
	payload := pbevent.LoanAccountActivatedEventPayload{
		State:    pbevent.LoanAccountState_ACTIVE,
		SubState: pbevent.LoanAccountSubState_NOT_AVAILABLE,
		AmmortisationLineItems: Map(ammortisationSchedule, func(item fincalc.AmmortisationLineItem, i int) *pbevent.LoanAccountAmmortisationLineItem {
			return &pbevent.LoanAccountAmmortisationLineItem{
				ScheduleNumber:   uint32(i + 1),
				InstalmentDueAt:  timestamppb.New(item.InstalmentDueDate.ToStdLibTime()),
				GracePeriodEndAt: timestamppb.New(item.GracePeriodEndDate.ToStdLibTime()),
				LoanBalance: &pbcommon.Money{
					Units:    item.LoanBalance.Amount(),
					Currency: appliedCurrency,
				},
				PrincipalDue: &pbcommon.Money{
					Units:    item.PrincipalDue.Amount(),
					Currency: appliedCurrency,
				},
				InterestDue: &pbcommon.Money{
					Units:    item.InterestDue.Amount(),
					Currency: appliedCurrency,
				},
				CumulativeInterestDue: &pbcommon.Money{
					Units:    item.CumulativeInterest.Amount(),
					Currency: appliedCurrency,
				},
				AdminFeeDue: &pbcommon.Money{
					Units:    0,
					Currency: appliedCurrency,
				},
				PenaltyDue: &pbcommon.Money{
					Units:    0,
					Currency: appliedCurrency,
				},
				VatDue: &pbcommon.Money{
					Units:    0,
					Currency: appliedCurrency,
				},
				TotalInstalmentDue: &pbcommon.Money{
					Units:    item.TotalInstalmentDue.Amount(),
					Currency: appliedCurrency,
				},
				Cancelled:         false,
				Paid:              false,
				PaymentReferences: make([]string, 0),
			}
		}),
	}

	cmdMetadata := cmd.CommandMetadata()
	event := cqrs.NewEvent(
		pbcommon.EventType_LOAN_ACCOUNT_ACTIVATED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		la.Id,
		types.AggregateTypeLoanAccount,
		la.AggregateVersion.Increment(),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)

	return event, nil
}

func (la *LoanAccountAggregate) onCmdCancel(cmd *types.CancelLoanAccountCmd) (*cqrs.Event, error) {
	loanCancellable, reason := la.IsLoanCancellable(timex.NewUtcTime(cmd.CancelledAtUtc), cmd.ReturnPolicyDays)
	if !loanCancellable {
		return nil, errors.New(*reason)
	}

	cancellationReason := ""
	if cmd.Reason != nil {
		cancellationReason = *cmd.Reason
	}
	payload := pbevent.LoanAccountCanceledEventPayload{
		State:              pbevent.LoanAccountState_CLOSED,
		SubState:           pbevent.LoanAccountSubState_WITHDRAWN,
		CancellationReason: cancellationReason,
	}

	cmdMetadata := cmd.CommandMetadata()
	event := cqrs.NewEvent(
		pbcommon.EventType_LOAN_ACCOUNT_CANCELED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		la.Id,
		types.AggregateTypeLoanAccount,
		la.AggregateVersion.Increment(),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)

	return event, nil
}

// onCmdEarlySettle processes the early settlement command for a loan account.
// It validates the current state of the loan account and ensures it is eligible for early settlement.
// If eligible, it calculates the new payment date and creates an event payload for early settlement.
//
// Parameters:
// - cmd: A pointer to a types.EarlySettleLoanAccountCmd instance containing the command details.
//
// Returns:
// - A pointer to a cqrs.Event instance representing the early settlement event.
// - An error if the loan account is not in the correct state, the settlement date is invalid, or early settlement is not allowed.
func (la *LoanAccountAggregate) onCmdEarlySettle(cmd *types.EarlySettleLoanAccountCmd) (*cqrs.Event, error) {
	if la.state != pbevent.LoanAccountState_ACTIVE {
		return nil, errors.New("loan account cannot be early settled because it is not in the correct state")
	}
	bookedAtUtc := timex.NewUtcTime(cmd.CmdMetadata.CreatedAtUTC)
	if bookedAtUtc.Before(la.LastUpdatedAtUTC.ToStdLibTime()) {
		return nil, errors.New("loan account cannot be early settled in the past relative to its activation time")
	}

	earlySettlementAllowed, reason := la.earlySettlementAllowed()
	if !earlySettlementAllowed {
		return nil, errors.New(reason.Error())
	}

	// we assign the next payment date to be the next month with the same date as on consumer's
	// repayment day of the month
	// this is to ensure once the consumer has requested early settlement, they will get ample
	// time to make the payment
	assignedNewPaymentDate := time.Date(bookedAtUtc.Year(), bookedAtUtc.Month(), int(la.BorrowerRepaymentDayOfMonth), 23, 59, 59, 0, time.Local)
	assignedNewPaymentDate = assignedNewPaymentDate.AddDate(0, 1, 0)
	assignedNewPaymentDateUTC := timex.NewUtcTime(assignedNewPaymentDate)
	gracePeriodEndDateUTC := timex.NewUtcTime(assignedNewPaymentDate.AddDate(0, 0, int(la.GracePeriodInDays)))

	earlySettlementDetails := la.GetEarlySettlementDetails()

	payload := pbevent.LoanAccountEarlySettledEventPayload{
		SubState: pbevent.LoanAccountSubState_EARLY_SETTLEMENT_REQUESTED,
		CancelledScheduleNumbers: Map(Filter(la.AmmortisationLineItems, func(item LoanAccountAmmortisationLineItem, _ int) bool {
			return !item.IsPaid() && !item.Canceled
		}), func(item LoanAccountAmmortisationLineItem, _ int) uint32 {
			return item.ScheduleNumber
		}),
		AddedEarlySettlementAmmortisation: &pbevent.LoanAccountAmmortisationLineItem{
			ScheduleNumber:   uint32(len(la.AmmortisationLineItems) + 1),
			InstalmentDueAt:  timestamppb.New(assignedNewPaymentDateUTC.ToStdLibTime()),
			GracePeriodEndAt: timestamppb.New(gracePeriodEndDateUTC.ToStdLibTime()),
			LoanBalance: &pbcommon.Money{
				Units:    earlySettlementDetails.EarlySettlementPrincipalDue.Amount(),
				Currency: earlySettlementDetails.EarlySettlementPrincipalDue.Currency().Code,
			},
			PrincipalDue: &pbcommon.Money{
				Units:    earlySettlementDetails.EarlySettlementPrincipalDue.Amount(),
				Currency: earlySettlementDetails.EarlySettlementPrincipalDue.Currency().Code,
			},
			InterestDue: &pbcommon.Money{
				Units:    earlySettlementDetails.EarlySettlementFeesDue.Amount(),
				Currency: earlySettlementDetails.EarlySettlementFeesDue.Currency().Code,
			},
			AdminFeeDue: &pbcommon.Money{
				Units:    0,
				Currency: earlySettlementDetails.EarlySettlementPrincipalDue.Currency().Code,
			},
			PenaltyDue: &pbcommon.Money{
				Units:    0,
				Currency: earlySettlementDetails.EarlySettlementPrincipalDue.Currency().Code,
			},
			VatDue: &pbcommon.Money{
				Units:    0,
				Currency: earlySettlementDetails.EarlySettlementPrincipalDue.Currency().Code,
			},
			TotalInstalmentDue: &pbcommon.Money{
				Units:    earlySettlementDetails.EarlySettlementPrincipalDue.Amount() + earlySettlementDetails.EarlySettlementFeesDue.Amount(),
				Currency: earlySettlementDetails.EarlySettlementPrincipalDue.Currency().Code,
			},
			Cancelled: false,
			Paid:      false,
		},
	}

	cmdMetadata := cmd.CommandMetadata()
	event := cqrs.NewEvent(
		pbcommon.EventType_LOAN_ACCOUNT_EARLY_SETTLEMENT,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		la.Id,
		types.AggregateTypeLoanAccount,
		la.AggregateVersion.Increment(),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)

	return event, nil
}

func (la *LoanAccountAggregate) onCmdRecogniseRevenue(cmd *types.RecogniseRevenueCmd) (*cqrs.Event, error) {
	if !la.IsRevenueRecognitionAllowed() {
		return nil, errors.New("revenue recognition is not allowed for the loan account")
	}

	// find the amortisation line item that matches the schedule number and type
	// then set the interest revenue recognised flag to true
	for _, item := range la.AmmortisationLineItems {
		if item.ScheduleNumber == cmd.InstalmentScheduleNumber {
			if item.InterestRevenueRecognised {
				return nil, errors.New("interest revenue has already been recognised for this schedule")
			}
			if item.InterestDue.Amount() != cmd.RevenueUnits {
				return nil, errors.New("interest revenue amount in request does not match the interest due amount in ammortisation schedule")
			}
			if item.InterestDue.Currency().Code != cmd.AppliedCurrency {
				return nil, errors.New("interest revenue currency in request does not match the interest due currency in ammortisation schedule")
			}
			break
		}
	}

	payload := pbevent.LoanAccountRevenueRecognisedEventPayload{
		ScheduleNumber: 1,
		BookingTime:    timestamppb.New(cmd.CmdMetadata.CreatedAtUTC),
		Type:           pbevent.MonetaryLineItemType_INTEREST_ACCRUAL,
		Money: &pbcommon.Money{
			Units:    cmd.RevenueUnits,
			Currency: cmd.AppliedCurrency,
		},
	}

	cmdMetadata := cmd.CommandMetadata()
	event := cqrs.NewEvent(
		pbcommon.EventType_LOAN_ACCOUNT_INTEREST_REVENUE_RECOGNIZED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		la.Id,
		la.AggregateType,
		la.AggregateVersion.Increment(),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)

	return event, nil
}

func (la *LoanAccountAggregate) onCmdApplyPayment(cmd *types.ApplyLoanPaymentCmd) (*cqrs.Event, error) {
	paymentAmount := money.NewMoney(cmd.PaidUnits, cmd.AppliedCurrency)
	for _, item := range la.AmmortisationLineItems {
		if item.ScheduleNumber == cmd.InstalmentScheduleNumber {
			if item.IsPaid() {
				return nil, errors.New("instalment has already been paid")
			}
			// we expect either full payment or no payment at all
			// if the payment amount is less than the total instalment due amount, we reject the payment
			// if the payment amount is more than the total instalment due amount, we reject the payment
			// if the payment amount is equal to the total instalment due amount, we accept the payment
			totalDue := money.AsPtr(item.TotalDue())
			if !totalDue.MustEquals(paymentAmount) {
				return nil, errors.New("payment amount does not match the total due amount")
			}

			payload := pbevent.LoanAccountPaymentAppliedEventPayload{
				ScheduleNumber:   item.ScheduleNumber,
				PaymentReference: cmd.PaymentReferenceId,
				BookingTime:      timestamppb.New(timex.NewUtcTime(cmd.PaymentDate).ToStdLibTime()),
				PrincipalPaid: &pbcommon.Money{
					Units:    item.PrincipalDue.Amount(),
					Currency: item.PrincipalDue.Currency().Code,
				},
				InterestPaid: &pbcommon.Money{
					Units:    item.InterestDue.Amount(),
					Currency: item.InterestDue.Currency().Code,
				},
				AdminFeePaid: &pbcommon.Money{
					Units:    item.AdminFeeDue.Amount(),
					Currency: item.AdminFeeDue.Currency().Code,
				},
				PenaltyPaid: &pbcommon.Money{
					Units:    item.PenaltyDue.Amount(),
					Currency: item.PenaltyDue.Currency().Code,
				},
				VatPaid: &pbcommon.Money{
					Units:    item.VatDue.Amount(),
					Currency: item.VatDue.Currency().Code,
				},
			}
			event := cqrs.NewEvent(
				pbcommon.EventType_LOAN_ACCOUNT_PAYMENT_BOOKED,
				cmd.CommandMetadata().GetCommandBookedAt(),
				cmd.CommandMetadata().GetCommandBookedBy(),
				la.Id,
				la.AggregateType,
				la.AggregateVersion.Increment(),
				cmd.CommandMetadata().GetCallingSystemId(),
				cmd.CommandMetadata().GetTraceId(),
				&payload,
			)
			return event, nil
		}
	}
	return nil, errors.New("instalment schedule number not found")
}
