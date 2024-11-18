package otelx

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/logging"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// Initialize a gRPC connection to be used by both the tracer and meter
// providers.
func initConn(c config.Config) (*grpc.ClientConn, error) {
	// It connects the OpenTelemetry Collector through local gRPC connection.
	// You may replace `localhost:4317` with your endpoint.
	conn, err := grpc.NewClient(c.TelemetryConfig.OTelGrpcEndpoint,
		// Note the use of insecure transport here. TLS is recommended in production.
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create gRPC connection to collector: %w", err)
	}

	return conn, err
}

// InitOpenTelemetryPipeline bootstraps the OpenTelemetry pipeline.
// If it does not return an error, make sure to call shutdown for proper cleanup.
func InitOpenTelemetryPipeline(ctx context.Context, conf config.Config, appStartModeType string) (shutdown func(context.Context) error, err error) {
	log := logging.WithContext(ctx)

	var shutdownFuncs []func(context.Context) error
	// shutdown calls cleanup functions registered via shutdownFuncs.
	// The errors from the calls are joined.
	// Each registered cleanup will be invoked once.
	shutdown = func(ctx context.Context) error {
		var err error
		for _, fn := range shutdownFuncs {
			err = errors.Join(err, fn(ctx))
		}
		shutdownFuncs = nil
		return err
	}
	// handleErr calls shutdown for cleanup and makes sure that all errors are returned.
	handleErr := func(inErr error) {
		err = errors.Join(inErr, shutdown(ctx))
	}

	var conn *grpc.ClientConn
	if conf.TelemetryConfig.Enabled {
		conn, err = initConn(conf)
		if err != nil {
			log.Warn(fmt.Sprintf("failed to create gRPC connection to collector with error: %s", err.Error()))
			return nil, err
		}

		log.Info("successfully created gRPC connection to collector")
	} else {
		log.Info("telemetry is disabled, skipping gRPC connection creation")
	}

	initTraceProvider(ctx, conf, conn, shutdownFuncs, handleErr, appStartModeType)
	initMetricsProvider(ctx, conf, shutdownFuncs, handleErr, appStartModeType)

	return
}
