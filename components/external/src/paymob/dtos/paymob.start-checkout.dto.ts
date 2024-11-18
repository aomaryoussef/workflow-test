import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { InstallmentPlanDto } from './paymob.installment-plan.dto';

export class StartCheckoutRequestDto {
  @ApiProperty({
    description: 'Consumer mobile number',
    example: '01068702228',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ description: 'Product name', example: 'IPhone 16 pro max' })
  @IsNotEmpty()
  @IsString()
  product_name: string;
  
  @ApiProperty({ description: 'Total product price', example: '5000' })
  product_price: number;

  @ApiProperty({ description: 'Optional down payment ', example: '1000' })
  @IsOptional()
  down_payment: number;

  @ApiProperty({ description: 'OS id ', example: '123456' })
  @IsNotEmpty()
  terminal_id: number;

  @ApiProperty({
    description: 'Merchant id',
    example: '123456',
    required: false,
  })
  @IsNotEmpty()
  merchant_id: string;

  // Private getter for loan_value
  private get loan_value(): number {
    return this.product_price - (this.down_payment || 0);
  }

  constructor() {
    this.phone_number = '';
    this.product_name = '';
    this.product_price = 0;
    this.down_payment = 0;
    this.terminal_id = 0;
  }
}

export class StartCheckoutResponseDto {
  @ApiProperty({
    description:
      'Transaction ID used for any interaction in this checkout process',
    required: true,
  })
  @IsNotEmpty()
  transaction_id: number;

  @ApiProperty({
    description: 'Financed amount in this checkout process',
    required: true,
  })
  @IsNotEmpty()
  financed_amount: number;

  @ApiProperty({
    description: 'Installment plans in this checkout process',
    required: true,
  })
  @IsNotEmpty()
  installment_plans: InstallmentPlanDto[];

  constructor(data: StartCheckoutResponseDto) {
    this.transaction_id = data.transaction_id || 0;
    this.installment_plans = data.installment_plans || [];
  }
}
