package logging

import (
	"context"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutlog"
	otellog "go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/trace"
	"log/slog"
)

func newLoggerProvider() (*otellog.LoggerProvider, error) {
	logExporter, err := stdoutlog.New()
	if err != nil {
		return nil, err
	}

	loggerProvider := otellog.NewLoggerProvider(
		otellog.WithProcessor(otellog.NewBatchProcessor(logExporter)),
	)
	return loggerProvider, nil
}

// spanContextLogHandler is an slog.Handler which adds attributes from the
// span context.
type spanContextLogHandler struct {
	slog.Handler
}

// handlerWithSpanContext adds attributes from the span context
// [START opentelemetry_instrumentation_spancontext_logger]
func handlerWithSpanContext(handler slog.Handler) *spanContextLogHandler {
	return &spanContextLogHandler{Handler: handler}
}

// Handle overrides slog.Handler's Handle method. This adds attributes from the
// span context to the slog.Record.
func (t *spanContextLogHandler) Handle(ctx context.Context, record slog.Record) error {
	// Get the SpanContext from the golang Context.
	if s := trace.SpanContextFromContext(ctx); s.IsValid() {
		// Add trace context attributes following Cloud Logging structured log format described
		// in https://cloud.google.com/logging/docs/structured-logging#special-payload-fields
		record.AddAttrs(
			slog.Any("logging.googleapis.com/trace", s.TraceID()),
		)
		record.AddAttrs(
			slog.Any("logging.googleapis.com/spanId", s.SpanID()),
		)
		record.AddAttrs(
			slog.Bool("logging.googleapis.com/trace_sampled", s.TraceFlags().IsSampled()),
		)
	}
	return t.Handler.Handle(ctx, record)
}
