import { ApiProperty } from '@nestjs/swagger';

export class InstallmentPlanDto {
  @ApiProperty({
    description: 'Unique identifier of the installment plan',
    example: 'f2f0ad4d-b113-4ff1-a9f0-44612ab8d57d',
  })
  id: string;

  @ApiProperty({
    description: 'Duration of the installment plan',
    example: '6_Months',
  })
  duration: string;

  @ApiProperty({ description: 'Monthly installment amount', example: '2855' })
  monthly_installment: number;

  @ApiProperty({
    description: 'Administrative fees for the plan',
    example: '10',
  })
  admin_fees: number;

  @ApiProperty({ description: 'Murabha rate for the plan', example: '9' })
  murabha_rate: number;
}
