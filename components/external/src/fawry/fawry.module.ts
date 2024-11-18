import { Module } from '@nestjs/common';
import { FawryController } from './fawry.controller';
import { FawryService } from './fawry.service';
import { FormanceService } from 'src/core-services/formance/formance.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'src/core-services/logger/logger.module';
import { HasuraService } from 'src/core-services/hasura/hasura.service';
import { OrkesService } from '~/core-services/orkes/orkes.service';

@Module({
  imports: [HttpModule, LoggerModule],
  controllers: [FawryController],
  providers: [FawryService, FormanceService, HasuraService, OrkesService],
})
export class FawryModule {}
