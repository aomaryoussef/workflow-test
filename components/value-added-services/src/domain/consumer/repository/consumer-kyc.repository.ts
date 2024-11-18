import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { ConsumerKyc } from '../models/consumer-kyc.entity';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { LoggerFactory } from 'src/types/logger.interface';

@Injectable()
export class ConsumerKYCRepository extends BaseRepository<ConsumerKyc> {
  private readonly logger: CustomLoggerService; // Logger for the service

  constructor(
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,

    @InjectRepository(ConsumerKyc)
    private readonly consumerKYCRepository: Repository<ConsumerKyc>,
  ) {
    super(consumerKYCRepository);
    this.logger = this.loggerFactory(ConsumerKYCRepository.name);

  }
}
