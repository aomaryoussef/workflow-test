import { ApiProperty } from '@nestjs/swagger';
import { ReceiptDataDto } from './paymob.verify-and-confirm.dto';
import { OmitType } from '@nestjs/mapped-types';

export class RefundReceiptDto extends  OmitType(ReceiptDataDto, ['next_installment_date'] as const) {

}
export class RefundResponseDto {
  @ApiProperty({
    description: 'Recipe data',
    type: RefundReceiptDto,
  })
  recipe_data: RefundReceiptDto;
}
