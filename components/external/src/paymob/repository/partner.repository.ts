import { Inject, Injectable } from '@nestjs/common';
import { HasuraService } from '~/core-services/hasura/hasura.service';
import { CustomLoggerService } from '~/core-services/logger/logger.service';
import { LoggerFactory } from '~/core-services/logger/types';

@Injectable()
export class PartnerRepository {
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly hasuraService: HasuraService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory('paymob partner repository');
  }

  async getPartner(
    partnerName: string,
  ): Promise<{ name: string; id: string; category: string,status: string,branchId:string}> {
    this.logger.debug(`getPartner called with partnerName: ${partnerName}`);
    try {
      const getPartnerByNameQuery = `query getPartnerByName($partnerName: String!) {
            partner(where: {status: {_eq: "ACTIVE"}, name: {_eq: $partnerName}}, limit:1 ) {
                    name
                    id
                    categories
                    status
                    branchId:partner_branches(limit: 1) {
                      id
                  }
                }
                }
            `;
      const result = await this.hasuraService.executeQuery<{
        data: { partner: { name: string; id: string; categories: string[] ,status: string, branchId:{id:string}[]}[] };
      }>(getPartnerByNameQuery, { partnerName });
      const partners = result.data.partner;
      if (partners.length === 0) {
        return null;
      }
      const partner = partners[0];
      return {
        name: partner.name,
        id: partner.id,
        category: partner.categories[0],
        status:partner.status,
        branchId:partner.branchId[0].id
      };
    } catch (error) {
      this.logger.error('Error fetching active partner:' + error);
      throw new Error('Unable to fetch active partner');
    }
  }
}
