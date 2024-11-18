from src.schemas.error import ErrorResponse


def get_responses() -> dict:
    """
    Get the default responses for the API.
    Returns: dict: Dictionary containing the default responses for the API.
    """
    responses = {
        400: {"model": ErrorResponse, "description": "Bad Request"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        403: {"model": ErrorResponse, "description": "Forbidden"},
        422: {"model": ErrorResponse, "description": "Validation Error"},
        500: {"model": ErrorResponse, "description": "Generic Error"},
    }
    return responses
