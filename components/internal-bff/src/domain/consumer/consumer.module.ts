import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { PublicConsumerController } from 'src/app/web/consumer/controllers/public-consumer.controller';
import { ConsumerRepository } from './repository/consumer.repository';
import { HasuraModule } from '../../core-services/hasura/hasura.module';
import { PrivateConsumerController } from '../../app/web/consumer/controllers/private-consumer.controller';
import { ConsumerService } from './services/consumer-service';
import { HttpModule } from '@nestjs/axios';
import { MinicashModule } from 'src/core-services/minicash/minicash.module';
import { ScoringEngineModule } from 'src/core-services/scoring-engine/scoring-engine.module';

@Module({
  imports: [CommonModule, HasuraModule, HttpModule, MinicashModule, ScoringEngineModule],
  controllers: [PublicConsumerController, PrivateConsumerController],
  providers: [ConsumerService, ConsumerRepository],
  exports: [],
})
export class ConsumerModule { }
