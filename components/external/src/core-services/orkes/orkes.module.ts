import { Module } from '@nestjs/common';
import { OrkesService } from './orkes.service';

@Module({
  providers: [OrkesService],
})
export class MyloModule {}
