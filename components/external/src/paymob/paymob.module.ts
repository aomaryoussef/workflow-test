import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PaymobController } from './paymob.controller';
import { PaymobService } from './paymob.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'src/core-services/logger/logger.module';
import { HasuraService } from 'src/core-services/hasura/hasura.service';
import { ConfigService } from '@nestjs/config';
import { ConsumerRepository } from './repository/consumer.repository';
import { CheckoutRepository } from './repository/checkout.repository';
import { GetPartnerId } from './middlewares/partner-id.middleware';
import { PartnerProvider } from './providers/partner.provider';
import { PartnerRepository } from './repository/partner.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymobSessionBasketRepository } from './repository/paymob-session-basket.repository';
import { PaymobSessionBasket } from './entities/paymob-session-basket.entity';
import { PaymobAuditRepository } from './repository/paymob-audit.repository';
import { AuditMiddleware } from './middlewares/audit.middleware';
import { PaymobAudit } from './entities/paymob-audit.entity';
import { RequestContext } from '~/utils/request-context';
import { RequestIdMiddleware } from '~/middlewares';
import { loadESLint } from 'eslint';
import { LoanRepository } from './repository/loan.repository';
import { WorkflowService } from '~/core-services/workflow/workflow.service';

@Module({
  imports: [
    HttpModule,
    LoggerModule,
    TypeOrmModule.forFeature([PaymobSessionBasket, PaymobAudit]),
  ],
  providers: [
    PaymobService,
    PartnerProvider,
    PaymobSessionBasketRepository,
    HasuraService,
    WorkflowService,
    ConfigService,
    PartnerRepository,
    ConsumerRepository,
    CheckoutRepository,
    PaymobAuditRepository,
    LoanRepository,
    RequestContext,
  ],
  controllers: [PaymobController],
})
export class PaymobModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetPartnerId)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(RequestIdMiddleware, AuditMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
