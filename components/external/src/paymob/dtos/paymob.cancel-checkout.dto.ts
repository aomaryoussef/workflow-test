import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CancelCheckoutRequestDto {
  @ApiProperty({
    description: 'Confirmation value to finalize the checkout cancelation',
    example: 'cancel',
  })
  @IsString()
  @IsNotEmpty()
  cancel: string;
}

export class CancelCheckoutResponseDto {
  @ApiProperty({
    description: 'is success',
    type: Boolean,
    example: true,
  })
  is_success: boolean;
}
