import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { ConsumerPhone } from '../models/consumer-phone.entity';

@Injectable()
export class ConsumerPhoneRepository extends BaseRepository<ConsumerPhone> {
  private readonly logger: CustomLoggerService; // Logger for the service

  constructor(
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,

    @InjectRepository(ConsumerPhone)
    private readonly consumerPhoneRepository: Repository<ConsumerPhone>,
  ) {
    super(consumerPhoneRepository);
    this.logger = this.loggerFactory(ConsumerPhoneRepository.name);
  }
}
