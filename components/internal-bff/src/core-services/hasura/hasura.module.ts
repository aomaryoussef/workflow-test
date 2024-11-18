import { Module } from '@nestjs/common';
import { HasuraService } from './hasura.service';
import { CommonModule } from 'src/common/common.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CommonModule, HttpModule],
  providers: [HasuraService],
  exports: [HasuraService],
})
export class HasuraModule {}
