package command

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	gljob "github.com/btechlabs/lms/internal/domain/accounting/gl/job"
	sljob "github.com/btechlabs/lms/internal/domain/accounting/subledger/job"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
)

func (c *Commands) RecogniseInterestRevenue(ctx context.Context, cmd types.RecogniseRevenueCmd) (*types.CmdProcessorResult, error) {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, "commands#RecogniseInterestRevenue")
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
		return nil, fmt.Errorf("no events found for loan account with id %s", cmd.LoanId)
	}

	aggregate := newLoanAccountAggregate()
	aggregate.AppendEvents(events...)
	err = aggregate.Reduce()
	if err != nil {
		return nil, err
	}

	event, err := aggregate.ApplyCommand(&cmd)
	if err != nil {
		return nil, err
	}

	err = c.saveEvent(ctx, *event, tx)
	if err != nil {
		return nil, err
	}

	// this publishes the job to create sub-ledger entries
	err = c.publishEvent(ctx, func() river.JobArgs {
		return sljob.SlRevenueRecognition{
			Header:                   job.MessageHeaderFromContext(ctx),
			EventId:                  event.Id,
			LoanId:                   cmd.LoanId,
			LenderSource:             cmd.LenderSource,
			InstalmentScheduleNumber: cmd.InstalmentScheduleNumber,
			AppliedCurrency:          cmd.AppliedCurrency,
			RevenueUnits:             cmd.RevenueUnits,
			BookedAt:                 cmd.DueDate,
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err

	}

	// this publishes the job to create general-ledger entries
	err = c.publishEvent(ctx, func() river.JobArgs {
		return gljob.GlRevenueRecognition{
			Header:                   job.MessageHeaderFromContext(ctx),
			EventId:                  event.Id,
			LoanId:                   cmd.LoanId,
			LenderSource:             cmd.LenderSource,
			InstalmentScheduleNumber: cmd.InstalmentScheduleNumber,
			AppliedCurrency:          cmd.AppliedCurrency,
			RevenueUnits:             cmd.RevenueUnits,
			BookedAt:                 event.CreatedAt.ToStdLibTime(),
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
