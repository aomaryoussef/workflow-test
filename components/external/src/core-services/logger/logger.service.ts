import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger: winston.Logger;
  constructor(
    serviceName: string,
    private configService: ConfigService,
  ) {
    const logLevel = this.configService.get<string>('app.logLevel') || 'debug';

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
      defaultMeta: { service: serviceName },
    });
  }

  log(message: string | object) {
    this.logger.info(message);
  }

  error(message: string | object) {
    this.logger.error(message);
  }

  warn(message: string | object) {
    this.logger.warn(message);
  }

  debug?(message: string | object) {
    this.logger.debug(message);
  }

  verbose?(message: string | object) {
    this.logger.verbose(message);
  }
}
