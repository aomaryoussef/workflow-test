package events

import "context"

// EventProducer defines an interface for producing event.
type EventProducer interface {
	PublishEvent(ctx context.Context, event Event) error
}
