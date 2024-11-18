import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import {MerchantInvoiceUseCase} from "./use-cases/merchant-invoice.use-case";
import {InvoicingTransaction} from "./models/invoicing-transaction.entity";
import {InvoicingTransactionRepository} from "./repository/invoicing-transaction.repository";
import {MerchantPaymentRepository} from "./repository/merchant-payment.repository";
import {MerchantPayment} from "./models/merchant-payment.entity";
import { MerchantPaymentStatusLog } from './models/merchant-payment-status-log.entity';
import { MerchantPaymentStatusLogRepository } from './repository/merchant-payment-status-log.repository';
import {HttpModule} from "@nestjs/axios";
import {MSDynamicsModule} from "../../services/msdynamics/msdynamics.module";
import {MSDynamicsConnector} from "./connectors/msdynamics.connector";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoicingTransaction,
      MerchantPayment,
      MerchantPaymentStatusLog
    ]),
    CommonModule,
    HttpModule,
    MSDynamicsModule
  ],
  controllers: [],
  providers: [
    MerchantInvoiceUseCase,
    InvoicingTransactionRepository,
    MerchantPaymentRepository,
    MerchantPaymentStatusLogRepository,
    MSDynamicsConnector,
    {
      provide: 'CONNECTORS',
      useFactory: (msDynamics) => [msDynamics],
      inject: [MSDynamicsConnector],
    },
  ],
  exports: [
    MerchantInvoiceUseCase
  ],
})
export class MerchantModule {}
