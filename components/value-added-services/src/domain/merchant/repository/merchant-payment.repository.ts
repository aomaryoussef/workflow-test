import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';
import {MerchantPayment} from "../models/merchant-payment.entity";

@Injectable()
export class MerchantPaymentRepository extends BaseRepository<MerchantPayment> {
    private readonly logger: CustomLoggerService;

    constructor(
        @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
        @InjectRepository(MerchantPayment)
        private readonly merchantPaymentRepository: Repository<MerchantPayment>,
    ) {
        super(merchantPaymentRepository);
        this.logger = this.loggerFactory(MerchantPayment.name);
    }
}
