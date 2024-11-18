import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/domain/common/repository/base.repository';
import { Club } from '../models/club.entity';

@Injectable()
export class ClubRepository extends BaseRepository<Club> {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {
    super(clubRepository);
  }
}
