import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomLoggerService } from '../common/services/logger.service';
import { LoggerFactory } from '../types/logger.interface';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  /**
   * Catch and handle exceptions globally.
   *
   * This method intercepts all exceptions thrown in the application and formats
   * the response to include a standardized error structure: `message`, `errorCode`,
   * and `traceId`. It uses the details from `HttpException` or a generic fallback
   * in case the exception is not an instance of `HttpException`.
   *
   * @param exception - The exception that was thrown during the request lifecycle. It can be of type `HttpException` or any other unhandled exception.
   * @param host - The `ArgumentsHost` which provides access to the details of the current request/response context.
   *
   * @returns void - This method sends the response directly through the response object.
   *
   * - `status`: The HTTP status code of the error. It defaults to 500 if no status is found.
   * - `message`: The error message, either provided by the exception or defaulting to 'Internal Server Error'.
   * - `errorCode`: The custom error code that describes the nature of the error. If not provided, it defaults to 'internal_server_error'.
   * - `traceId`: A unique identifier for the request, extracted from the request headers or set to 'no-trace-id' as a fallback.
   */
  private readonly logger: CustomLoggerService;
  constructor(
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(CustomExceptionFilter.name);
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Extract the status code from the exception or default to 500
    const status = exception.getStatus ? exception.getStatus() : 500;

    // Extract the exception details or use default error message
    const exceptionResponse = exception.getResponse
      ? exception.getResponse()
      : { message: 'Internal Server Error' };

    // Ignore only the "Cannot GET /" requests

    // Determine the error message and error code
    const message = exceptionResponse['message'] || 'Internal Server Error';

    //ignore health check 404
    if (status === 404 && message === 'Cannot GET /') {
      return;
    }

    this.logger.error(exception);

    const errorCode =
      exceptionResponse['errorCode'] ||
      exceptionResponse['error'] ||
      'internal_server_error';

    // Extract the traceId from request headers or set a default value
    const traceId =
      exceptionResponse['traceId'] ||
      response.getHeader('x-trace-id') ||
      'no-trace-id';

    // Send a standardized JSON response with the error details
    response.status(status).json({
      message,
      errorCode,
      traceId,
    });
  }
}
