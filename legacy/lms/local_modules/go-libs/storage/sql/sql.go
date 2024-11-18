package sql

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

type Sql struct {
	pool *pgxpool.Pool
}
