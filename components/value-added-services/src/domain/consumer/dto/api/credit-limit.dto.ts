import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreditLimitDto {
  @ApiProperty({
    example: '587715cf-1574-450e-88a7-f3624b096d30',
    description: 'The unique identifier for the credit limit record',
  })
  id: string;

  @ApiProperty({
    example: '587715cf-1574-450e-88a7-f3624b096d30',
    description: 'The UUID of the consumer associated with the credit limit',
  })
  consumerId: string;

  @ApiProperty({
    example: 5000,
    description:
      'The maximum limit of the consumer credit',
  })
  maxCreditLimit: number;

  @ApiProperty({
    example: 5000,
    description:
      'The maximum avilable limit of the consumer at a specific point in time',
  })
  availableCreditLimit: number;


  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The date and time when the credit limit became active',
  })
  activeSince: Date;
}

export class CreateOrUpdateCreditLimitDto {
  @ApiProperty({
    example: 500,
    description: 'Positive if deducted, negative if credited back',
  })
  @IsInt()
  @IsNotEmpty()
  usedCredit: number; // Represents the amount of credit used or refunded

  // The UUID of the consumer associated with the credit limit (set by the controller, not API input)
  @IsUUID()
  @IsOptional()
  consumerId: string;
}
