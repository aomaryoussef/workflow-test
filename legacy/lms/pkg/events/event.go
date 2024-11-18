package events

import (
	"encoding"
	"fmt"
	"time"
)

type Type string

// Event ...
type Event interface {
	GetID() string
	GetType() Type
	GetDateTime() time.Time
	SetID(id string)
	encoding.BinaryMarshaler
	encoding.BinaryUnmarshaler
}

type Base struct {
	ID        string    `json:"id"`
	Type      Type      `json:"type"`
	CreatedAt time.Time `json:"created_at"`
}

func (o *Base) GetID() string {
	return o.ID
}

func (o *Base) SetID(id string) {
	o.ID = id
}

func (o *Base) GetType() Type {
	return o.Type
}

func (o *Base) GetDateTime() time.Time {
	return o.CreatedAt
}

func (o *Base) String() string {

	return fmt.Sprintf("id:%s type:%s", o.ID, o.Type)
}
