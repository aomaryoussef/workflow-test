import { Module } from '@nestjs/common';
import { RiskEngineService } from './risk-engine.service';
import { CommonModule } from 'src/common/common.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, CommonModule],

  providers: [RiskEngineService],
  exports: [RiskEngineService],
})
export class RiskEngineModule {}
