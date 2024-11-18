import { CustomLoggerService } from '../common/services/logger.service';

export type LoggerFactory = (serviceName: string) => CustomLoggerService;
