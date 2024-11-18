package otelx

import (
	"context"
	"fmt"
	"github.com/riverqueue/river/rivertype"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
)

func NewSpanFromContext(ctx context.Context, name string) (context.Context, trace.Span) {
	tracer := otel.GetTracerProvider().Tracer(name)
	return tracer.Start(ctx, name)
}

func NewSpanFromJobContext(ctx context.Context, jobRow *rivertype.JobRow) (context.Context, trace.Span) {
	ctx, span := NewSpanFromContext(ctx, fmt.Sprintf("worker#%s", jobRow.Kind))
	span.SetAttributes(
		attribute.Int64("job_id", jobRow.ID),
		attribute.Int("job_attempt", jobRow.Attempt),
	)
	return ctx, span
}
