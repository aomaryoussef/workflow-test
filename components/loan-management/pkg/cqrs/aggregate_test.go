package cqrs

import (
	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	"github.com/btechlabs/lms/pkg/timex"
	"testing"
)

func TestAggregate_AppendEvents(t *testing.T) {
	type testAggregate struct {
		*BaseAggregate
		someValue string
	}
	var testAggregateType AggregateType = "test-aggregate"
	agg := testAggregate{BaseAggregate: NewBaseAggregate(testAggregateType), someValue: "some-value"}
	agg.Id = "Id-001"
	now := timex.NewUtcTimeNow()
	nowPlusOne := timex.NewUtcTime(now.ToStdLibTime().Add(1))
	nowPlusTwo := timex.NewUtcTime(now.ToStdLibTime().Add(2))

	t.Run("when events are appended, they will always be sorted by their aggregate sequence", func(t *testing.T) {
		agg.AppendEvents(
			*NewEvent(pbcommon.EventType_NONE, nowPlusTwo, "user-001", "Id-001", testAggregateType, 3, "sys-1", "t-1", nil),
			*NewEvent(pbcommon.EventType_NONE, nowPlusOne, "user-001", "Id-001", testAggregateType, 2, "sys-1", "t-2", nil),
			*NewEvent(pbcommon.EventType_NONE, now, "user-001", "Id-001", testAggregateType, 1, "sys-1", "t-3", nil),
		)
		if agg.events[0].AggregateVersion != 1 {
			t.Errorf("expected first eventsourcing to have aggregate sequence 1, but got %d", agg.events[0].AggregateVersion)
		}
		if agg.events[1].AggregateVersion != 2 {
			t.Errorf("expected second eventsourcing to have aggregate sequence 2, but got %d", agg.events[1].AggregateVersion)
		}
		if agg.events[2].AggregateVersion != 3 {
			t.Errorf("expected third eventsourcing to have aggregate sequence 3, but got %d", agg.events[2].AggregateVersion)
		}
	})
}

type testAggregate struct {
	*BaseAggregate
	someValue string
}

func TestAggregate_AppendAndReduce(t *testing.T) {

	var testAggregateType AggregateType = "test-aggregate"
	agg := testAggregate{BaseAggregate: NewBaseAggregate(testAggregateType), someValue: "some-value"}
	agg.Id = "Id-001"
	now := timex.NewUtcTimeNow()
	nowPlusOne := timex.NewUtcTime(now.ToStdLibTime().Add(1))
	nowPlusTwo := timex.NewUtcTime(now.ToStdLibTime().Add(2))

	t.Run("when events are appended and reduced, the aggregate sequence is updated", func(t *testing.T) {
		agg.AppendEvents(
			*NewEvent(pbcommon.EventType_NONE, nowPlusTwo, "user-001", "Id-001", testAggregateType, 3, "sys-1", "t-1", nil),
			*NewEvent(pbcommon.EventType_NONE, nowPlusOne, "user-001", "Id-001", testAggregateType, 2, "sys-1", "t-2", nil),
			*NewEvent(pbcommon.EventType_NONE, now, "user-001", "Id-001", testAggregateType, 1, "sys-1", "t-3", nil),
		)
		agg.BaseAggregateReduce()
		if agg.AggregateVersion != 3 {
			t.Errorf("expected aggregate sequence to be 3, but got %d", agg.AggregateVersion)
		}
	})
}
