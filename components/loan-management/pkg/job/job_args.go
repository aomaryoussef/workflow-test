package job

import (
	"context"
	"github.com/btechlabs/lms/pkg/contextx"
	"github.com/btechlabs/lms/pkg/timex"
	"github.com/riverqueue/river"
	"go.opentelemetry.io/otel/propagation"
	"time"
)

type WorkerHandlerFunc func(ctx context.Context, args JobArgsWithHeader) error

type JobArgsWithHeader interface {
	river.JobArgs
	MessageHeader() MessageHeader
}

type MessageHeader struct {
	TracingCarrier propagation.MapCarrier `json:"tracing_carrier"`
	CreatedBy      string                 `json:"created_by"`
	CreatedAt      time.Time              `json:"created_at"`
	SourceSystemId string                 `json:"source_system_id"`
}

func MessageHeaderFromContext(ctx context.Context) MessageHeader {
	mapCarrier := propagation.MapCarrier{}
	propagator := propagation.TraceContext{}
	propagator.Inject(ctx, mapCarrier)
	return MessageHeader{
		TracingCarrier: mapCarrier,
		CreatedBy:      ctx.Value(contextx.ContextKeyUserId).(string),
		CreatedAt:      timex.NewUtcTimeNow().ToStdLibTime(),
		SourceSystemId: ctx.Value(contextx.ContextKeyCallingSystemId).(string),
	}
}

func ContextFromMessageHeader(parent context.Context, header MessageHeader) context.Context {
	parent = context.WithValue(parent, contextx.ContextKeyUserId, header.CreatedBy)
	parent = context.WithValue(parent, contextx.ContextKeyCallingSystemId, header.SourceSystemId)
	propagator := propagation.TraceContext{}
	parent = propagator.Extract(parent, header.TracingCarrier)

	return parent
}
