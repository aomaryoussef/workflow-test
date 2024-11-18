package logging

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/contextx"
	slogmulti "github.com/samber/slog-multi"
	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/otel/trace"
	"log/slog"
	"os"
	"strings"
	"sync"
)

var (
	log  *slog.Logger
	once sync.Once
)

// InitLoggerOpts initializes the logging system with the provided configuration.
// It sets up the logger based on the configuration parameters such as log level,
// output destination, and optional features like multi-fan-out logging for development environments.
// This function should be called at the start of the application to ensure all logging
// is consistent and configured according to the application's needs.
//
// Parameters:
// - config: A config.Config struct containing the application and logging configuration.
//
// Usage:
//
//	config := loadConfig() // Assume loadConfig returns a filled config.Config struct
//	logging.InitLoggerOpts(config)
func InitLoggerOpts(config config.Config) {
	initLog(config)
}

// WithContext creates and returns a new logger instance with context-specific fields.
// This function checks if the global logger instance is nil and initializes it with a default JSON handler if necessary.
// It then proceeds to create a new logger based on the global logger's handler.
// If the provided context is nil, it returns the new logger without any additional fields.
// Otherwise, it extracts predefined system context keys and their values from the context and adds them as fields to the logger.
// Additionally, if the context contains a valid OpenTelemetry SpanContext, it extracts and adds trace-related fields.
//
// Parameters:
// - ctx: The context from which to extract values and trace information. Can be nil.
//
// Returns:
// - A pointer to a new slog.Logger instance enriched with context-specific fields.
func WithContext(ctx context.Context) *slog.Logger {
	if log == nil {
		stdout := os.Stdout
		log = slog.New(slog.NewJSONHandler(stdout, &slog.HandlerOptions{
			AddSource: true,
			Level:     slog.LevelInfo,
		}))
	}

	if ctx == nil {
		return slog.New(log.Handler())
	}

	l := slog.New(log.Handler())

	// Extract values from the context and add them as fields.
	for _, key := range contextx.SystemContextKeys {
		val := ctx.Value(key)
		if val == nil {
			continue
		}
		l = l.With(slog.Any(key.String(), ctx.Value(key)))
	}

	// Get the SpanContext from the golang Context.
	if s := trace.SpanContextFromContext(ctx); s.IsValid() {
		// Add trace context attributes
		l = l.
			With(slog.Any("trace_id", s.TraceID())).
			With(slog.Any("span_id", s.SpanID())).
			With(slog.Bool("trace_sampled", s.TraceFlags().IsSampled())).
			With(slog.String("trace_state", s.TraceState().String())).
			With(slog.String("trace_flags", s.TraceFlags().String()))
	}

	return l
}

// initLog initializes the default log handler.
// Useful if the application does not explicitly initialize the log handler.
func initLog(c config.Config) {
	once.Do(func() {
		var combinedHandler slog.Handler

		otelslog.NewLogger("loans")

		var defaultHandler = stdoutHandler(c)
		var secondaryFanoutHandler slog.Handler = nil

		// fanout is enabled only when the env is development and multi_fan_out is enabled
		// double check
		fanoutEnabled := c.LogConfig.MultiFanOut && c.AppConfig.Env == "local"
		if fanoutEnabled {
			fmt.Println("-> development env, multi fan out option with loki is selected, use this with extra care and do not enable it in anywhere outside the developer laptop")
			fmt.Printf("ensure this process can reach loki at: %s/%s", lokiBaseURL, lokiPushPath)
		}

		if fanoutEnabled {
			secondaryFanoutHandler = lokiHandler(c)
			combinedHandler = slogmulti.Fanout(defaultHandler, secondaryFanoutHandler)
		} else {
			combinedHandler = defaultHandler
		}

		log = slog.New(combinedHandler).
			With(slog.String("app", c.AppConfig.Name)).
			With(slog.String("env", c.AppConfig.Env))

	})
}

// parseSlogLevel parses the string representation of the log level
func parseSlogLevel(levelStr string) slog.Level {
	switch strings.ToLower(levelStr) {
	case "debug":
		return slog.LevelDebug
	case "info":
		return slog.LevelInfo
	case "warn":
		return slog.LevelWarn
	case "error":
		return slog.LevelError
	}
	return slog.LevelInfo
}
