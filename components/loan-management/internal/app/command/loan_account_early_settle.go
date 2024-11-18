package command

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	loanaccountjob "github.com/btechlabs/lms/internal/domain/loan_account/job"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
)

func (c *Commands) EarlySettleLoanAccount(ctx context.Context, cmd *types.EarlySettleLoanAccountCmd) (*types.CmdProcessorResult, error) {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, "commands#EarlySettleLoanAccount")
	defer span.End()

	// validate the commands for bad requests
	if err := cmd.Validate(); err != nil {
		return nil, errors.Join(cqrs.ErrCommandValidationFailed, err)
	}

	tx, err := c.driver.CreateTransaction(ctx)
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

	err = c.validateVersion(ctx, aggregate, cmd.IfMatch)
	if err != nil {
		return nil, err
	}

	event, err := aggregate.ApplyCommand(cmd)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to apply command: %s", err.Error()))
		return nil, err
	}

	err = c.saveEvent(ctx, *event, tx)
	if err != nil {
		return nil, err
	}

	err = c.publishEvent(ctx, func() river.JobArgs {
		return loanaccountjob.EarlySettleLoanAccount{
			Header:   job.MessageHeaderFromContext(ctx),
			EventId:  event.Id,
			BookedAt: event.CreatedAt.ToStdLibTime(),
			LoanId:   event.AggregateId,
			Version:  event.AggregateVersion,
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
