import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { LegacyConsumer } from '../models/legacy-consumer.entity';

@Injectable()
export class LegacyConsumerRepository extends BaseRepository<LegacyConsumer> {
    constructor(
        @InjectRepository(LegacyConsumer)
        private readonly LegacyConsumerRepository: Repository<LegacyConsumer>
    ) {
        super(LegacyConsumerRepository);
    }
}