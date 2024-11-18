import {IsRFC3339} from "class-validator";
import {AggregatedMerchantPaymentDto} from "./aggregate-merchant-invoices.dto";


/**
 * Input DTO for the `post_merchant_invoices_task` task.
 */
export class PostMerchantInvoicesInputDTO {
    @IsRFC3339()
    from_date: Date;
    @IsRFC3339()
    to_date: Date;
    merchant_payments : AggregatedMerchantPaymentDto[];
}

/**
 * Output DTO for the `post_merchant_invoices_task` task.
 */
export class PostMerchantInvoicesOutputDTO {
    public constructor(init?:Partial<PostMerchantInvoicesOutputDTO>) {
        Object.assign(this, init);
    }
    connectorsResponses: any;
}