import {PaymentConnectorType} from "../types/payment-connector.type";
import {AggregatedMerchantPaymentDto} from "../dto/tasks/aggregate-merchant-invoices.dto";

export abstract class BaseConnector{
    public abstract postPayments(traceId :string, invoices: AggregatedMerchantPaymentDto[]): Promise<any>;
    public abstract getType(): PaymentConnectorType;
}