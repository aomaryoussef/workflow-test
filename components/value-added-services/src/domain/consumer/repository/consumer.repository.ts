import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { Consumer } from '../models/consumer.entity';


import { CustomLoggerService } from '../../../common/services/logger.service';
import { LoggerFactory } from '../../../types/logger.interface';



@Injectable()
export class ConsumerRepository extends BaseRepository<Consumer> {
  private readonly logger: CustomLoggerService; // Logger for the service

  constructor(
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
    @InjectRepository(Consumer)
    private readonly consumerRepository: Repository<Consumer>,
  ) {
    super(consumerRepository);
    this.logger = this.loggerFactory(ConsumerRepository.name);
  }

}
