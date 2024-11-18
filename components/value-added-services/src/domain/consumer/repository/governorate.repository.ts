import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Governorate } from '../models/governorate.entity';

@Injectable()
export class GovernorateRepository extends BaseRepository<Governorate> {
  constructor(
    @InjectRepository(Governorate)
    private readonly governorateRepository: Repository<Governorate>,
  ) {
    super(governorateRepository);
  }
}
