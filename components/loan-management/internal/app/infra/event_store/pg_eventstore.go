package event_store

import (
	"errors"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/btechlabs/lms/pkg/timex"
	"github.com/doug-martin/goqu/v9"
	_ "github.com/doug-martin/goqu/v9/dialect/postgres"
	"github.com/doug-martin/goqu/v9/exp"
	"github.com/jackc/pgx/v5"
	"strings"
	"time"
)

import (
	"context"
)

var _ EventStore[sql_driver.Tx] = (*PgEventStore)(nil)

type PgEventStore struct {
	db *sql_driver.SqlDriver
}

func NewPgEventStore(db *sql_driver.SqlDriver) *PgEventStore {
	return &PgEventStore{db: db}
}

func (pes *PgEventStore) SaveEvents(ctx context.Context, events []cqrs.Event, getTx func() sql_driver.Tx) error {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, fmt.Sprintf("%s#SaveEvents", tracerName))
	defer span.End()

	tx := getTx()

	for _, event := range events {
		payloadBytes, marshalErr := cqrs.MarshalPayload(event.Payload)
		if marshalErr != nil {
			return marshalErr
		}

		// Build an insert query for the eventsourcing log table
		query := `
		INSERT INTO event_log (id, event_type, created_at, created_by, aggregate_id, aggregate_type, aggregate_version, source_system_id, source_trace_id, payload)
		VALUES (@id, @event_type, @created_at, @created_by, @aggregate_id, @aggregate_type, @aggregate_version, @source_system_id, @source_trace_id, @payload);
		`
		args := pgx.NamedArgs{
			"id":                event.Id,
			"event_type":        event.EventType.String(),
			"created_at":        event.CreatedAt.ToStdLibTime(),
			"created_by":        event.CreatedBy,
			"aggregate_id":      event.AggregateId,
			"aggregate_type":    event.AggregateType,
			"aggregate_version": event.AggregateVersion,
			"source_system_id":  event.SourceSystemId,
			"source_trace_id":   event.SourceTraceId,
			"payload":           payloadBytes,
		}

		// Execute the insert query
		if _, execErr := tx.Exec(ctx, query, args); execErr != nil {
			log.Warn(fmt.Sprintf("failed to insert eventsourcing: %v", execErr))
			return errors.Join(ErrFailedToSaveEvent, execErr)
		}
	}

	return nil
}

func (pes *PgEventStore) LoadEvents(ctx context.Context, q *EventStoreQuery, getTx func() sql_driver.Tx) ([]cqrs.Event, error) {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, fmt.Sprintf("%s#LoadEvents", tracerName))
	defer span.End()

	// Create a new transaction
	tx := getTx()

	// Build an select query for the eventsourcing log table
	query := sql_driver.GoquPgDialect.From("event_log").
		Select("id", "event_type", "created_at", "created_by", "aggregate_id", "aggregate_type", "aggregate_version", "source_system_id", "source_trace_id", "payload")

	whereFragments := make([]exp.Expression, 0)
	if q.aggregateType != "" {
		whereFragments = append(whereFragments, goqu.C("aggregate_type").Eq(q.aggregateType))
	}
	if q.aggregateId != "" {
		whereFragments = append(whereFragments, goqu.C("aggregate_id").Eq(q.aggregateId))
	}
	if q.fromEventIdInclusive != "" {
		whereFragments = append(whereFragments, goqu.C("id").Gte(q.fromEventIdInclusive))
	}
	if q.toEventIdInclusive != "" {
		whereFragments = append(whereFragments, goqu.C("id").Lte(q.toEventIdInclusive))
	}
	if q.fromEventIdExclusive != "" {
		whereFragments = append(whereFragments, goqu.C("id").Gt(q.fromEventIdExclusive))
	}
	if q.toEventIdExclusive != "" {
		whereFragments = append(whereFragments, goqu.C("id").Lt(q.toEventIdExclusive))
	}

	if len(whereFragments) > 0 {
		query = query.Where(goqu.And(whereFragments...))
	}

	sql, _, err := query.ToSQL()
	if err != nil {
		return nil, err
	}

	// Execute the query
	rows, err := tx.Query(ctx, sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Process the results
	events := make([]cqrs.Event, 0)
	for rows.Next() {
		var id, eventType, createdBy, aggregateId, aggregateType, sourceSystemId, sourceTraceId string
		var aggregateVersion uint64
		var createdAtUTC time.Time
		var payload []byte
		if scanErr := rows.Scan(
			&id,
			&eventType,
			&createdAtUTC,
			&createdBy,
			&aggregateId,
			&aggregateType,
			&aggregateVersion,
			&sourceSystemId,
			&sourceTraceId,
			&payload,
		); scanErr != nil {
			log.Warn(fmt.Sprintf("failed to scan eventsourcing: %v", scanErr))
			return nil, err
		}
		if event, eventCreateErr := cqrs.NewEventFromStorage(
			id,
			strings.ToUpper(eventType),
			timex.NewUtcTime(createdAtUTC),
			createdBy,
			aggregateId,
			aggregateType,
			aggregateVersion,
			sourceSystemId,
			sourceTraceId,
			payload,
		); eventCreateErr != nil {
			log.Warn(fmt.Sprintf("failed to create eventsourcing: %v", eventCreateErr))
			return nil, err
		} else {
			events = append(events, *event)
		}

	}

	return events, nil
}
