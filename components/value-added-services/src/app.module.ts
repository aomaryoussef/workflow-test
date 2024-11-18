import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ConsumerModule } from './domain/consumer/consumer.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TraceIdInterceptor } from './interceptors/trace-id.interceptor';
import { CustomExceptionFilter } from './exceptions/custom-exception.filter';
import { CommonModule } from './common/common.module';
import { ConductorModule } from './services/conductor/conductor.module';
import { CreditLimitModule } from './domain/consumer/credit-limit.module';
import { settingFactory } from 'config/settings';
// import { createLoggerConfig } from './config/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [settingFactory],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig,
      // logging: true, // Enable query logging
    }), // DB connection
    CreditLimitModule,
    ConsumerModule,
    CommonModule,
    ConductorModule // Register the ConductorModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceIdInterceptor, // Register the interceptor globally
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter, // Register the filter globally
    },
  ],
})
export class AppModule {}
