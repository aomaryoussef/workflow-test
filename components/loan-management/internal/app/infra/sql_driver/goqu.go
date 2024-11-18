package sql_driver

import (
	"github.com/doug-martin/goqu/v9"
)

var (
	GoquPgDialect = goqu.Dialect("postgres")
)
