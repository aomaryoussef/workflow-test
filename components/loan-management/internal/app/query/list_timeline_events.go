package query

import (
	"context"
	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/internal/app/infra/event_store"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/otelx"
	. "github.com/samber/lo"
)

func (q *Queries) ListTimelineEvents(ctx context.Context, params api.GetTimelineParams) (*api.ListTimeline, error) {
	ctx, span := otelx.NewSpanFromContext(ctx, "queries#ListTimelineEvents")
	defer span.End()

	tx, err := q.driver.CreateTransaction(ctx)
	if err != nil {
		return nil, err
	}
	defer func(ctx context.Context, tx sql_driver.Tx) {
		if err != nil {
			_ = tx.Rollback(ctx)
		} else {
			_ = tx.Commit(ctx)
		}
	}(ctx, tx)

	cursor := ""
	if params.Cursor != nil {
		cursor = *params.Cursor
	}

	events, err := q.es.LoadEvents(ctx, event_store.NewEventStoreQuery(event_store.WithFromEventIdExclusive(cursor)), func() sql_driver.Tx {
		return tx
	})
	if err != nil {
		return nil, err
	}

	return &api.ListTimeline{
		Timeline: Map(events, func(e cqrs.Event, _ int) api.TimelineEvent {
			return api.TimelineEvent{
				Id:                  e.Id,
				EventType:           e.EventType.String(),
				EventTimeUtc:        e.CreatedAt.ToStdLibTime(),
				EventTimeLocal:      e.CreatedAt.InLocalTZ(),
				MappedAggregateId:   e.AggregateId,
				MappedAggregateType: e.AggregateType.String(),
				SourceSystemId:      e.SourceSystemId,
			}
		}),
	}, nil
}
