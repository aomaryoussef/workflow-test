from src.config.logging import logger
from fastapi import Request
from fastapi.security import APIKeyHeader
from config.settings import settings
from src.exceptions.exceptions import AuthenticationError, GenericError

# Setting up logging
logger = logger.bind(service="middlewares", context="auth", action="auth")

ENVIRONMENT = settings.get("app", default={}).get("environment")
API_KEY = settings.get("app", default={}).get("api_key")

# Define the API key header
API_KEY_NAME = "api-key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


def authenticate_request(request: Request):
    """
    Authenticate the incoming request by checking the API key and authorization token.

    Args:
        request (Request): The incoming HTTP request.

    Raises:
        HTTPException: If the API key or token is missing or invalid.
    """

    # Skip authentication in development mode
    if ENVIRONMENT == "development":
        logger.debug("skipping authentication in development mode")
        return

    # API Key validation
    api_key = request.headers.get("api-key")

    if not api_key:
        logger.error("missing API key in request headers")
        raise AuthenticationError("Unauthorized: Missing API key in request headers")

    if API_KEY is None:
        logger.error(f"expected API key is not set in environment variable. Please add it to settings.toml file")
        raise GenericError(message="Server misconfiguration: API key is not set in settings",
                           error_code="settings_error")

    if api_key != API_KEY:
        logger.error(f"invalid API key provided", api_key=api_key)
        raise AuthenticationError("Unauthorized: Invalid API key")
