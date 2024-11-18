package command

import (
	"context"
	"errors"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	financialproductjob "github.com/btechlabs/lms/internal/domain/financial_product/job"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
)

func (c *Commands) UpdateFinancialProduct(ctx context.Context, cmd *types.UpdateFinancialProductCmd) (*types.CmdProcessorResult, error) {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, "commands#UpdateFinancialProduct")
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

	aggregate, err := c.loadFinancialProduct(ctx, cmd.Key, tx)
	if err != nil {
		return nil, err
	}

	err = c.validateVersion(ctx, aggregate, cmd.IfMatch)
	if err != nil {
		return nil, err
	}

	event, err := aggregate.ApplyCommand(cmd)
	if err != nil {
		return nil, err
	}

	err = c.saveEvent(ctx, *event, tx)
	if err != nil {
		return nil, err
	}

	err = c.publishEvent(ctx, func() river.JobArgs {
		return financialproductjob.WriteFinancialProduct{
			Header:             job.MessageHeaderFromContext(ctx),
			EventId:            event.Id,
			FinancialProductId: event.AggregateId,
			Version:            event.AggregateVersion.Primitive(),
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}

	return &types.CmdProcessorResult{
		AggregateType:    event.AggregateType,
		AggregateId:      event.AggregateId,
		AggregateVersion: event.AggregateVersion,
	}, nil
}
