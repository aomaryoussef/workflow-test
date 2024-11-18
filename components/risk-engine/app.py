import uvicorn
from fastapi.exceptions import RequestValidationError
from config.settings import settings
from src.config.logging import uvicorn_log_config
from src.exceptions.exceptions import CustomException
from starlette.exceptions import HTTPException as StarletteHTTPException
from src.middlewares.database import db_session_middleware
from src.middlewares.exceptions import (
    custom_exception_handler,
    generic_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    value_error_handler,
    type_error_handler
)
from src.middlewares.tracing import TrackIDMiddleware
from src.api.routes import app


def setup_middlewares(app):
    app.middleware("http")(db_session_middleware)
    app.add_middleware(TrackIDMiddleware)


def setup_exception_handlers(app):
    app.add_exception_handler(CustomException, custom_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(ValueError, value_error_handler)
    app.add_exception_handler(TypeError, type_error_handler)
    app.add_exception_handler(Exception, generic_exception_handler)


def setup_logging(app):
    if settings.get("app", default={}).get("enable_logging", default=False):
        from fastapi_cli.logging import setup_logging
        setup_logging()


def setup_tracing(app):
    if settings.get("app", default={}).get("enable_tracing", default=False):
        from src.config.tracing import setup_tracing
        setup_tracing(app)


def setup_metrics(app):
    if settings.get("app", default={}).get("enable_metrics", default=False):
        from src.config.metrics import setup_metrics
        setup_metrics(app)


# def setup_database():
#     from src.config.postgresql import init_engine_and_session
#     init_engine_and_session()

# Initialize components

def app_init(app):
    setup_middlewares(app)
    setup_exception_handlers(app)
    setup_tracing(app)
    setup_metrics(app)
    setup_logging(app)


if __name__ == "__main__":
    app_init(app)
    uvicorn.run("app:app", host="0.0.0.0", port=int(settings.get("app", default={}).get("port", default=5001)),
                log_level=settings.get("log", default={}).get("level", default="INFO").lower(),
                log_config=uvicorn_log_config)
