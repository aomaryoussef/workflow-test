import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { InstallmentPlanDto } from './paymob.installment-plan.dto';

export class SelectInstallmentsPlanRequestDto {
  @ApiProperty({
    description: 'Selected installment plan UUID',
    example: '2ff0ad4d-b113-4ff1-a9f0-44612ab8d57d',
  })
  @IsUUID()
  @IsString()
  selected_installment: string;
}
export class SelectedInstallmentPlanDto extends InstallmentPlanDto {
  @ApiProperty({
    description: 'Financed amount',
    example: '10000',
  })
  @IsString()
  financed_amount: string;

  @ApiProperty({
    description: 'Total amount with Murabha rate',
    example: '12000',
  })
  @IsString()
  total_amount_with_murabha_rate: string;

  @ApiProperty({
    description: 'Next installment date',
    example: '12-09-2024',
  })
  @IsString()
  next_installment_date: string;
}
export class SelectInstallmentsPlanResponseDto {
  @ApiProperty({
    description: 'Selected installment plan',
    type: SelectedInstallmentPlanDto,
  })
  offer_details: SelectedInstallmentPlanDto;
}
