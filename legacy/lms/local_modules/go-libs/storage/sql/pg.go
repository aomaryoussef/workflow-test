package sql

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPgConnection(ctx context.Context, connStr string) (sqldb *Sql, err error) {
	pool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		return
	}
	sqldb = &Sql{
		pool: pool,
	}
	return
}
