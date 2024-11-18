package sql_driver

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
	"strings"
)

var _ Tx = (*PgTx)(nil)

type PgTx struct {
	pgx.Tx
	debugLogSqlQuery bool
	tracingEnabled   bool
}

func NewPgTx(tx pgx.Tx, debugLogSqlQuery, tracingEnabled bool) *PgTx {
	return &PgTx{
		Tx:               tx,
		debugLogSqlQuery: debugLogSqlQuery,
		tracingEnabled:   tracingEnabled,
	}
}

func (tx *PgTx) Query(ctx context.Context, query string, args ...any) (rows pgx.Rows, err error) {
	logQuery(ctx, tx, query)
	ctx, span := newSpanForQuery(ctx, tx, "Query", query)
	defer func() {
		if span != nil {
			span.End()
		}
	}()
	return tx.Tx.Query(ctx, query, args...)
}

func (tx *PgTx) QueryRow(ctx context.Context, query string, args ...any) pgx.Row {
	logQuery(ctx, tx, query)
	ctx, span := newSpanForQuery(ctx, tx, "QueryRow", query)
	defer func() {
		if span != nil {
			span.End()
		}
	}()
	return tx.Tx.QueryRow(ctx, query, args...)
}

func (tx *PgTx) Exec(ctx context.Context, query string, args ...any) (pgconn.CommandTag, error) {
	logQuery(ctx, tx, query)
	ctx, span := newSpanForQuery(ctx, tx, "Exec", query)
	defer func() {
		if span != nil {
			span.End()
		}
	}()
	return tx.Tx.Exec(ctx, query, args...)
}

func (tx *PgTx) Commit(ctx context.Context) error {
	ctx, span := newSpanForQuery(ctx, tx, "Commit", "COMMIT")
	defer func() {
		if span != nil {
			span.End()
		}
	}()
	return tx.Tx.Commit(ctx)
}

func (tx *PgTx) Rollback(ctx context.Context) error {
	ctx, span := newSpanForQuery(ctx, tx, "Rollback", "ROLLBACK")
	defer func() {
		if span != nil {
			span.End()
		}
	}()
	return tx.Tx.Rollback(ctx)
}

func (tx *PgTx) Unwrap() pgx.Tx {
	return tx.Tx
}

func newSpanForQuery(ctx context.Context, tx *PgTx, methodName string, query string) (context.Context, trace.Span) {
	if tx.tracingEnabled {
		newCtx, span := otelx.NewSpanFromContext(ctx, fmt.Sprintf("%s#%s", tracerName, methodName))
		span.SetAttributes(attribute.String("sql.query", query))
		return newCtx, span
	}
	return ctx, nil
}

func logQuery(ctx context.Context, tx *PgTx, query string) {
	query = strings.Replace(query, "\"", "", -1)
	if tx.debugLogSqlQuery {
		log := logging.WithContext(ctx)
		log.Debug(fmt.Sprintf("sql query: %s", query))
	}
}
