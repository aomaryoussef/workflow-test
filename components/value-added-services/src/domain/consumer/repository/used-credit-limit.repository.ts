import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { UsedConsumerCreditLimit } from '../models/used-credit-limit.entity';
import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';

@Injectable()
export class UsedCreditLimitRepository extends BaseRepository<UsedConsumerCreditLimit> {
  private readonly logger: CustomLoggerService; // Logger for the service

  constructor(
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,

    @InjectRepository(UsedConsumerCreditLimit)
    private readonly usedConsumerCreditLimitRepository: Repository<UsedConsumerCreditLimit>,
  ) {
    super(usedConsumerCreditLimitRepository);
    this.logger = this.loggerFactory(UsedCreditLimitRepository.name);

  }
}
