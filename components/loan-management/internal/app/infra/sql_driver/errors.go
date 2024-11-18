package sql_driver

import "errors"

var (
	ErrVersionMismatchOptimisticLocking = errors.New("version mismatch on optimistic locking")
)
