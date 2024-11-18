import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { MerchantPaymentStatusLog } from "../models/merchant-payment-status-log.entity";

@Injectable()
export class MerchantPaymentStatusLogRepository extends BaseRepository<MerchantPaymentStatusLog> {
    private readonly logger: CustomLoggerService;

    constructor(
        @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
        @InjectRepository(MerchantPaymentStatusLog)
        private readonly invoicingTransactionRepository: Repository<MerchantPaymentStatusLog>,
    ) {
        super(invoicingTransactionRepository);
        this.logger = this.loggerFactory(MerchantPaymentStatusLogRepository.name);
    }
}
