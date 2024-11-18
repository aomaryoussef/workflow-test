import re
import logging
import sys
import structlog
import traceback
from config.settings import settings
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry import trace
from src.middlewares.tracing import get_trace_id

log_level = settings.get("log", default={}).get("level", default="INFO")

APP_NAME = settings.get("app", default={}).get("name", default="risk-engine")
MAJOR_VERSION = settings.get("app", default={}).get("version_major", default="0")
MINOR_VERSION = settings.get("app", default={}).get("version_minor", default="0")
PATCH_VERSION = settings.get("app", default={}).get("version_patch", default="0")
ENVIRONMENT = settings.get("app", default={}).get("environment", default="development")


# TODO: disable ASGI Exceptions as STDERR logs

def add_context(logger, method_name, event_dict):
    event_dict['app_name'] = APP_NAME
    event_dict['app_version'] = f'{MAJOR_VERSION}.{MINOR_VERSION}.{PATCH_VERSION}'
    event_dict['environment'] = ENVIRONMENT
    return event_dict


def add_trace_id(logger, method_name, event_dict):
    trace_id = get_trace_id()
    if trace_id is None:
        trace_id = trace.get_current_span().get_span_context().trace_id
    event_dict['trace_id'] = trace_id
    return event_dict


def add_error_info(logger, method_name, event_dict):
    if 'error' in event_dict:
        exc = event_dict['error']
        try:
            stack = ''.join(traceback.format_exception(type(exc), exc, exc.__traceback__))
        except Exception as err:
            stack = None
        event_dict['exception'] = {
            'name': type(exc).__name__,
            'message': str(exc),
            'stack': stack
        }
        del event_dict['error']  # remove the exception key to avoid redundancy
    return event_dict


# Custom processor to parse Uvicorn access logs
def parse_uvicorn_access_log(logger, method_name, event_dict):
    log_msg = event_dict.get("event", "")

    match = re.match(r'(?P<ip>[^\s]+):\d+ - "(?P<method>[A-Z]+) (?P<url>[^\s]+) [^\s]+" (?P<status>\d+)', log_msg)

    if match:
        log_data = match.groupdict()
        log_data['status'] = int(log_data['status'])  # Convert status to integer
        log_data['service'] = "uvicorn"
        log_data['context'] = "api"
        log_data['action'] = "api"
        event_dict.update(log_data)
        del event_dict["event"]  # remove the original message

    return event_dict


logging.basicConfig(
    format="",
    level=logging.getLevelName(log_level),
    handlers=[
        logging.StreamHandler(stream=sys.stdout),
    ],
)

structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        parse_uvicorn_access_log,  # Add custom processor
        add_error_info,
        add_context,
        add_trace_id,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.getLevelName(log_level)),
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=False,
)

logger = structlog.get_logger()


# Custom Uvicorn access log handler
class StructlogHandler(logging.Handler):
    def emit(self, record):
        log_entry = self.format(record)
        logger.msg(log_entry)


# Uvicorn log configuration
uvicorn_log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(message)s",
        },
    },
    "handlers": {
        "structlog_handler": {
            "()": StructlogHandler,
            "formatter": "default",
        },
    },
    "loggers": {
        "uvicorn.error": {"handlers": ["structlog_handler"], "level": "INFO", "propagate": True},
        "uvicorn.access": {"handlers": ["structlog_handler"], "level": "INFO", "propagate": False},
    },
}


# TODO: max retries, timeout, etc
def setup_tracing():
    # Instrument logging with OpenTelemetry
    LoggingInstrumentor().instrument(set_logging_format=True)
