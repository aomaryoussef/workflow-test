from fastapi import Request
from fastapi.responses import JSONResponse
from src.exceptions.exceptions import CustomException
from src.middlewares.tracing import get_trace_id
from src.schemas.error import ErrorResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError


async def custom_exception_handler(request: Request, exc: CustomException):
    """
    Custom exception handler for CustomException.

    Args:
        request (Request): The incoming FastAPI request.
        exc (CustomException): The custom exception instance.

    Returns:
        JSONResponse: The HTTP response with error details.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(message=exc.message, error_code=exc.error_code, trace_id=exc.trace_id).dict()
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """
    Generic exception handler for unhandled exceptions.

    Args:
        request (Request): The incoming FastAPI request.
        exc (Exception): The unhandled exception instance.

    Returns:
        JSONResponse: The HTTP response with error details.
    """
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            message="An unexpected error occurred. If this problem persists, contact the server administrator.",
            trace_id=get_trace_id(),
            error_code="internal_server_error"
        ).dict()
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Exception handler for HTTP exceptions.

    Args:
        request (Request): The incoming FastAPI request.
        exc (StarletteHTTPException): The HTTP exception instance.

    Returns:
        JSONResponse: The HTTP response with error details.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(message=str(exc.detail), error_code="http_error", trace_id=get_trace_id()).dict()
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom exception handler for validation errors.

    Args:
        request (Request): The incoming FastAPI request.
        exc (RequestValidationError): The validation error instance.

    Returns:
        JSONResponse: The HTTP response with validation error details.
    """
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(message=str(exc.errors()), error_code="validation_error", trace_id=get_trace_id()).dict()
    )


async def value_error_handler(request: Request, exc: ValueError):
    """
    Custom exception handler for ValueError.

    Args:
        request (Request): The incoming FastAPI request.
        exc (ValueError): The value error instance.

    Returns:
        JSONResponse: The HTTP response with error details.
    """
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(message=str(exc), error_code="value_error", trace_id=get_trace_id()).dict()
    )


async def type_error_handler(request: Request, exc: TypeError):
    """
    Custom exception handler for TypeError.

    Args:
        request (Request): The incoming FastAPI request.
        exc (TypeError): The type error instance.

    Returns:
        JSONResponse: The HTTP response with error details.
    """
    return JSONResponse(
        status_code=400,
        content=ErrorResponse(message=str(exc), error_code="type_error", trace_id=get_trace_id()).dict()
    )
