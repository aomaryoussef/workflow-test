package cqrs

import "time"

type WriteModel struct {
	Id               string    `db:"id"`
	Version          uint64    `db:"version"`
	UpdatedAt        time.Time `db:"updated_at"`
	UpdatedBy        string    `db:"updated_by"`
	UpdatedByEventID string    `db:"updated_by_event_id"`
}
