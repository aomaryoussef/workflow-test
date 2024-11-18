package cqrs

import (
	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	"github.com/btechlabs/lms/pkg/timex"
	"github.com/btechlabs/lms/pkg/uid"
	"google.golang.org/protobuf/proto"
)

// Event is a stored activity that happened in the past
type Event struct {
	Id               string             `json:"id" db:"id"`
	EventType        pbcommon.EventType `json:"event_type" db:"event_type"`
	CreatedAt        timex.UtcTime      `json:"created_at" db:"created_at"`
	CreatedBy        string             `json:"created_by" db:"created_by"`
	AggregateId      string             `json:"aggregate_id" db:"aggregate_id"`
	AggregateType    AggregateType      `json:"aggregate_type" db:"aggregate_type"`
	AggregateVersion Version            `json:"aggregate_version" db:"aggregate_version"`
	SourceSystemId   string             `json:"source_system_id" db:"source_system_id"`
	SourceTraceId    string             `json:"source_trace_id" db:"source_trace_id"`
	Payload          proto.Message      `json:"payload" db:"payload"`
}

func NewEvent(
	eventType pbcommon.EventType,
	createdAtUTC timex.UtcTime,
	createdBy string,
	aggregateId string,
	aggregateType AggregateType,
	aggregateVersion Version,
	sourceSystemId string,
	sourceTraceId string,
	payload proto.Message,
) *Event {
	id := uid.NewULID()
	return &Event{
		Id:               id,
		EventType:        eventType,
		CreatedAt:        createdAtUTC,
		CreatedBy:        createdBy,
		AggregateId:      aggregateId,
		AggregateType:    aggregateType,
		AggregateVersion: aggregateVersion,
		SourceSystemId:   sourceSystemId,
		SourceTraceId:    sourceTraceId,
		Payload:          payload,
	}
}

func NewEventFromStorage(
	id string,
	eventType string,
	createdAtUTC timex.UtcTime,
	createdBy string,
	aggregateId string,
	aggregateType string,
	aggregateVersion uint64,
	sourceSystemId string,
	sourceTraceId string,
	b []byte,
) (*Event, error) {
	et := pbcommon.EventType(pbcommon.EventType_value[eventType])
	payload, err := unmarshalPayload(et, b)
	if err != nil {
		return nil, err
	}
	e := &Event{
		Id:               id,
		EventType:        et,
		CreatedAt:        createdAtUTC,
		CreatedBy:        createdBy,
		AggregateId:      aggregateId,
		AggregateType:    AggregateType(aggregateType),
		AggregateVersion: Version(aggregateVersion),
		SourceSystemId:   sourceSystemId,
		SourceTraceId:    sourceTraceId,
		Payload:          payload,
	}
	return e, nil
}
