import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { City } from '../models/city.entity';

@Injectable()
export class CityRepository extends BaseRepository<City> {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {
    super(cityRepository);
  }
}
