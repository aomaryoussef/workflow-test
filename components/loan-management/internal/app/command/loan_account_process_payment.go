package command

import (
	"context"
	"errors"
	pbEvent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	gljob "github.com/btechlabs/lms/internal/domain/accounting/gl/job"
	sljob "github.com/btechlabs/lms/internal/domain/accounting/subledger/job"
	loanaccount "github.com/btechlabs/lms/internal/domain/loan_account/aggregate"
	loanaccountjob "github.com/btechlabs/lms/internal/domain/loan_account/job"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
)

func (c *Commands) ProcessLoanPayment(ctx context.Context, cmd *types.ApplyLoanPaymentCmd) (*types.CmdProcessorResult, error) {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, "commands#ProcessLoanPayment")
	defer span.End()

	// validate the commands for bad requests
	if err := cmd.Validate(); err != nil {
		return nil, errors.Join(cqrs.ErrCommandValidationFailed, err)
	}

	tx, err := c.driver.CreateLockedTransaction(ctx, cmd.LoanId, "ProcessLoanPayment")
	if err != nil {
		return nil, err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	events, err := c.loadEvents(ctx, cmd.LoanId, types.AggregateTypeLoanAccount, tx)
	if err != nil {
		return nil, err
	}
	if len(events) == 0 {
		return nil, errors.New("loan account does not exist")
	}

	aggregate := newLoanAccountAggregate()
	aggregate.AppendEvents(events...)
	err = aggregate.Reduce()
	if err != nil {
		return nil, err
	}

	event, err := aggregate.ApplyCommand(cmd)
	if err != nil {
		return nil, err
	}

	paymentBookedEventPayload := event.Payload.(*pbEvent.LoanAccountPaymentAppliedEventPayload)

	err = c.saveEvent(ctx, *event, tx)
	if err != nil {
		return nil, err
	}

	loanAccountAggregate := aggregate.(*loanaccount.LoanAccountAggregate)
	err = c.publishEvent(ctx, func() river.JobArgs {
		return loanaccountjob.ProcessPaymentLoanAccount{
			Header:                   job.MessageHeaderFromContext(ctx),
			EventId:                  event.Id,
			BookedAt:                 event.CreatedAt.ToStdLibTime(),
			LoanId:                   event.AggregateId,
			Version:                  event.AggregateVersion,
			InstalmentScheduleNumber: paymentBookedEventPayload.ScheduleNumber,
			AppliedCurrency:          cmd.AppliedCurrency,
			PaidUnits:                cmd.PaidUnits,
			PaymentReferenceId:       paymentBookedEventPayload.PaymentReference,
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}

	// this publishes the job to create sub-ledger entries
	err = c.publishEvent(ctx, func() river.JobArgs {
		return sljob.SlLoanBookPayment{
			Header:               job.MessageHeaderFromContext(ctx),
			EventId:              event.Id,
			LoanAccountId:        event.AggregateId,
			LenderSource:         loanAccountAggregate.LenderSource,
			PayorId:              loanAccountAggregate.BorrowerId,
			BookedAt:             event.CreatedAt.ToStdLibTime(),
			AppliedCurrency:      paymentBookedEventPayload.PrincipalPaid.Currency,
			PaidUnits:            cmd.PaidUnits,
			PaidToPrincipalUnits: paymentBookedEventPayload.PrincipalPaid.Units,
			PaidToInterestUnits:  paymentBookedEventPayload.InterestPaid.Units,
			PaidToPenaltyUnits:   paymentBookedEventPayload.PenaltyPaid.Units,
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}

	// this publishes the job to create general-ledger entries
	err = c.publishEvent(ctx, func() river.JobArgs {
		return gljob.GlLoanBookPayment{
			Header:               job.MessageHeaderFromContext(ctx),
			EventId:              event.Id,
			LoanAccountId:        event.AggregateId,
			LenderSource:         loanAccountAggregate.LenderSource,
			PayorId:              loanAccountAggregate.BorrowerId,
			BookedAt:             event.CreatedAt.ToStdLibTime(),
			AppliedCurrency:      paymentBookedEventPayload.PrincipalPaid.Currency,
			PaidUnits:            cmd.PaidUnits,
			PaidToPrincipalUnits: paymentBookedEventPayload.PrincipalPaid.Units,
			PaidToInterestUnits:  paymentBookedEventPayload.InterestPaid.Units,
			PaidToPenaltyUnits:   paymentBookedEventPayload.PenaltyPaid.Units,
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}

	return &types.CmdProcessorResult{
		AggregateId:      event.AggregateId,
		AggregateVersion: event.AggregateVersion,
		AggregateType:    event.AggregateType,
	}, nil
}
