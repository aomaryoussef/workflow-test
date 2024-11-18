package logging

import (
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/grafana/loki-client-go/loki"
	slogloki "github.com/samber/slog-loki/v3"
	"log/slog"
	"os"
	"strings"
)

const (
	lokiBaseURL  = "http://localhost:3100"
	lokiPushPath = "loki/api/v1/push"
)

// lokiHandler configures and returns a new Loki log handler based on the provided configuration.
// It initializes a Loki client with default settings, tailored by the application's configuration,
// specifically targeting the Loki base URL and push path. If the Loki client or the configuration
// fails to initialize, it logs an error and returns nil, indicating the handler could not be created.
// Upon successful creation of the Loki client, it sets up a log handler with the specified log level
// and source addition settings from the configuration.
//
// Parameters:
// - c: A config.Config struct containing the application's logging configuration.
//
// Returns:
// - A slog.Handler configured to push logs to a Loki server, or nil if an error occurs during setup.
func lokiHandler(c config.Config) slog.Handler {
	lhConfig, err := loki.NewDefaultConfig(fmt.Sprintf("%s/%s", lokiBaseURL, lokiPushPath))
	if err != nil {
		fmt.Printf("cannot configure loki log handler: %v", err)
		return nil
	}
	client, err := loki.New(lhConfig)
	if err != nil {
		fmt.Printf("cannot configure loki log handler: %v", err)
		return nil
	}

	slogLevel := parseSlogLevel(c.LogConfig.Level)
	lh := slogloki.Option{
		Level:     slogLevel,
		Client:    client,
		AddSource: c.LogConfig.AddSource,
	}.NewLokiHandler()
	return lh
}

// stdoutHandler configures and returns a new standard output log handler based on the provided configuration.
// This function determines the log format (text, text_minimal, or JSON) from the application's configuration
// and creates a corresponding slog.Handler that writes to os.Stdout with the specified log level and
// source addition settings. It supports dynamic log formatting, allowing easy switching between different
// log formats without changing the logger setup code.
//
// Parameters:
//   - c: A config.Config struct containing the application's logging configuration, specifically the log level
//     and format (text, text_minimal, or JSON).
//
// Returns:
// - A slog.Handler that writes logs to os.Stdout in the specified format.
func stdoutHandler(c config.Config) slog.Handler {
	var defaultHandler slog.Handler

	slogLevel := parseSlogLevel(c.LogConfig.Level)
	opts := &slog.HandlerOptions{
		AddSource: c.LogConfig.AddSource,
		Level:     slogLevel,
	}

	switch strings.ToLower(c.LogConfig.Format) {
	case "text":
		defaultHandler = slog.NewTextHandler(os.Stdout, opts)
	case "text_minimal":
		defaultHandler = NewMinimalLogHandler(opts)
	default:
		defaultHandler = slog.NewJSONHandler(os.Stdout, opts)
	}

	return defaultHandler
}
