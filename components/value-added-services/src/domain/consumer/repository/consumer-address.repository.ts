import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { ConsumerAddress } from '../models/consumer-address.entity';

@Injectable()
export class ConsumerAddressRepository extends BaseRepository<ConsumerAddress> {
  constructor(
    @InjectRepository(ConsumerAddress)
    private readonly consumerAddressRepository: Repository<ConsumerAddress>,
  ) {
    super(consumerAddressRepository);
  }
}
