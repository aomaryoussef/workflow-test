import { Module } from '@nestjs/common';
import { HasuraService } from './hasura.service';
import { LoggerModule } from '../logger/logger.module';

import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [LoggerModule, HttpModule],
  providers: [HasuraService],
  exports: [HasuraService],
})
export class HasuraModule {}
