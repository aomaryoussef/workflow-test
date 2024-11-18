import { Module } from '@nestjs/common';
import {
  ScoringEngineService,
} from './scoring-engine.service';
import { CommonModule } from 'src/common/common.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CommonModule, HttpModule],

  providers: [ScoringEngineService],
  exports: [ScoringEngineService],
})
export class ScoringEngineModule { }
