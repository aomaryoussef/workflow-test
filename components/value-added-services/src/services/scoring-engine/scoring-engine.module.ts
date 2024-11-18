import { Module } from '@nestjs/common';
import {
  ScoringEngineService,
  ConsumerStatusFilteringService,
} from './scoring-engine.service';
import { CommonModule } from 'src/common/common.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CommonModule, HttpModule],

  providers: [ScoringEngineService, ConsumerStatusFilteringService],
  exports: [ScoringEngineService, ConsumerStatusFilteringService],
})
export class ScoringEngineModule {}
