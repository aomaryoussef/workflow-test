import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PartnerRepository } from '../repository/partner.repository';
import { PartnerProvider } from '../providers/partner.provider';

@Injectable()
export class GetPartnerId implements NestMiddleware {
  constructor(
    @Inject(PartnerRepository)
    private readonly partnerRepository: PartnerRepository,
    private readonly partnerProvider: PartnerProvider,
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
      if (req.path.includes('/paymob')) {
      const partnerName = req.headers['x-user-iam-id'] as string;
      if (!partnerName) {
        res.status(401).send('Unauthorized');
        return;
      } else {
        const partner = await this.partnerRepository.getPartner(partnerName);
        if (partner) {
          this.partnerProvider.setValue(partner);
        } else {
          res.status(401).send('Unauthorized');
          return;
        }
      }
    }
    next();
  }
}