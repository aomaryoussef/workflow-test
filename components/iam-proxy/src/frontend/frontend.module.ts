import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FrontendController } from './frontend.controller';
import { BrowserRegistrationService } from './browser.registration.service';
import { BrowserVerificationService } from './browser.verification.service';
import { BrowserLoginService } from './browser.login.service';
import { ConfigModule } from '@nestjs/config';
import { ProviderModule } from '../provider/provider.module';
import { TenantTypeMiddleware } from '../middleware/tenantType.middleware';
import { BrowserErrorService } from './browser.error.service';

@Module({
  imports: [ConfigModule, ProviderModule],
  controllers: [FrontendController],
  providers: [
    BrowserRegistrationService,
    BrowserVerificationService,
    BrowserLoginService,
    BrowserErrorService,
  ],
})
export class FrontendModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantTypeMiddleware)
      .forRoutes(
        { path: '/idp/registration', method: RequestMethod.GET },
        { path: '/idp/verification', method: RequestMethod.GET },
        { path: '/idp/login', method: RequestMethod.GET },
        { path: '/idp/error', method: RequestMethod.GET },
      );
  }
}
