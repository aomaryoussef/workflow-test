package command

import (
	"context"
	"errors"
	"fmt"

	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	financialproduct "github.com/btechlabs/lms/internal/domain/financial_product/aggregate"
	financialproductjob "github.com/btechlabs/lms/internal/domain/financial_product/job"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/cqrs"
	appError "github.com/btechlabs/lms/pkg/errors"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
)

func (c *Commands) CreateFinancialProduct(ctx context.Context, cmd *types.CreateFinancialProductCmd) (*types.CmdProcessorResult, error) {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, "commands#UpsertFinancialProduct")
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

	events, err := c.loadEvents(ctx, cmd.Key, types.AggregateTypeFinancialProduct, tx)
	if err != nil {
		return nil, err
	}
	if len(events) != 0 {
		return nil, fmt.Errorf("%w: financial product already exists", appError.ErrConflictError)
	}

	aggregate := newFinancialProductAggregate()
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

func (c *Commands) loadFinancialProduct(ctx context.Context, key string, tx sql_driver.Tx) (*financialproduct.FinancialProductAggregate, error) {
	events, err := c.loadEvents(ctx, key, types.AggregateTypeFinancialProduct, tx)
	if err != nil {
		return nil, err
	}
	if len(events) == 0 {
		return nil, fmt.Errorf("%w: financial product does not exist", appError.ErrNotFound)
	}

	aggregate := newFinancialProductAggregate()
	aggregate.AppendEvents(events...)
	err = aggregate.Reduce()
	if err != nil {
		return nil, err
	}

	return aggregate.(*financialproduct.FinancialProductAggregate), nil
}
