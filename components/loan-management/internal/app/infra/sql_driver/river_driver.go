package sql_driver

import (
	"github.com/btechlabs/lms/pkg/reflectx"
	"github.com/riverqueue/river/riverdriver"
	"github.com/riverqueue/river/riverdriver/riverpgxv5"
)

type RiverDriver struct {
	*riverpgxv5.Driver
}

func NewDriver(db *SqlDriver) *RiverDriver {
	_driver := riverpgxv5.New(db._pgxPool)
	return &RiverDriver{Driver: _driver}
}

func (d *RiverDriver) UnwrapExecutor(tx Tx) riverdriver.ExecutorTx {
	if reflectx.IsOfType(tx, &PgTx{}) {
		pgTx := tx.(*PgTx)
		return d.Driver.UnwrapExecutor(pgTx.Unwrap())
	}
	if reflectx.IsOfType(tx, &PgLockedTx{}) {
		pgTx := tx.(*PgLockedTx)
		return d.Driver.UnwrapExecutor(pgTx.Unwrap())
	}

	return nil
}
