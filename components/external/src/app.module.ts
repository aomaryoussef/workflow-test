import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FawryModule } from './fawry/fawry.module';
import { FormanceModule } from './core-services/formance/formance.module';
import { RequestIdMiddleware } from './middlewares';
import { RequestContext } from './utils/request-context';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { HasuraModule } from './core-services/hasura/hasura.module';
import { PaymobModule } from './paymob/paymob.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './core-services/typeorm/typeorm.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    FawryModule,
    PaymobModule,
    FormanceModule,
    HasuraModule,
  ],
  controllers: [],
  providers: [RequestContext, RequestIdMiddleware],
  exports: [RequestContext],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply to all routes
  }
}
