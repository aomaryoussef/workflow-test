import { Module, Global } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerFactory } from './types';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CUSTOM_LOGGER',
      useFactory: (configService: ConfigService): LoggerFactory => {
        return (serviceName: string) =>
          new CustomLoggerService(serviceName, configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['CUSTOM_LOGGER'],
})
export class LoggerModule {}
