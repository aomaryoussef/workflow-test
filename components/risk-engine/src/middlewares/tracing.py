from uuid import uuid4
from fastapi import Request
from contextvars import ContextVar
from starlette.middleware.base import BaseHTTPMiddleware

# Define a ContextVar for the request ID
trace_id_context: ContextVar[str] = ContextVar("trace_id", default=str(uuid4()))


class TrackIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add a unique tracking ID to each request if one is not provided.

    Methods:
        dispatch(request: Request, call_next: Callable): Adds a tracking ID to the request and context.
    """

    async def dispatch(self, request: Request, call_next):
        """
        Add a unique trace ID to the request and context.

        Args:
            request (Request): The incoming FastAPI request.
            call_next (Callable): The next middleware or request handler.

        Returns:
            Response: The HTTP response.
        """
        trace_id = request.query_params.get('trace_id') or str(uuid4())
        trace_id_context.set(trace_id)
        request.state.trace_id = trace_id
        response = await call_next(request)
        return response


def get_trace_id():
    """
    Retrieve the current request's trace ID.

    Returns:
        str: The trace ID.
    """
    return trace_id_context.get()
