import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { SelectedInstallmentPlanDto } from './paymob.select-installment-plan.dto';

export class VerifyAndConfirmRequestDto {
  @ApiProperty({
    description: 'One-Time Password (OTP) for verification',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
  @ApiProperty({
    description: 'Paymob transaction ID',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  paymob_transaction_id: string;
}
export class ReceiptDataDto extends SelectedInstallmentPlanDto {
  @ApiProperty({
    description: 'down payment',
    example: '10000',
  })
  @IsString()
  down_payment: number;

    @ApiProperty({
    description: 'mylo transaction_id',
    example: '10000',
  })
  @IsNumber()
  transaction_id: number;
}

export class VerifyAndConfirmResponseDto {
  @ApiProperty({
    description: 'Recipe data',
    type: ReceiptDataDto,
  })
  recipe_data: ReceiptDataDto;
}
