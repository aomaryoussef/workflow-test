import {Inject, Injectable} from '@nestjs/common';
import {CustomLoggerService} from '../../../common/services/logger.service';
import {LoggerFactory} from '../../../types/logger.interface';
import {InvoicingTransaction} from "../models/invoicing-transaction.entity";
import {InvoicingTransactionRepository} from "../repository/invoicing-transaction.repository";
import {
    CreateInvoicingTransactionInputDTO,
    CreateInvoicingTransactionOutputDTO
} from "../dto/tasks/create-invoicing-transaction.dto";
import {PaymentConnectorType} from "../types/payment-connector.type";
import {
    AggregatedMerchantPaymentDto,
    AggregateMerchantInvoicesInputDTO,
    AggregateMerchantInvoicesOutputDTO
} from "../dto/tasks/aggregate-merchant-invoices.dto";
import {MerchantPaymentRepository} from "../repository/merchant-payment.repository";
import { MerchantPaymentNotFoundError } from '../../../common/errors/merchant-payment-not-found.error';
import { MerchantDisbursementCallbackInputDTO } from '../dto/tasks/disbursement-callback.dto';
import { MerchantPayment } from '../models/merchant-payment.entity';
import { MerchantPaymentStatusLog } from '../models/merchant-payment-status-log.entity';
import { MerchantPaymentStatusLogRepository } from '../repository/merchant-payment-status-log.repository';
import {PostMerchantInvoicesInputDTO} from "../dto/tasks/post-merchant-invoices.dto";
import {BaseConnector} from "../connectors/base.connector";
import {TraceIdService} from "../../../common/services/trace-id.service";
import {MerchantPaymentStatus} from "../types/merchant-payment-status";

/**
 * Use case class for managing merchant invoices.
 * This class provides methods to create and update invoicing transactions.
 * - The `createInvoicingRecord` method is intended for creating a new invoicing transaction record to be later aggregated to merchant invoice
 * - The `aggregateMerchantInvoices` method is intended for aggregating invoicing records per merchant within a specified date range.
 */
@Injectable()
export class MerchantInvoiceUseCase {
    private readonly logger: CustomLoggerService;
    private readonly connectors: Map<PaymentConnectorType, BaseConnector>;

    /**
     * Initializes the `MerchantInvoiceUseCase` with the necessary dependencies.
     *
     * @param invoicingTransactionRepository - The repository for invoicing transactions records.
     * @param merchantPaymentRepository - The repository for merchant payment records.
     * @param merchantPaymentStatusLogRepository - The repository for merchant payment status log records.
     * @param baseConnectors - The array of base connectors to be aggregated by type
     */
    constructor(private readonly invoicingTransactionRepository: InvoicingTransactionRepository,
                private readonly merchantPaymentRepository: MerchantPaymentRepository,
				private readonly merchantPaymentStatusLogRepository: MerchantPaymentStatusLogRepository,
                private readonly traceIdService: TraceIdService,
                @Inject('CONNECTORS') private readonly baseConnectors: BaseConnector[],
                @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,

    ) {
        this.logger = this.loggerFactory(MerchantInvoiceUseCase.name);
        this.connectors = new Map<PaymentConnectorType, BaseConnector>(
            baseConnectors.map(connector => [connector.getType(), connector] as [PaymentConnectorType, BaseConnector])
        );

    }

    /**
     * Creates an invoicing record to be used later for the merchant invoicing
     *
     *
     * @param createInvoicingTransactionInputDTO - Data transfer object containing transaction info
     * @returns A promise that resolves to the update `CreateInvoicingTransactionOutputDTO` with a reference id to the created record
     *
    * @example
    * ```typescript
    * const invoicingTransaction = await merchantInvoiceUseCase.createInvoicingRecord({
    *   reference_id: 'ref123',
    *   payment_account_id: 'acc456',
    *   payment_connector_type: PaymentConnectorType.MS_DYNAMICS,
    *   payable_units: 1000,
    *   payable_currency: 'EGP',
    *   narration_comment: 'Payment for services',
    *   transaction_date: new Date(),
    * });
     */
    async createInvoicingRecord(
        createInvoicingTransactionInputDTO: CreateInvoicingTransactionInputDTO,
    ): Promise<CreateInvoicingTransactionOutputDTO>{
        const invoicingTransaction =  new InvoicingTransaction({
            referenceId: createInvoicingTransactionInputDTO.reference_id,
            paymentAccountId: createInvoicingTransactionInputDTO.payment_account_id,
            paymentConnectorType: createInvoicingTransactionInputDTO.payment_connector_type ?? PaymentConnectorType.DEFAULT,
            payableUnits: createInvoicingTransactionInputDTO.payable_units,
            payableCurrency: createInvoicingTransactionInputDTO.payable_currency,
            narrationComment: createInvoicingTransactionInputDTO.narration_comment,
            transactionDate: createInvoicingTransactionInputDTO.transaction_date,
        });
        this.logger.debug(`Creating an invoicing transaction for ${invoicingTransaction.referenceId}`);
        const savedTransaction  = await this.invoicingTransactionRepository.save(invoicingTransaction);
        return new CreateInvoicingTransactionOutputDTO({id: savedTransaction.id});
    }


    /**
     * Aggregates invoicing records per merchant and saves them to the merchant_payment table
     *
     *
     * @param AggregateMerchantInvoicesInputDTO - Data transfer object containing date range for invoice aggregation
     * @returns A promise that resolves to the update `AggregateMerchantInvoicesOutputDTO`
     *
     * @example
     * ```typescript
        const aggregatedInvoices = await merchantInvoiceUseCase.aggregateMerchantInvoices({
          from_date: new Date('2023-01-01'),
          to_date: new Date('2023-01-31')
        });
     */
    async aggregateAndSaveMerchantInvoices(
        aggregateMerchantInvoicesInputDTO: AggregateMerchantInvoicesInputDTO,
    ): Promise<AggregateMerchantInvoicesOutputDTO>{
        this.logger.debug(`Aggregating merchants invoices for the period for ${JSON.stringify(aggregateMerchantInvoicesInputDTO)}`);
        const aggregatedInvoices = await this.invoicingTransactionRepository.aggregateMerchantPayments(
            aggregateMerchantInvoicesInputDTO
        );
        const mappedInvoices = aggregatedInvoices.map(record => new MerchantPayment({
                paymentAccountId: record.payment_account_id,
                paymentConnectorType: record.payment_connector_type,
                payableUnits: record.total_payment,
                payableCurrency: record.payable_currency,
                transactions: record.transaction_ids.map(transaction_id => new InvoicingTransaction({id: transaction_id})),
            }))
        const savedInvoices = await this.merchantPaymentRepository.saveAll(mappedInvoices);
        return new AggregateMerchantInvoicesOutputDTO({merchant_payments : savedInvoices.map(merchantPayment =>
                new AggregatedMerchantPaymentDto({
                    id: merchantPayment.id,
                    sequence_id: merchantPayment.sequenceId,
                    payment_account_id: merchantPayment.paymentAccountId,
                    payable_currency: merchantPayment.payableCurrency,
                    payment_connector_type: merchantPayment.paymentConnectorType,
                    total_payment: merchantPayment.payableUnits,
                    created_at: merchantPayment.createdAt,
                }))});
    }

    /**
     * Handles merchant payment disbursement call by inserting new status log record in MerchantPaymentStatusLog entity table
     *
     *
     * @param MerchantDisbursementCallbackInputDTO - Data transfer object containing merchant payment reference number
     * @returns void
     */
    async handlePaymentDisbursementCallback (disbursementCallbackInputDTO: MerchantDisbursementCallbackInputDTO): Promise<void> {
        this.logger.debug(`Handle payment disbursement for ${JSON.stringify(disbursementCallbackInputDTO)}`);
        const sequenceId = this.deserializeSequenceId(disbursementCallbackInputDTO.merchant_payment_id)
        const payment = await this.merchantPaymentRepository.findOneBy({ sequenceId })
        if (!payment) {
            this.logger.warn(`Merchant Payment is not found for ${JSON.stringify(disbursementCallbackInputDTO)}`);
            throw new MerchantPaymentNotFoundError("Merchant Payment is not found")
        }

        const merchantPaymentStatus = new MerchantPaymentStatusLog({
                paymentId: payment.id,
                status: disbursementCallbackInputDTO.status,
                statusDate: disbursementCallbackInputDTO.status_timestamp
        })
        await this.merchantPaymentStatusLogRepository.save(merchantPaymentStatus)
    }

    private deserializeSequenceId(code: string): number {
        // input format INV-0000000970
        const id = Number(code.split('-')[1])
        return id;
	}



    /**
     * Posts merchant invoices to the respective connectors.
     *
     * @param postMerchantInvoicesInputDTO - Data transfer object containing merchant payments and date range.
     * @returns A promise that resolves to an array of responses from all of the connectors.
     */
    async postMerchantInvoices(postMerchantInvoicesInputDTO: PostMerchantInvoicesInputDTO) :Promise<any[]>{
        this.logger.debug(`Posting merchant invoices for the period from ${postMerchantInvoicesInputDTO.from_date} to ${postMerchantInvoicesInputDTO.to_date}`);
        const promises = Object.keys(PaymentConnectorType)
            .filter((key) => {return key !== "DEFAULT"})
            .map((connectorType) => {
                    this.logger.debug(`Processing invoices for connector type ${connectorType}`);
                    const invoicesForConnector = postMerchantInvoicesInputDTO.merchant_payments
                        .filter(payment => {
                            return payment.payment_connector_type === connectorType && payment.total_payment != 0;
                        });
                    return this.connectors.get(PaymentConnectorType[connectorType]).postPayments(this.traceIdService.getTraceId(),invoicesForConnector);
            });
        const now = new Date();
        const mappedPaymentStatus = postMerchantInvoicesInputDTO.merchant_payments
            .map(invoice => new MerchantPaymentStatusLog({
                paymentId: invoice.id,
                status: MerchantPaymentStatus.POSTED,
                statusDate: now
            }));
        await this.merchantPaymentStatusLogRepository.saveAll(mappedPaymentStatus);
        return await Promise.all(promises);
    }

}