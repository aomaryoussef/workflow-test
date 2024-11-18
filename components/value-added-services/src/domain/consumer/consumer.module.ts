import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { ConsumerController } from '../../app/web/consumer/controllers/consumer.controller';
import { ConsumerUseCase } from './use-cases/consumer-use-case';
import {
  ConsumerApplicationRepository,
  ConsumerApplicationStateRepository,
} from './repository/consumer-application.repository';
import { ConsumerRepository } from './repository/consumer.repository';
import { SMSHandlerService } from '../../services/sms/sms-handler.service';
import { Consumer } from './models/consumer.entity';
import { ConsumerApplication } from './models/consumer-application.entity';
import { ConsumerApplicationState } from './models/consumer-application-state.entity';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { TwilioService } from '../../services/twilio/twilio.service';
import { NunjucksUtils } from '../../services/sms/template-rendering.utils';
import { HttpModule } from '@nestjs/axios';
import { KratosService } from '../../services/kratos/kratos.service';
import { KratosModule } from 'src/services/kratos/kratos.module';
import { SMSModule } from 'src/services/sms/sms.module';
import { MinicashModule } from 'src/services/minicash/minicash.module';
import { ScoringEngineModule } from 'src/services/scoring-engine/scoring-engine.module';
import { OrkesModule } from 'src/services/orkes/orkes.module';
import { RiskEngineModule } from '../../services/risk-engine/risk-engine.module';
import { ConsumerKyc } from './models/consumer-kyc.entity';
import { ConsumerUserDetails } from './models/consumer-user-details.entity';
import { ConsumerUserDetailsRepository } from './repository/consumer-user-details.repository';
import { ConsumerKYCRepository } from './repository/consumer-kyc.repository';
import { ConsumerPhoneRepository } from './repository/consumer-phone.repository';
import { ConsumerPhone } from './models/consumer-phone.entity';
import { ConsumerState } from './models/consumer-state.entity';
import { ConsumerAddress } from './models/consumer-address.entity';
import { CreditLimitRepository } from './repository/credit-limit.repository';
import { ConsumerCreditLimit } from './models/credit-limit.entity';
import { UsedConsumerCreditLimit } from './models/used-credit-limit.entity';
import { ConsumerAddressRepository } from './repository/consumer-address.repository';
import { UsedCreditLimitRepository } from './repository/used-credit-limit.repository';
import { Area } from './models/area.entity';
import { Governorate } from './models/governorate.entity';
import { City } from './models/city.entity';
import { GovernorateRepository } from './repository/governorate.repository';
import { CityRepository } from './repository/city.repository';
import { AreaRepository } from './repository/area.repository';
import { EmailModule } from 'src/services/email/email.module';
import { LegacyConsumer } from './models/legacy-consumer.entity';
import { ConsumerStateRepository } from './repository/consumer-state.repository';
import { LegacyConsumerRepository } from './repository/legacy-consumer.repository';
import { ConsumerProfileUseCase } from './use-cases/consumer-profile.use-case';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { SanctionListUseCase } from './use-cases/sanction-list.use-case';
import { LoggerFactory } from 'src/types/logger.interface';
import { SanctionListRepository } from './repository/sanction-list.repository';
import { SanctionList } from './models/sanction-list.entity';
import { ConsumerActivationUseCase } from './use-cases/consumer-activation.use-case';
import { ConsumerScoringUseCase } from './use-cases/consumer-scoring.use-case';
import { ConsumerScoringController } from 'src/app/web/consumer/controllers/consumer-scoring.controller';
import { ClubRepository } from './repository/club.repository';
import { Club } from './models/club.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Consumer,
      LegacyConsumer,
      ConsumerApplication,
      ConsumerApplicationState,
      ConsumerKyc,
      ConsumerUserDetails,
      ConsumerPhone,
      ConsumerState,
      ConsumerAddress,
      ConsumerCreditLimit,
      UsedConsumerCreditLimit,
      Governorate,
      City,
      Area,
      Club,
      SanctionList
    ]),
    HttpModule,
    KratosModule,
    SMSModule,
    EmailModule,
    MinicashModule,
    ScoringEngineModule,
    OrkesModule,
    CommonModule,
    RiskEngineModule,
    EmailModule,
  ],
  controllers: [ConsumerController, ConsumerScoringController],
  providers: [
    ConsumerUseCase,
    ConsumerRepository,
    ConsumerApplicationRepository,
    ConsumerApplicationStateRepository,
    ConsumerUserDetailsRepository,
    ConsumerKYCRepository,
    SanctionListRepository,
    SMSHandlerService,
    NotificationsService,
    TwilioService,
    NunjucksUtils,
    KratosService,
    ClubRepository,
    ConsumerPhoneRepository,
    ConsumerStateRepository,
    LegacyConsumerRepository,
    CreditLimitRepository,
    UsedCreditLimitRepository,
    ConsumerAddressRepository,
    GovernorateRepository,
    ConsumerProfileUseCase,
    CityRepository,
    AreaRepository,
    SanctionListUseCase,
    ConsumerActivationUseCase,
    ConsumerScoringUseCase,

  ],
  exports: [
    ConsumerUseCase,
    ConsumerActivationUseCase,
    ConsumerProfileUseCase,
    ConsumerRepository,
    ConsumerApplicationRepository,
    ConsumerApplicationStateRepository,
    SanctionListUseCase,
  ],
})
export class ConsumerModule implements OnModuleInit {
  private readonly logger: CustomLoggerService;
  constructor(
    private readonly sanctionListUseCase: SanctionListUseCase,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(ConsumerModule.name);
  }

  // This will run when the module is initialized
  async onModuleInit() {
    this.logger.log('SanctionListModule initializing, starting data import...');
    await this.sanctionListUseCase.importAndUpsertSanctions();
  }
}
