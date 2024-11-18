import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base class for all custom exceptions.
 * Extends the standard NestJS HttpException to include a `traceId` for
 * tracking the error across requests, as well as a custom `errorCode`.
 */
export class CustomException extends HttpException {
  traceId: string;

  /**
   * Initializes a custom exception with a message, HTTP status code, and error code.
   * Also generates a unique trace ID for logging or tracing purposes.
   *
   * @param message - The error message describing the issue.
   * @param status - The HTTP status code to be returned with the response.
   * @param errorCode - A custom error code specific to the application's business logic.
   */
  constructor(message: string, status: HttpStatus, errorCode: string) {
    super({ message, errorCode }, status);
  }
}

/**
 * Exception for resource creation errors.
 * Thrown when an error occurs during the creation of a resource.
 */
export class CreationError extends CustomException {
  constructor(
    message: string = 'An error occurred while creating the resource',
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'creation_error');
  }
}

/**
 * Exception for "resource not found" errors.
 * Thrown when a requested resource cannot be found.
 */
export class NotFoundError extends CustomException {
  constructor(message: string = 'Resource not found') {
    super(message, HttpStatus.NOT_FOUND, 'resource_not_found');
  }
}

/**
 * Exception for cases where multiple resources are found where only one was expected.
 */
export class MultipleResourcesFoundError extends CustomException {
  constructor(
    message: string = 'Multiple resources found while only looking for one',
  ) {
    super(message, HttpStatus.NOT_FOUND, 'multiple_resources_found');
  }
}

/**
 * Exception for update errors.
 * Thrown when an error occurs during the update of a resource.
 */
export class UpdateError extends CustomException {
  constructor(
    message: string = 'An error occurred while updating the resource',
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'update_error');
  }
}

/**
 * Exception for resource deletion errors.
 * Thrown when an error occurs during the deletion of a resource.
 */
export class DeletionError extends CustomException {
  constructor(
    message: string = 'An error occurred while deleting the resource',
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'deletion_error');
  }
}

/**
 * Exception for permission errors.
 * Thrown when the user does not have permission to perform an action.
 */
export class PermissionError extends CustomException {
  constructor(message: string = 'Permission denied') {
    super(message, HttpStatus.FORBIDDEN, 'permission_denied');
  }
}

/**
 * Exception for invalid API key errors.
 * Thrown when the request contains an invalid or missing API key.
 */
export class ApiKeyAuthenticationError extends CustomException {
  constructor() {
    super('Invalid API Key', HttpStatus.UNAUTHORIZED, 'invalid_api_key');
  }
}

/**
 * Exception for authentication errors.
 * Thrown when authentication is required but not provided.
 */
export class AuthenticationError extends CustomException {
  constructor(message: string = 'Authentication required') {
    super(message, HttpStatus.UNAUTHORIZED, 'authentication_required');
  }
}

/**
 * Exception for duplicate resource errors.
 * Thrown when a resource already exists and cannot be created again.
 */
export class DuplicateError extends CustomException {
  constructor(message: string = 'Resource already exists') {
    super(message, HttpStatus.CONFLICT, 'duplicate_error');
  }
}

/**
 * Exception for service unavailability.
 * Thrown when a service is temporarily unavailable.
 */
export class ServiceUnavailableError extends CustomException {
  constructor(message: string = 'Service unavailable') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, 'service_unavailable');
  }
}

/**
 * Exception for timeout errors.
 * Thrown when an operation takes too long to complete.
 */
export class TimeoutError extends CustomException {
  constructor(message: string = 'Operation timed out') {
    super(message, HttpStatus.GATEWAY_TIMEOUT, 'timeout_error');
  }
}

/**
 * Exception for conflict errors.
 * Thrown when there is a conflict with the current applicationState of the resource.
 */
export class ConflictError extends CustomException {
  constructor(message: string = 'Conflict error') {
    super(message, HttpStatus.CONFLICT, 'conflict_error');
  }
}

/**
 * Exception for bad request errors.
 * Thrown when a request is malformed or invalid.
 */
export class BadRequestError extends CustomException {
  constructor(message: string = 'Bad request') {
    super(message, HttpStatus.BAD_REQUEST, 'bad_request_error');
  }
}

/**
 * Generic exception for internal server errors.
 * Thrown when an unspecified error occurs in the application.
 */
export class GenericError extends CustomException {
  constructor(
    message: string = 'Something wrong happened. Please try again later or contact support',
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'generic_error');
  }
}

/**
 * Exception for file access errors.
 * Thrown when an error occurs while trying to access a file resource.
 */
export class FileAccessError extends CustomException {
  constructor(
    message: string = 'An error occurred while accessing a file resource. Please try again later or contact support',
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'file_access_error');
  }
}
