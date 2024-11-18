import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';
import {InvoicingTransaction} from "../models/invoicing-transaction.entity";
import {aggregateMerchantPaymentQuery} from "./queries.config";
import {AggregateMerchantInvoicesInputDTO} from "../dto/tasks/aggregate-merchant-invoices.dto";

@Injectable()
export class InvoicingTransactionRepository extends BaseRepository<InvoicingTransaction> {
    private readonly logger: CustomLoggerService;

    constructor(
        @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
        @InjectRepository(InvoicingTransaction)
        private readonly invoicingTransactionRepository: Repository<InvoicingTransaction>,
    ) {
        super(invoicingTransactionRepository);
        this.logger = this.loggerFactory(InvoicingTransactionRepository.name);
    }

    public async aggregateMerchantPayments(aggregateMerchantInvoicesInputDTO : AggregateMerchantInvoicesInputDTO): Promise<any[]> {
        console.log(aggregateMerchantPaymentQuery);
        return await this.invoicingTransactionRepository.query(
            aggregateMerchantPaymentQuery,[aggregateMerchantInvoicesInputDTO.from_date,aggregateMerchantInvoicesInputDTO.to_date]
        )
    }
}
