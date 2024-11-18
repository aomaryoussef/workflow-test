package events

import (
	"context"
)

// EventConsumer defines an interface for consuming messages from a Redis Stream.
type EventConsumer interface {
	Consume(ctx context.Context)
}
