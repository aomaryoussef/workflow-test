import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Area } from '../models/area.entity';

@Injectable()
export class AreaRepository extends BaseRepository<Area> {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {
    super(areaRepository);

  }

  async getAreaWithCityAndGovernorateById(id: number): Promise<Area> {
    return await this.getRepository().findOne({
      where: { id },
      relations: ['city', 'governorate'],
    });
  }
}
