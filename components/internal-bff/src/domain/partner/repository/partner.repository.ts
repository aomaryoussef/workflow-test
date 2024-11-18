import { Inject, Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { LoggerFactory } from '../../../types/logger.interface';
import { HasuraService } from '../../../core-services/hasura/hasura.service';
import { HttpService } from '@nestjs/axios';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { NotFoundError } from '../../../exceptions/custom-exceptions';
import { GetPartnerByIdResponse, PartnerDto } from './types/partner.types';
import { getPartnerByIdQuery } from './queries/partner.queries';

@Injectable()
export class PartnerRepository {
  private readonly logger: CustomLoggerService;

  constructor(
    @Inject('CUSTOM_LOGGER')
    private readonly loggerFactory: LoggerFactory,
    private readonly hasura: HasuraService,
    private readonly httpService: HttpService,
    private readonly tracingService: TraceIdService,
  ) {
    this.logger = this.loggerFactory(PartnerRepository.name);
  }

  async getPartnerById(partnerId: string): Promise<PartnerDto> {
    try {
      const response = await this.hasura.executeQuery<GetPartnerByIdResponse>(
        getPartnerByIdQuery,
        {
          partnerId,
        },
        'GetPartnerById',
      );

      if (!response.data || response.data.partner.length === 0) {
        this.logger.log(`Couldnt find partner for given id: ${partnerId}`);
        throw new NotFoundError('Partner not found');
      }

      return response.data.partner[0];
    } catch (error) {
      this.logger.error({
        message: `Failed to fetch partner from hasura ${partnerId}`,
        error: error.stack,
      });
      throw error;
    }
  }
}
