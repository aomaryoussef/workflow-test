import { InstallmentPlanDto } from './paymob.installment-plan.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum ResendMethod {
  OTP = 'otp',
  CALL = 'call',
}
export class ResendOTPRequestDto {
  @ApiProperty({
    description: 'Resend method (OTP or Call)',
    example: ResendMethod.OTP,
    enum: ResendMethod, // This will show the enum in Swagger documentation
  })
  @IsEnum(ResendMethod, { message: 'method must be either otp or call' })
  @IsString()
  @IsNotEmpty()
  method: ResendMethod;
}
