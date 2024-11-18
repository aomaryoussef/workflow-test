import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseRepository } from '~/core-services/typeorm/base.repository';
import { PaymobSessionBasket } from '../entities/paymob-session-basket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymobAudit } from '../entities/paymob-audit.entity';

@Injectable()
export class PaymobAuditRepository extends BaseRepository<PaymobAudit> {
  constructor(
    @InjectRepository(PaymobAudit)
    private readonly paymobAuditRepository: Repository<PaymobAudit>,
  ) {
    super(paymobAuditRepository);
  }
}
