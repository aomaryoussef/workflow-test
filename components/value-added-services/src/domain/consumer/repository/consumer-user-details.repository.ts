import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { ConsumerUserDetails } from '../models/consumer-user-details.entity';
import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';

@Injectable()
export class ConsumerUserDetailsRepository extends BaseRepository<ConsumerUserDetails> {
  private readonly logger: CustomLoggerService; // Logger for the service

  constructor(
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,

    @InjectRepository(ConsumerUserDetails)
    private readonly consumerUserDetailsRepository: Repository<ConsumerUserDetails>,
  ) {
    super(consumerUserDetailsRepository);
    this.logger = this.loggerFactory(ConsumerUserDetailsRepository.name);

    
  }
}
