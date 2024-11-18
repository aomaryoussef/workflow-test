import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseRepository } from '~/core-services/typeorm/base.repository';
import { PaymobSessionBasket } from '../entities/paymob-session-basket.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymobSessionBasketRepository extends BaseRepository<PaymobSessionBasket> {
  constructor(
    @InjectRepository(PaymobSessionBasket)
    private readonly paymobSsionBasketRepository: Repository<PaymobSessionBasket>,
  ) {
    super(paymobSsionBasketRepository);
  }
}
