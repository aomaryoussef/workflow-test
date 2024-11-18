import {BaseConnector} from "./base.connector";
import {PaymentConnectorType} from "../types/payment-connector.type";
import {Inject, Injectable} from "@nestjs/common";
import {LoggerFactory} from "../../../types/logger.interface";
import {CustomLoggerService} from "../../../common/services/logger.service";
import {MSDynamicsService} from "../../../services/msdynamics/msdynamics.service";
import {AggregatedMerchantPaymentDto} from "../dto/tasks/aggregate-merchant-invoices.dto";
import {MSDynamicsInvoicesRequestDTO} from "../../../services/msdynamics/dto/msdynamics-invoices.dto";

@Injectable()
export class MSDynamicsConnector extends BaseConnector {
    private readonly logger: CustomLoggerService;

    /**
     * Initializes the `MSDynamicsConnector` with the necessary dependencies.
     *
     * @param msDynamicsService - The service for interacting with the MSDynamics
     */
    constructor(@Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
                private readonly msDynamicsService: MSDynamicsService) {
        super();
        this.logger = this.loggerFactory(MSDynamicsConnector.name);
    }

    public async postPayments(traceId:string, invoices:AggregatedMerchantPaymentDto[]): Promise<any> {
        this.logger.debug(`Posting payments to MSDynamics ${JSON.stringify(invoices)}}`);
        const msDynamicsInvoicesRequest = new MSDynamicsInvoicesRequestDTO({
            _request: {
                DataAreaId: 'OL',
                IntegrationPoint: 'Due',
                MerchantInvoices: invoices.map(invoice => {
                    return {
                        Account: this.generateDynamicsMerchantID(invoice.payment_account_id),
                        MerchantInvoiceLines: [
                            {
                                Amount: invoice.total_payment,
                                CurrencyCode: invoice.payable_currency,
                                Description: `Invoice of merchant ${this.generateDynamicsMerchantID(invoice.payment_account_id)}`,
                                InvoiceDate: new Date(invoice.created_at).toISOString(),
                                InvoiceId: this.generateInvoiceId(invoice.sequence_id),
                                OffsetAccount: this.getOffsetAccount(invoice.payment_account_id),
                                TransDate: this.generateTransactionDateString(new Date(invoice.created_at))
                            }
                        ]
                    }
                }),
                MyloRequestNumber: traceId
            }
        });
        return this.msDynamicsService.postInvoices(msDynamicsInvoicesRequest);
    }

    public getType() {
        return PaymentConnectorType.MS_DYNAMICS;
    }

    /**
     * Generates a Dynamics Merchant ID by prefixing the merchant ID with "MERCH-"
     * and padding with Zeros till the string is 16 characters long.
     * as Dynamics cannot store IDs that are more than 16 characters long
     *
     * @param paymentAccountId - The payment account ID.
     * @returns The generated Dynamics Merchant ID.
     */
    private generateDynamicsMerchantID(paymentAccountId: string): string {
        return `MERCH-${paymentAccountId.padStart(10, '0')}`;
    }

    private getOffsetAccount(paymentAccountId: string) : string{
        return `230202012|${this.generateDynamicsMerchantID(paymentAccountId)}|MISC`;
    }

    private generateInvoiceId(invoiceId: number) : string{
        return `INV-${invoiceId.toString().padStart(10, '0')}`;
    }

    private generateTransactionDateString(transactionDate: Date) : string {
        return `/Date(${transactionDate.getTime()})/`
    }
    public extractInvoiceId(invoiceId: string) : number{
        return parseInt(invoiceId.split('-')[1]);
    }
}