import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { HasuraModule } from '../../core-services/hasura/hasura.module';
import { HttpModule } from '@nestjs/axios';
import { PrivatePartnerController } from '../../app/web/consumer/controllers/private-partner.controller';
import { PartnerService } from './services/partner-service';
import { PartnerRepository } from './repository/partner.repository';

@Module({
  imports: [CommonModule, HasuraModule, HttpModule],
  controllers: [PrivatePartnerController],
  providers: [PartnerService, PartnerRepository],
  exports: [],
})
export class PartnerModule {}
