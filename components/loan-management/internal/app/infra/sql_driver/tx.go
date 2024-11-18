package sql_driver

import (
	"context"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"log/slog"
)

const (
	tracerName = "sql_driver"
)

type Tx interface {
	Query(ctx context.Context, query string, args ...any) (pgx.Rows, error)
	QueryRow(ctx context.Context, query string, args ...any) pgx.Row
	Exec(ctx context.Context, query string, args ...any) (pgconn.CommandTag, error)
	Commit(ctx context.Context) error
	Rollback(ctx context.Context) error
}

func HandleRollbackQuietly(ctx context.Context, tx Tx, log *slog.Logger) {
	if err := tx.Rollback(ctx); err != nil && !errors.Is(err, pgx.ErrTxClosed) {
		log.Warn(fmt.Sprintf("failed to rollback transaction: %v", err))
	}
}

func HandleCommitQuietly(ctx context.Context, tx Tx, log *slog.Logger) {
	if err := tx.Commit(ctx); err != nil && !errors.Is(err, pgx.ErrTxClosed) {
		log.Warn(fmt.Sprintf("failed to commit transaction: %v", err))
	}
}

func HandleTxOutcome(ctx context.Context, tx Tx, log *slog.Logger, err error) {
	if err != nil {
		HandleRollbackQuietly(ctx, tx, log)
	} else {
		HandleCommitQuietly(ctx, tx, log)
	}
}

func HandleTxOutcomeWithRecover(ctx context.Context, tx Tx, log *slog.Logger, err error) {
	if r := recover(); r != nil {
		HandleRollbackQuietly(ctx, tx, log)
		panic(r)
	}
	HandleTxOutcome(ctx, tx, log, err)
}
