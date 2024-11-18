import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { TraceIdService } from './trace-id.service';
import { settings } from 'config/settings';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger: winston.Logger;
  constructor(
    serviceName: string,
    private traceIdService: TraceIdService,
  ) {
    const logLevel = settings.app.logLevel || 'debug';

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        this.appendAppContext(),
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.colorize({ all: true }),
        winston.format.errors({
          stack: ['development', 'test'].includes(settings.app.environment),
        }),
      ),
      transports: [new winston.transports.Console()],
      defaultMeta: { context: serviceName },
    });
  }

  // Custom format to add the context (app_name, version, environment)
  private appendAppContext() {
    const APP_NAME = settings.app.name;
    const MAJOR_VERSION = settings.app.majorRelease;
    const MINOR_VERSION = settings.app.minorRelease;
    const PATCH_VERSION = settings.app.patchRelease;
    const ENVIRONMENT = settings.app.environment;
    return winston.format(info => {
      info.app_name = APP_NAME;
      info.app_version = `${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}`;
      info.environment = ENVIRONMENT;
      return info;
    })();
  }

  private withTraceId(message: string | object): object {
    const traceId = this.traceIdService.getTraceId();
    const logMessage = typeof message === 'string' ? { message } : message;

    return traceId ? { ...logMessage, traceId } : logMessage;
  }

  log(message: string | object) {
    this.logger.info(this.withTraceId(message));
  }

  error(message: string | object) {
    this.logger.error(this.withTraceId(message));
  }

  warn(message: string | object) {
    this.logger.warn(this.withTraceId(message));
  }

  debug?(message: string | object) {
    this.logger.debug(this.withTraceId(message));
  }

  verbose?(message: string | object) {
    this.logger.verbose(this.withTraceId(message));
  }
}
