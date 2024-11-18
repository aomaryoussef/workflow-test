import { Type } from "class-transformer";
import { IsUUID, IsString, IsNumber, IsOptional, IsObject, ValidateNested, IsNotEmpty } from "class-validator";
import { SanctionType } from "../../types/sanction-list.types";

class RiskConsumerClDto {
    @IsUUID()
    consumer_id: string;

    @IsString()
    ar_status: string;

    @IsNumber()
    calc_credit_limit: number;

    @IsNumber()
    pd_predictions: number;

    @IsNumber()
    income_predictions: number;

    @IsString()
    income_zone: string;

    @IsNumber()
    final_net_income: number;

    @IsString()
    cwf_segment: string;

    @IsNumber()
    cwf: number;
}

export class RiskConsumerApplicationUpdateDto {
    @IsUUID()
    subWorkflowId: string;

    @IsOptional()
    @IsString()
    list_type: SanctionType | null;

    @IsOptional()
    @IsString()
    is_consumer_in_sanction_list: string | null;

    @IsObject()
    @ValidateNested()
    @Type(() => RiskConsumerClDto)
    consumer_cl: RiskConsumerClDto;
}

/**
 * Input DTO for the `update_application_with_risk_data` task.
 */

export class UpdateApplicationWithRiskDataInputDTO {

    @IsObject()
    @ValidateNested()
    @Type(() => RiskConsumerApplicationUpdateDto)
    risk_output: RiskConsumerApplicationUpdateDto;

    @IsString()
    phone_number: string;
}


/**
 * Output DTO for the `update_application_with_risk_data` task.
 */
export class UpdateApplicationWithRiskDataOutputDTO {
    success: boolean;
}