from src.middlewares.tracing import get_trace_id


class CustomException(Exception):
    """
    CustomException is a custom error class for handling application-specific errors.

    Args:
        status_code (int): HTTP status code associated with the error.
        error_code (str): Application internal error code.
        message (str): Human-readable message describing the error.
    """

    error_code = None
    status_code = None
    message = None

    def __init__(self, message: str = None, exception: Exception = None, error_code: str = None):
        """
        Initialize the CustomException instance.

        Args:
            message (str, optional): Error message. Defaults to None.
            exception (Exception, optional): Original exception. Defaults to None.
            error_code (str, optional): Custom error code. Defaults to None.
        """
        if message is not None:
            self.message = message
        if error_code is not None:
            self.error_code = error_code
        if exception is not None:
            self.exception = exception
        self.trace_id = get_trace_id()
        super().__init__(self.message)

    def __str__(self):
        """
        Return a string representation of the error.

        Returns:
            str: Formatted error string with status code, message, and error code.
        """
        return f"{self.message}"

    def __repr__(self):
        """
        Return a detailed string representation of the error.

        Returns:
            str: Detailed representation of the CustomException instance.
        """
        return f"{self.__class__.__name__}(status_code={self.status_code}, message='{self.message}', error_code={self.error_code}, trace_id={self.trace_id})"

    def to_dict(self):
        """
        Convert the error details to a dictionary.

        Returns:
            dict: Dictionary containing the status code, message, and error code.
        """
        return {"status_code": self.status_code, "message": self.message, "error_code": self.error_code,
                "trace_id": self.trace_id}


class CreationError(CustomException):
    """
    Exception raised for errors occurring during resource creation.

    Args:
        status_code (int): HTTP status code (500).
        message (str): Error message.
        error_code (str): Application-specific error code ("creation_error").
    """
    status_code = 500
    message = "An error occurred while creating the resource"
    error_code = "creation_error"


class NotFoundError(CustomException):
    """
    Exception raised when a requested resource is not found.

    Args:
        status_code (int): HTTP status code (404).
        message (str): Error message.
        error_code (str): Application-specific error code ("resource_not_found").
    """
    status_code = 404
    message = "Resource not found"
    error_code = "resource_not_found"


class MultipleResourcesFoundError(CustomException):
    """
    Exception raised when multiple resources are found where only one was expected.

    Args:
        status_code (int): HTTP status code (404).
        message (str): Error message.
        error_code (str): Application-specific error code ("multiple_resources_found").
    """
    status_code = 404
    message = "Multiple resources found while only looking for one"
    error_code = "multiple_resources_found"


class UpdateError(CustomException):
    """
    Exception raised for errors occurring during resource update.

    Args:
        status_code (int): HTTP status code (500).
        message (str): Error message.
        error_code (str): Application-specific error code ("update_error").
    """
    status_code = 500
    message = "An error occurred while updating the resource"
    error_code = "update_error"


class DeletionError(CustomException):
    """
    Exception raised for errors occurring during resource deletion.

    Args:
        status_code (int): HTTP status code (500).
        message (str): Error message.
        error_code (str): Application-specific error code ("deletion_error").
    """
    status_code = 500
    message = "An error occurred while deleting the resource"
    error_code = "deletion_error"


class PermissionError(CustomException):
    """
    Exception raised for permission-related errors.

    Args:
        status_code (int): HTTP status code (403).
        message (str): Error message.
        error_code (str): Application-specific error code ("permission_denied").
    """
    status_code = 403
    message = "Permission denied"
    error_code = "permission_denied"


class AuthenticationError(CustomException):
    """
    Exception raised for authentication-related errors.

    Args:
        status_code (int): HTTP status code (401).
        message (str): Error message.
        error_code (str): Application-specific error code ("authentication_required").
    """
    status_code = 401
    message = "Authentication required"
    error_code = "authentication_required"


class DuplicateError(CustomException):
    """
    Exception raised when a duplicate resource is found.

    Args:
        status_code (int): HTTP status code (409).
        message (str): Error message.
        error_code (str): Application-specific error code ("duplicate_error").
    """
    status_code = 409
    message = "Resource already exists"
    error_code = "duplicate_error"


class ServiceUnavailableError(CustomException):
    """
    Exception raised when a service is unavailable.

    Args:
        status_code (int): HTTP status code (503).
        message (str): Error message.
        error_code (str): Application-specific error code ("service_unavailable").
    """
    status_code = 503
    message = "Service unavailable"
    error_code = "service_unavailable"


class TimeoutError(CustomException):
    """
    Exception raised when an operation times out.

    Args:
        status_code (int): HTTP status code (504).
        message (str): Error message.
        error_code (str): Application-specific error code ("timeout_error").
    """
    status_code = 504
    message = "Operation timed out"
    error_code = "timeout_error"


class ConflictError(CustomException):
    """
    Exception raised when there is a conflict error.

    Args:
        status_code (int): HTTP status code (409).
        message (str): Error message.
        error_code (str): Application-specific error code ("conflict_error").
    """
    status_code = 409
    message = "Conflict error"
    error_code = "conflict_error"


class BadRequestError(CustomException):
    """
    Exception raised for bad request errors.

    Args:
        status_code (int): HTTP status code (400).
        message (str): Error message.
        error_code (str): Application-specific error code ("bad_request_error").
    """
    status_code = 400
    message = "Bad request"
    error_code = "bad_request_error"


class ModelExecutionError(CustomException):
    """
    Exception raised when a model fails.

    Args:
        status_code (int): HTTP status code (500).
        message (str): Error message.
        error_code (str): Application-specific error code ("model_execution_error").
    """
    status_code = 500
    message = "Error in executing model"
    error_code = "model_execution_error"


class GenericError(CustomException):
    """
    Generic error.

    Args:
        status_code (int): HTTP status code (500).
        message (str): Error message.
        error_code (str): Application-specific error code ("generic_error").
    """
    status_code = 500
    message = "Something wrong happened. Please try again later or contact support"
    error_code = "generic_error"


class DataAccessError(CustomException):
    """
    Generic Data Access error.

    Args:
        status_code (int): HTTP status code (400).
        message (str): Error message.
        error_code (str): Application-specific error code ("data_access_error").
    """
    status_code = 400
    message = "An error occurred while accessing the data. Please try again later or contact support"
    error_code = "data_access_error"


class FileAccessError(CustomException):
    """
    File Access error.

    Args:
        status_code (int): HTTP status code (500).
        message (str): Error message.
        error_code (str): Application-specific error code ("file_access_error").
    """
    status_code = 500
    message = "An error occurred while accessing a file resource. Please try again later or contact support"
    error_code = "file_access_error"
