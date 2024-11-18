import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [HttpModule, LoggerModule],
  exports: [],
  providers: [],
})
export class FormanceModule {}
