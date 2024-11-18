import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
// Set up the resource, which describes the entity producing telemetry.
const resource = new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'next-app',
});
// Create a span processor and attach the OTLP trace exporter.
const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces', // Ensure the URL matches your Docker network settings
});
const spanProcessor = new BatchSpanProcessor(traceExporter);
// Initialize the OTLP metric exporter
const metricExporter = new OTLPMetricExporter({
    url: 'http://localhost:4318/v1/metrics' // Ensure the URL matches your Docker network settings
});
// Configure the NodeSDK with tracing and metrics
const sdk = new NodeSDK({
    resource: resource,
    spanProcessor: spanProcessor,
    metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 10000, // Export metrics every minute
    }),
});
// Start the SDK
sdk.start()