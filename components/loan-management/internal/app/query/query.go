package query

import (
	"github.com/btechlabs/lms/internal/app/infra/event_store"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
)

type Queries struct {
	driver *sql_driver.SqlDriver
	es     event_store.EventStore[sql_driver.Tx]
}

func NewQueries(driver *sql_driver.SqlDriver, es event_store.EventStore[sql_driver.Tx]) *Queries {
	return &Queries{
		driver: driver,
		es:     es,
	}
}
