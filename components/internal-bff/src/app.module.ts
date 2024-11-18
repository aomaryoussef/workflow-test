import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerModule } from './domain/consumer/consumer.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TraceIdInterceptor } from './interceptors/trace-id.interceptor';
import { CustomExceptionFilter } from './exceptions/custom-exception.filter';
import { CommonModule } from './common/common.module';
import { settingsFactory } from 'config/settings';
import { PartnerModule } from './domain/partner/partner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [settingsFactory],
      isGlobal: true,
    }),
    ConsumerModule,
    PartnerModule,
    CommonModule,
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
