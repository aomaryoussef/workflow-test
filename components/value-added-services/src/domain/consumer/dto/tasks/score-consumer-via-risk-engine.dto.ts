import {
  IsString,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { ConsumerDetailsDTO } from './update-application-with-kyc-data.dto';
import { Type } from 'class-transformer';

/**
 * Input DTO for the `score_consumer_via_risk_engine` task.
 */
export class ScoreConsumerViaRiskEngineInputDTO {
  @IsObject()
  @ValidateNested() // Ensures nested validation for consumer_details
  @Type(() => ConsumerDetailsDTO) // Ensures proper transformation of nested objects
  consumer_details: ConsumerDetailsDTO;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsString()
  @IsOptional()
  consumer_id: string;

  @IsString()
  @IsOptional()
  booking_time: string;
}

/**
 * Output DTO for the `score_consumer_via_risk_engine` task.
 */
export class ScoreConsumerViaRiskEngineOutputDTO {
  consumer_id: string;
  ar_status: string;
  calc_credit_limit: number;
  pd_predictions: number;
  income_predictions: number;
  income_zone: string;
  final_net_income: number;
  cwf_segment: string;
  cwf: number;
  is_consumer_in_lists: boolean;
}
