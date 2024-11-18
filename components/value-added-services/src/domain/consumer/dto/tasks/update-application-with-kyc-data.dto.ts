import { Transform, Type } from "class-transformer";
import { IsString, IsOptional, IsNumber, IsObject, ValidateNested, IsNotEmpty, IsEnum, IsPositive } from "class-validator";
import { MaritalStatus, MobileOsType } from "../../types/consumer-application.types";


/**
 * Input DTO for the `update_application_with_kyc_data` task.
 */

export class ConsumerDetailsDTO {

    @IsString()
    first_name: string;

    @IsOptional()
    @IsString()
    middle_name?: string;

    @IsString()
    last_name: string;

    @IsString()
    job_type: string;

    @IsString()
    job_title: string;

    @IsString()
    company_name: string;

    @IsString()
    house_type: string;

    @IsString()
    marital_status: MaritalStatus;

    @IsString()
    @IsOptional()
    car_model: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    car_year: number;

    @IsNumber()
    primary_income: number;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    governorate: string;

    @IsString()
    city: string;

    @IsString()
    area: string;

    @IsNumber()
    governorate_id: number;

    @IsNumber()
    city_id: number;

    @IsNumber()
    area_id: number;

    @IsOptional()
    @IsString()
    club?: string;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value || 0)
    number_of_kids?: number;

    @IsEnum(MobileOsType)
    @IsOptional()
    mobile_os_type: MobileOsType;

    @IsString()
    national_id: string;
}

export class UpdateApplicationWithKYCDataInputDTO {
    @IsObject()
    @ValidateNested() // Ensures nested validation for consumer_details
    @Type(() => ConsumerDetailsDTO) // Ensures proper transformation of nested objects
    consumer_details: ConsumerDetailsDTO;

    @IsNotEmpty()
    @IsString()
    phone_number: string;

    @IsNotEmpty()
    @IsString()
    consumer_id: string;
}


/**
 * Output DTO for the `update_application_with_kyc_data` task.
 */
export class UpdateApplicationWithKYCDataOutputDTO {
    success: boolean;
}
