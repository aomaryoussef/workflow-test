import { GetRiskEngineScoreOutputDTO } from 'src/services/risk-engine/dto/risk-score.dto';
import {
  MaritalStatus,
  MobileOsType,
} from '../../types/consumer-application.types';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ScoreConsumerData {
  @ApiProperty({ description: 'Primary phone number of the consumer' })
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'National ID of the consumer' })
  @IsString()
  nationalId: string;

  @ApiProperty({ description: 'Job title of the consumer' })
  @IsString()
  jobTitle: string;

  @ApiProperty({ description: 'Primary income of the consumer' })
  @IsNumber()
  primaryIncome: number;

  @ApiProperty({
    description: 'Marital status of the consumer',
    enum: MaritalStatus,
  })
  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;

  @ApiProperty({
    description: 'Number of children the consumer has',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  numberOfKids?: number;

  @ApiProperty({ description: 'Governorate ID where the consumer resides' })
  @IsNumber()
  governorateId: number;

  @ApiProperty({ description: 'City ID where the consumer resides' })
  @IsNumber()
  cityId: number;

  @ApiProperty({ description: 'Area ID where the consumer resides' })
  @IsNumber()
  areaId: number;

  @ApiProperty({ description: 'House type slug' })
  @IsString()
  houseType: string;

  @ApiProperty({ description: 'Club level of the consumer', required: false })
  @IsOptional()
  @IsString()
  club?: string;

  @ApiProperty({
    description: 'Mobile operating system type',
    enum: MobileOsType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MobileOsType)
  mobileOsType?: MobileOsType;
}

export class ScoreConsumerInputDto {
  @ApiProperty({ description: 'Booking time for the risk score calculation' })
  @IsString()
  bookingTime: string;

  @ApiProperty({ description: 'Indicates if the income has been verified' })
  @IsBoolean()
  verified_income: boolean;

  @ApiProperty({
    description: 'Consumer data for risk scoring',
    type: () => ScoreConsumerData,
  })
  @ValidateNested() // Ensures validation of the nested object
  @Type(() => ScoreConsumerData) // Allows proper transformation and validation of nested object
  data: ScoreConsumerData;
}

export class ScoreConsumerOutputDto {
  consumer_id: string;
  ar_status: string;
  calc_credit_limit: number;
  pd_predictions: number;
  income_predictions: number;
  income_zone: string;
  final_net_income: number;
  cwf_segment: string;
  cwf: number;

  constructor();
  constructor(riskScoreResponse: GetRiskEngineScoreOutputDTO);
  constructor(riskScoreResponse?: GetRiskEngineScoreOutputDTO) {
    if (riskScoreResponse) {
      this.consumer_id = riskScoreResponse.consumer_id;
      this.ar_status = riskScoreResponse.ar_status;
      this.calc_credit_limit = riskScoreResponse.calc_credit_limit;
      this.pd_predictions = riskScoreResponse.pd_predictions;
      this.income_predictions = riskScoreResponse.income_predictions;
      this.income_zone = riskScoreResponse.income_zone;
      this.final_net_income = riskScoreResponse.final_net_income;
      this.cwf_segment = riskScoreResponse.cwf_segment;
      this.cwf = riskScoreResponse.cwf;
    }
  }
}
