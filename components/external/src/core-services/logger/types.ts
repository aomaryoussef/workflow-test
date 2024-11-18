import { CustomLoggerService } from './logger.service';

export type LoggerFactory = (serviceName: string) => CustomLoggerService;
