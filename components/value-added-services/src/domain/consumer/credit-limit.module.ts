import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditLimitRepository } from './repository/credit-limit.repository';
import { ConsumerCreditLimit } from './models/credit-limit.entity';
import { CreditLimitController } from '../../app/web/consumer/controllers/credit-limit.controller';
import { UsedConsumerCreditLimit } from './models/used-credit-limit.entity';
import { UsedCreditLimitRepository } from './repository/used-credit-limit.repository';
import { CreditLimitUseCase } from './use-cases/credit-limit.use-case';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsumerCreditLimit, UsedConsumerCreditLimit]),
    CommonModule
  ],
  controllers: [CreditLimitController],
  providers: [
    CreditLimitUseCase,
    CreditLimitRepository,
    UsedCreditLimitRepository,
  ],
  exports: [CreditLimitRepository, UsedCreditLimitRepository, CreditLimitUseCase],
})
export class CreditLimitModule {}
