import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { TraceIdService } from '../common/services/trace-id.service';
import { LoggerFactory } from '../types/logger.interface';
import { CustomLoggerService } from '../common/services/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
  private readonly logger: CustomLoggerService;
  constructor(
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(TraceIdInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const traceId =
      request.headers['x-trace-id'] ||
      request.headers['x-request-id'] ||
      uuidv4();

    response.setHeader('x-trace-id', traceId);
    this.logger.log({
      message: `Incoming request: ${request.method} ${request.url}`,
      traceId,
    });
    //Store traceId in AsyncLocalStorage
    return this.traceIdService.setTraceId(traceId, () => {
      return next.handle().pipe(
        tap(() => {
          response.on('finish', () => {
            this.logger.log({
              message: `Response sent: ${response.statusCode}`,
              traceId,
            });
          });
        }),
      );
    });
  }
}
