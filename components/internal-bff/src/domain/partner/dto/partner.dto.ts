import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PartnerBranchOutputDto {
  @ApiProperty({ example: 'd51f7438-9373-41fb-815f-9d14e88d5e58' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'City' })
  @IsString()
  city?: string;

  @ApiProperty({ example: 'ASSIUT' })
  @IsString()
  governorate?: string;

  @ApiProperty({ example: '122.122' })
  @IsString()
  location_latitude?: string;

  @ApiProperty({ example: '122.122' })
  @IsString()
  location_longitude?: string;

  @ApiProperty({ example: 'branch-873' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Street' })
  @IsString()
  street?: string;

  @ApiProperty({
    example:
      'https://www.google.com/maps/place/b_labs/@29.9794671,31.3580415,17z/data=!3m1!4b1!4m6!3m5!1s0x14583b8a37216725:0x4a3c4e6194ea5933!8m2!3d29.9794625!4d31.3554666!16s%2Fg%2F11sthl8mll?entry=ttu',
  })
  @IsString()
  google_maps_link?: string;
}

export class PartnerOutputDto {
  @ApiProperty({ example: '20451911-e7a5-4b1f-813a-7fbd6fdfb074' })
  @IsString()
  id: string;

  @ApiProperty({ example: ['FASHION'] })
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({ example: 'Partner-1726086382325' })
  @IsString()
  name: string;

  @ApiProperty({ type: [PartnerBranchOutputDto] })
  @ValidateNested({ each: true })
  @Type(() => PartnerBranchOutputDto)
  partner_branches: PartnerBranchOutputDto[];
}
