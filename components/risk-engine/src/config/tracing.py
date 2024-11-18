from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from src.config.postgresql import engine as sqlalchemy_engine
from config.settings import settings

APP_NAME = settings.get("app", default={}).get("name", default="risk-engine")
MAJOR_VERSION = settings.get("app", default={}).get("version_major", default="0")
MINOR_VERSION = settings.get("app", default={}).get("version_minor", default="0")
PATCH_VERSION = settings.get("app", default={}).get("version_patch", default="0")
ENVIRONMENT = settings.get("app", default={}).get("environment", default="development")


# TODO: max retries, timeout, etc
def setup_tracing(app):
    resource = Resource(attributes={
        "service.name": APP_NAME,
        # "service.namespace": "example-namespace",
        # "service.instance.id": "instance-1",
        "deployment.environment": ENVIRONMENT,
        "service.version": f'{MAJOR_VERSION}.{MINOR_VERSION}.{PATCH_VERSION}'
    })
    tracer_provider = TracerProvider(resource=resource)
    trace.set_tracer_provider(tracer_provider)

    # Configure OTLP exporter for traces
    otlp_exporter = OTLPSpanExporter(endpoint="http://tempo:4317", insecure=True)
    span_processor = BatchSpanProcessor(otlp_exporter)
    tracer_provider.add_span_processor(span_processor)

    # Start Prometheus metrics server
    # metrics_exporter = PrometheusMetricsExporter()
    # start_http_server(port=8001)
    # app.add_middleware(metrics_exporter.middleware)

    # Instrument FastAPI
    FastAPIInstrumentor.instrument_app(app)

    # Instrument SQLAlchemy
    SQLAlchemyInstrumentor().instrument(engine=sqlalchemy_engine)

    # Instrument Requests
    RequestsInstrumentor().instrument()
