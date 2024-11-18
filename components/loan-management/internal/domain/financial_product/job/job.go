package job

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/event_store"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/financial_product/aggregate"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/logging"
)

type FinancialProductJobHandler struct {
	db *sql_driver.SqlDriver
	es event_store.EventStore[sql_driver.Tx]
}

func NewFinancialProductJobHandler(
	db *sql_driver.SqlDriver,
	es event_store.EventStore[sql_driver.Tx],
) *FinancialProductJobHandler {
	return &FinancialProductJobHandler{db: db, es: es}
}

func loadFinancialProduct(ctx context.Context, es event_store.EventStore[sql_driver.Tx], tx sql_driver.Tx, financialProductId string, eventId string) (*aggregate.FinancialProductAggregate, error) {
	log := logging.WithContext(ctx)

	log.Debug(fmt.Sprintf("loading events for financial product aggregate with id: %s linked to event: %s", financialProductId, eventId))

	events, err := es.LoadEvents(
		ctx,
		event_store.NewEventStoreQuery(
			event_store.WithAggregateType(types.AggregateTypeFinancialProduct.String()),
			event_store.WithAggregateId(financialProductId),
			event_store.WithToEventIdInclusive(eventId),
		),
		func() sql_driver.Tx { return tx },
	)
	if err != nil {
		return nil, err
	}
	fp := aggregate.NewInitFinancialProductAggregate()
	fp.AppendEvents(events...)
	err = fp.Reduce()
	if err != nil {
		return nil, err
	}
	log.Debug(fmt.Sprintf("reduced financial product aggregate with id: %s and version: %d", financialProductId, fp.AggregateVersion.Primitive()))

	return fp, nil
}
