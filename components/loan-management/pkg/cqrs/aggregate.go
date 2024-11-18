package cqrs

import (
	"github.com/btechlabs/lms/pkg/timex"
	"sort"
)

// AggregateType is the object name
type AggregateType string

func (a AggregateType) String() string {
	return string(a)
}

type Aggregate interface {
	// AppendEvents appends events to the aggregate
	AppendEvents(events ...Event)
	// ApplyCommand takes the intention to change and responds with
	// an array of events as a result.
	ApplyCommand(cmd Command) (*Event, error)
	// Reduce reduces the events to the latest state of the aggregate
	Reduce() error
	// GetAggregateType returns the type of the aggregate
	GetAggregateType() AggregateType
	GetAggregateId() string
	GetAggregateVersion() Version
}

// BaseAggregate is the basic implementation of Domain BaseAggregate (usually a write model).
// An aggregate is a cluster of domain objects that can be treated as a single unit.
// Each aggregate has a root and a boundary. The boundary defines what is inside the aggregate.
// The root is a single, specific entity contained in the aggregate.
// All business logic is encapsulated within the aggregate and the aggregate is responsible for
// maintaining the integrity of the data within the boundary.
type BaseAggregate struct {
	Id               string        // ID is the unique identitfier of this aggregate
	AggregateType    AggregateType // Type is the name of the aggregate.
	AggregateVersion Version       // AggregateVersion is the latest sequence version similar to E-Tag, helps in concurrency
	CreatedAtUTC     timex.UtcTime // CreatedAtUTC is the time this aggregate was created at in UTC format
	CreatedBy        string        // CreatedBy returns the user who created this aggregate
	LastUpdatedAtUTC timex.UtcTime // LastUpdatedAtUTC is the time this aggregate was last changed at in UTC format
	LastUpdatedBy    string        // LastUpdatedBy returns the user who last updated this aggregate
	events           []Event       // Events is the list of events that have been applied to this aggregate
}

// NewBaseAggregate creates a new aggregate with Id and type.
// The aggregate is created with an initial sequence of 1.
//
// The aggregate must then be reduced to the latest state
// by adding all persisted events and then calling Reduce().
func NewBaseAggregate(
	typ AggregateType,
) *BaseAggregate {
	return &BaseAggregate{
		AggregateType:    typ,
		AggregateVersion: Version(1),
	}
}

// AppendEvents adds all the events to the read model.
// The function doesn't compute the new state of the read model
func (b *BaseAggregate) AppendEvents(events ...Event) {
	b.events = append(b.events, events...)
	b.sortEventsAsc()
}

func (b *BaseAggregate) GetAggregateType() AggregateType {
	return b.AggregateType
}

func (b *BaseAggregate) GetAggregateId() string {
	return b.Id
}

func (b *BaseAggregate) GetAggregateVersion() Version {
	return b.AggregateVersion
}

// BaseAggregateApplyCommand takes the intention to change and responds with
// an array of events as a result.
//
// All aggregates must override the implementation of this method.
// The extending function should call this as the first step
func (b *BaseAggregate) BaseAggregateApplyCommand(cmd Command) {
	cmdMetadata := cmd.CommandMetadata()
	b.LastUpdatedAtUTC = cmdMetadata.GetCommandBookedAt()
	b.LastUpdatedBy = cmdMetadata.GetCommandBookedBy()
}

// BaseAggregateReduce is the basic implementation of reducer.
// It takes the events and reduces them to the latest state of
// the aggregate.
// If this function is extended the extending function should
// be the last step
func (b *BaseAggregate) BaseAggregateReduce() {
	if len(b.events) == 0 {
		return
	}

	if b.Id == "" {
		b.Id = b.events[0].AggregateId
	}
	if b.AggregateType == "" {
		b.AggregateType = b.events[0].AggregateType
	}

	b.CreatedAtUTC = b.events[0].CreatedAt
	b.CreatedBy = b.events[0].CreatedBy

	b.LastUpdatedAtUTC = b.events[len(b.events)-1].CreatedAt
	b.LastUpdatedBy = b.events[len(b.events)-1].CreatedBy

	b.AggregateVersion = b.events[len(b.events)-1].AggregateVersion
}

// sortEventsAsc sorts the events in ascending order of their versions
func (b *BaseAggregate) sortEventsAsc() {
	// sort events by sequence
	sort.Slice(b.events, func(i, j int) bool {
		return b.events[i].AggregateVersion.Primitive() < b.events[j].AggregateVersion.Primitive()
	})
}

// Events returns the list of events that have been applied to the aggregate.
func (b *BaseAggregate) Events() []Event {
	return b.events
}
