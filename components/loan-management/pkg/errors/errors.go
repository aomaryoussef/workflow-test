package errors

import (
	"errors"
)

var (
	ErrAggregateVersionMismatch = errors.New("aggregate version mismatch")
	ErrSqlDbRequired            = errors.New("sql_db is required")
	ErrEventStoreRequired       = errors.New("event_store is required")
	ErrRiverClientRequired      = errors.New("river_client is required")
	ErrNotFound                 = errors.New("not found")
	ErrPreConditionsError       = errors.New("preconditions error")
	ErrConflictError            = errors.New("conflict error")
)
