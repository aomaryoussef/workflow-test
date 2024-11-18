import { Inject, Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { LoggerFactory } from '../../../types/logger.interface';
import { PartnerRepository } from '../repository/partner.repository';
import { PartnerDto } from '../repository/types/partner.types';

@Injectable()
export class PartnerService {
  private readonly logger: CustomLoggerService;

  constructor(
    @Inject('CUSTOM_LOGGER')
    private readonly loggerFactory: LoggerFactory,
    private readonly repository: PartnerRepository,
  ) {
    this.logger = this.loggerFactory(PartnerService.name);
  }

  async getPartnerById(partnerId: string): Promise<PartnerDto> {
    try {
      this.logger.debug(`getPartnerById for partnerId ${partnerId}`);
      return await this.repository.getPartnerById(partnerId);
    } catch (error) {
      console.log(JSON.stringify(error));
      this.logger.error({
        message: `Failed to fetch partner by id: ${partnerId}. Error: ${error.message}`,
        error: error.stack,
      });
      throw error;
    }
  }
}
