import { Transform } from "class-transformer";
import {IsRFC3339, IsString} from "class-validator";


/**
 * Input DTO for the `merchant_disbursement_callback_task` task.
 */
export class MerchantDisbursementCallbackInputDTO {
    @Transform(({ value }) => value.toString())
    @IsString()
    merchant_payment_id: string;
    @IsString()
    status: string;
    @IsRFC3339()
    status_timestamp: Date;
}
