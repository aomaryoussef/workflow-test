package otelx

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/logging"
	"go.opentelemetry.io/otel"
	_ "go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/exporters/prometheus"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
	"go.opentelemetry.io/otel/trace/noop"
	"google.golang.org/grpc"
	"os"
)

func initTraceProvider(
	ctx context.Context,
	conf config.Config,
	conn *grpc.ClientConn,
	shutdownFuncs []func(ctx context.Context) error,
	handleErr func(inErr error),
	appStartMode string,
) {
	log := logging.WithContext(ctx)
	prop := propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	)
	otel.SetTextMapPropagator(prop)

	switch conf.TelemetryConfig.Enabled {
	case true:
		traceExporter, err := otlptracegrpc.New(ctx, otlptracegrpc.WithGRPCConn(conn))
		if err != nil {
			log.Error(fmt.Sprintf("failed to create otel trace exporter: %s", err.Error()))
			handleErr(err)
			return
		}
		shutdownFuncs = append(shutdownFuncs, traceExporter.Shutdown)
		otelResource, err := createResource(ctx, conf, appStartMode)
		if err != nil {
			log.Error(fmt.Sprintf("failed to create otel resource: %s", err.Error()))
			handleErr(err)
			return
		}
		tracerProvider := trace.NewTracerProvider(
			trace.WithBatcher(traceExporter),
			trace.WithResource(otelResource),
		)
		otel.SetTracerProvider(tracerProvider)
		log.Info("successfully created otel trace provider")
	case false:
		tracerProvider := noop.NewTracerProvider()
		otel.SetTracerProvider(tracerProvider)
		log.Info("successfully created noop trace provider")
	}
}

func initMetricsProvider(
	ctx context.Context,
	conf config.Config,
	shutdownFuncs []func(ctx context.Context) error,
	handleErr func(inErr error),
	appStartMode string,
) {
	log := logging.WithContext(ctx)
	var meterProvider *metric.MeterProvider

	if conf.TelemetryConfig.Enabled {
		otelResource, err := createResource(ctx, conf, appStartMode)
		if err != nil {
			log.Error(fmt.Sprintf("failed to create otel resource: %s", err.Error()))
			handleErr(err)
			return
		}

		metricExporter, err := prometheus.New()
		shutdownFuncs = append(shutdownFuncs, metricExporter.Shutdown)
		meterProvider = metric.NewMeterProvider(
			metric.WithReader(metricExporter),
			metric.WithResource(otelResource),
		)
		otel.SetMeterProvider(meterProvider)

		log.Info("successfully created otel metrics provider")
	} else {
		meterProvider = metric.NewMeterProvider()
		otel.SetMeterProvider(meterProvider)
		log.Info("successfully created noop metrics provider")
	}
}

func createResource(ctx context.Context, conf config.Config, appStartMode string) (*resource.Resource, error) {
	log := logging.WithContext(ctx)
	hostname, err := os.Hostname()
	if err != nil {
		log.Warn(fmt.Sprintf("failed to get hostname: %s, going with 'unknown'", err.Error()))
		hostname = "unknown"
	}
	r, err := resource.Merge(
		resource.Default(),
		resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.HostNameKey.String(hostname),
			semconv.ServiceNameKey.String(fmt.Sprintf("%s-%s", conf.AppConfig.Name, appStartMode)),
			semconv.ServiceVersionKey.String(conf.AppConfig.Version),
			semconv.DeploymentEnvironmentKey.String(conf.AppConfig.Env),
		),
	)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to merge resources: %s", err.Error()))
		return nil, err
	}

	return r, err
}
