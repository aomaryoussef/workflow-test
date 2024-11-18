import {IsRFC3339} from "class-validator";


/**
 * Input DTO for the `aggregate_merchant_invoices_task` task.
 */
export class AggregateMerchantInvoicesInputDTO {
    @IsRFC3339()
    from_date: Date;
    @IsRFC3339()
    to_date: Date;

}

/**
 * Output DTO for the `aggregate_merchant_invoices_task` task.
 */
export class AggregateMerchantInvoicesOutputDTO {
    public constructor(init?:Partial<AggregateMerchantInvoicesOutputDTO>) {
        Object.assign(this, init);
    }
    merchant_payments : AggregatedMerchantPaymentDto[];
}
export class AggregatedMerchantPaymentDto{
    public constructor(init?:Partial<AggregatedMerchantPaymentDto>) {
        Object.assign(this, init);
    }
    id: string;
    sequence_id: number;
    payment_account_id: string;
    payable_currency: string;
    payment_connector_type: string;
    total_payment: number;
    created_at: Date;
}