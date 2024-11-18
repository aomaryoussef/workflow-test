package command

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/btechlabs/lms/internal/app/infra/event_store"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	financialproduct "github.com/btechlabs/lms/internal/domain/financial_product/aggregate"
	loanaccount "github.com/btechlabs/lms/internal/domain/loan_account/aggregate"
	"github.com/btechlabs/lms/pkg/cqrs"
	appError "github.com/btechlabs/lms/pkg/errors"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/riverqueue/river"
)

type Commands struct {
	es          event_store.EventStore[sql_driver.Tx]
	driver      *sql_driver.SqlDriver
	riverClient *river.Client[sql_driver.Tx]
	// Feature Flag to be removed after migration
	allowLoanCancellationAfterInterestRecognition bool
}

func NewCommands(
	es event_store.EventStore[sql_driver.Tx],
	driver *sql_driver.SqlDriver,
	riverClient *river.Client[sql_driver.Tx],
	allowLoanCancellationAfterInterestRecognition bool,
) *Commands {
	if driver == nil {
		panic(appError.ErrSqlDbRequired)
	}
	if es == nil {
		panic(appError.ErrEventStoreRequired)
	}
	if riverClient == nil {
		panic(appError.ErrRiverClientRequired)
	}
	return &Commands{es: es, driver: driver, riverClient: riverClient, allowLoanCancellationAfterInterestRecognition: allowLoanCancellationAfterInterestRecognition}
}

func (c *Commands) loadEvents(ctx context.Context, id string, aggregateType cqrs.AggregateType, tx sql_driver.Tx) ([]cqrs.Event, error) {
	events, err := c.es.LoadEvents(
		ctx,
		event_store.NewEventStoreQuery(
			event_store.WithAggregateId(id),
			event_store.WithAggregateType(aggregateType.String()),
		),
		getTx(tx),
	)
	if err != nil {
		return nil, err
	}

	return events, nil
}

func (c *Commands) saveEvent(ctx context.Context, event cqrs.Event, tx sql_driver.Tx) error {
	log := logging.WithContext(ctx)

	events := []cqrs.Event{event}
	// save events to the store
	err := c.es.SaveEvents(ctx, events, getTx(tx))
	if err != nil {
		return err
	}

	log.Debug(fmt.Sprintf("saved event in db: %s", event.Id))
	return nil
}

func (c *Commands) publishEvent(ctx context.Context, f func() river.JobArgs, opts *river.InsertOpts, tx sql_driver.Tx) error {
	log := logging.WithContext(ctx)
	jobArgs := f()
	// enqueue events to the job queue
	result, err := c.riverClient.InsertTx(ctx, tx, jobArgs, opts)
	if err != nil {
		return err
	}
	log.Debug(
		fmt.Sprintf("enqueued job_type: %s", jobArgs.Kind()),
		slog.Int64("job_id", result.Job.ID),
		slog.String("job_status", string(result.Job.State)),
	)

	return nil
}

func (c *Commands) validateVersion(ctx context.Context, agg cqrs.Aggregate, expectedVersion int) error {
	log := logging.WithContext(ctx)

	if agg.GetAggregateVersion().Primitive() != uint64(expectedVersion) {
		log.Debug(
			"aggregate version mismatch",
			slog.Uint64("expected_version", uint64(expectedVersion)),
			slog.Uint64("actual_version", agg.GetAggregateVersion().Primitive()),
		)
		return appError.ErrAggregateVersionMismatch
	}

	return nil
}

func getTx(tx sql_driver.Tx) func() sql_driver.Tx {
	return func() sql_driver.Tx {
		return tx
	}
}

func newFinancialProductAggregate() cqrs.Aggregate {
	return financialproduct.NewInitFinancialProductAggregate()
}

func newLoanAccountAggregate() cqrs.Aggregate {
	return loanaccount.NewInitLoanAccountAggregate()
}
