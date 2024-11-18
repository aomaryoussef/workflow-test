import { Module } from '@nestjs/common';
import { TraceIdService } from './services/trace-id.service';
import { AsyncLocalStorage } from 'async_hooks';
import { LoggerFactory } from '../types/logger.interface';
import { CustomLoggerService } from './services/logger.service';

@Module({
  providers: [
    TraceIdService,
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    {
      provide: 'CUSTOM_LOGGER',
      useFactory: (traceIdService: TraceIdService): LoggerFactory => {
        return (serviceName: string) =>
          new CustomLoggerService(serviceName, traceIdService);
      },
      inject: [TraceIdService],
    },
  ],
  exports: [TraceIdService, AsyncLocalStorage, 'CUSTOM_LOGGER'],
})
export class CommonModule {}
