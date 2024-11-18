import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { PartnerOutputDto } from '../../../../domain/partner/dto/partner.dto';
import { PartnerService } from '../../../../domain/partner/services/partner-service';

@ApiTags('partners')
@Controller('private/partners')
export class PrivatePartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get(':partner_id')
  @ApiResponse({
    status: 200,
    description: 'Get partner data by id',
    type: PartnerOutputDto,
  })
  async getPartnerDataById(
    @Param('partner_id') partnerId: string,
  ): Promise<PartnerOutputDto> {
    return await this.partnerService.getPartnerById(partnerId);
  }
}
