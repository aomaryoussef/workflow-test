""" Module for LoggerDefault class."""

import logging
import sys
import structlog
from config.settings import settings

log_level = settings.get("log", default={}).get("level", default="INFO")

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
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.getLevelName(log_level)),
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=False,
)
logger = structlog.get_logger()
