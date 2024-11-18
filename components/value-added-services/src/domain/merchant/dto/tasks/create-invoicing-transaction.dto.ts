import {IsEnum, IsNumber, IsOptional, IsRFC3339, IsString} from "class-validator";
import {PaymentConnectorType} from "../../types/payment-connector.type";
import {Transform} from "class-transformer";


/**
 * Input DTO for the `create_invoicing_transaction_record_task` task.
 */
export class CreateInvoicingTransactionInputDTO {
    @IsString()
    reference_id: string;
    @Transform(({ value }) => value.toString())
    @IsString()
    payment_account_id: string;
    @IsString()
    @IsOptional()
    @IsEnum(PaymentConnectorType)
    payment_connector_type: PaymentConnectorType;
    @IsNumber()
    payable_units: number;
    @IsString()
    payable_currency: string;
    @IsString()
    narration_comment: string;
    @IsRFC3339()
    transaction_date: Date;
}

/**
 * Output DTO for the `create_invoicing_transaction_record_task` task.
 */
export class CreateInvoicingTransactionOutputDTO {
    public constructor(init?:Partial<CreateInvoicingTransactionOutputDTO>) {
        Object.assign(this, init);
    }
    id: string;
}