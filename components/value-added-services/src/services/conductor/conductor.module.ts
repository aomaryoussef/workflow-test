// src/conductor/conductor.module.ts
import { Module, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { CommonModule } from '../../common/common.module'; // Import the CommonModule for OrkesClient and OrkesService
import { OrkesModule } from '../../services/orkes/orkes.module'; // Import the OrkesService
import { GetCreditLimitWorker } from './credit-limit/get-credit-limit-worker.task'; // Import another worker
import {
  TaskManager,
  ConductorClient,
} from '@io-orkes/conductor-javascript';
import { LoggerFactory } from '../../types/logger.interface';
import { CustomLoggerService } from '../../common/services/logger.service';
import { ConsumerModule } from '../../domain/consumer/consumer.module';
import { CreateApplicationWorker } from './consumer/create-application.task';
import { CreditLimitModule } from 'src/domain/consumer/credit-limit.module';
import { CreateIdentityWorker } from './consumer/create-identity.task';
import { CreateEntityWorker } from './consumer/create-entity.task';
import { KratosModule } from '../kratos/kratos.module';
import { GenerateKratosRecoveryFlowWorker } from './consumer/generate-kratos-recovery-flow.task';
import { SendOtpGreenServiceWorker } from './consumer/send-otp-green-service.task';

import { OrkesService } from '../orkes/orkes.service';
import { UpdateCreditLimitWorker } from './credit-limit/update-consumer-credit-limit.task';
import { FetchConsumerCreditLimitFromScoringByPhoneWorker } from './consumer/fetch-consumer-credit-limit-from-scoring-by-phone.task';
import { FetchConsumerDetailsFromMCWorker } from './consumer/fetch-consumer-details-from-mc.task';
import { AssignConsumerStatusAndCLWorker } from './consumer/assign-consumer-status-and-cl.task';
import { IsConsumerInSanctionListWorker } from './consumer/is_consumer_in_sanction_list.task';
import { RiskEngineModule } from '../risk-engine/risk-engine.module';
import { ScoreConsumerViaRiskEngineWorker } from './consumer/score-consumer-via-risk-engine.task';
import { UpdateApplicationWithKYCDataWorker } from './consumer/update-application-with-kyc-data.task';
import { ConsumerIsInListsWorker } from './consumer/consumer-is-in-lists.task';
import { UpdateApplicationIsDuplicateWorker } from './consumer/update-application-is-duplicate.task';
import { FetchConsumerCreditLimitFromScoringByNationalIdWorker } from './consumer/fetch-consumer-credit-limit-from-scoring-by-national-id.task';
import { UpdateApplicationWithMCDataWorker } from './consumer/update-application-with-mc-data.task';
import { UpdateApplicationWithRiskDataWorker } from './consumer/update-application-with-risk-data';
import { UpdateApplicationStepWorker } from './consumer/update-application-step.task';
import { CreateConsumerUserProfileEntityWorker } from './consumer/create-consumer-user-profile.task';
import { UpdateApplicationWithConsumerIdWorker } from './consumer/update-consumer-application-with-consumer-id.task';
import { UpdateApplicationStateWorker } from './consumer/update-consumer-application-state.task';
import {CreateInvoicingTransactionRecordWorker} from "./merchant/create_invoicing_transaction_record.task";
import {MerchantModule} from "../../domain/merchant/merchant.module";
import {AggregateMerchantInvoicesWorker} from "./merchant/aggregate_merchant_invoices.task";
import { MerchantDisbursementCallbackWorker } from './merchant/disbursement_callback.task';
import {PostMerchantInvoicesWorker} from "./merchant/post-merchant-invoices.task";
import { CheckConsumersSanctionListWorker } from './consumer/check_consumers_sanction_list.task';

@Module({
  imports: [
    CommonModule,
    OrkesModule,
    ConsumerModule,
    CreditLimitModule,
    KratosModule,
    RiskEngineModule,
    MerchantModule
  ], // Import CommonModule to access OrkesService and OrkesClient
  providers: [
    GetCreditLimitWorker,
    UpdateCreditLimitWorker,
    CreateApplicationWorker,
    CreateEntityWorker,
    CreateIdentityWorker,
    GenerateKratosRecoveryFlowWorker,
    SendOtpGreenServiceWorker,
    FetchConsumerDetailsFromMCWorker,
    CreateConsumerUserProfileEntityWorker,
    FetchConsumerCreditLimitFromScoringByPhoneWorker,
    FetchConsumerDetailsFromMCWorker,
    AssignConsumerStatusAndCLWorker,
    IsConsumerInSanctionListWorker,
    ScoreConsumerViaRiskEngineWorker,
    UpdateApplicationWithKYCDataWorker,
    ConsumerIsInListsWorker,
    UpdateApplicationIsDuplicateWorker,
    FetchConsumerCreditLimitFromScoringByNationalIdWorker,
    UpdateApplicationWithMCDataWorker,
    UpdateApplicationWithRiskDataWorker,
    UpdateApplicationStepWorker,
    CreateApplicationWorker,
    CreateConsumerUserProfileEntityWorker,
    UpdateApplicationWithConsumerIdWorker,
    UpdateApplicationStateWorker,
    CreateInvoicingTransactionRecordWorker,
    AggregateMerchantInvoicesWorker,
    MerchantDisbursementCallbackWorker,
    PostMerchantInvoicesWorker,
    CheckConsumersSanctionListWorker,
  ], // Register workers
})
export class ConductorModule implements OnModuleInit, OnModuleDestroy {
  private taskManager: TaskManager;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly getCreditLimitWorker: GetCreditLimitWorker,
    private readonly updateCreditLimitWorker: UpdateCreditLimitWorker,
    private readonly createIdentityWorker: CreateIdentityWorker,
    private readonly createEntityWorker: CreateEntityWorker,
    private readonly generateKratosRecoveryFlowWorker: GenerateKratosRecoveryFlowWorker,
    private readonly sendOtpGreenServiceWorker: SendOtpGreenServiceWorker,
    private readonly fetchConsumerCreditLimitFromScoringWorker: FetchConsumerCreditLimitFromScoringByPhoneWorker,
    private readonly fetchConsumerDetailsFromMCWorker: FetchConsumerDetailsFromMCWorker,
    private readonly assignConsumerStatusAndCLWorker: AssignConsumerStatusAndCLWorker,
    private readonly isConsumerInSanctionListWorker: IsConsumerInSanctionListWorker,
    private readonly scoreConsumerViaRiskEngineWorker: ScoreConsumerViaRiskEngineWorker,
    private readonly updateApplicationWithKYCDataWorker: UpdateApplicationWithKYCDataWorker,
    private readonly consumerIsInListsWorker: ConsumerIsInListsWorker,
    private readonly updateApplicationIsDuplicateWorker: UpdateApplicationIsDuplicateWorker,
    private readonly fetchConsumerCreditLimitFromScoringByNationalIdWorker: FetchConsumerCreditLimitFromScoringByNationalIdWorker,
    private readonly updateApplicationWithMCDataWorker: UpdateApplicationWithMCDataWorker,
    private readonly updateApplicationWithRiskDataWorker: UpdateApplicationWithRiskDataWorker,
    private readonly updateApplicationStepWorker: UpdateApplicationStepWorker,
    private readonly createApplicationWorker: CreateApplicationWorker,
    private readonly createConsumerUserProfileEntityWorker: CreateConsumerUserProfileEntityWorker,
    private readonly updateApplicationWithConsumerIdWorker: UpdateApplicationWithConsumerIdWorker,
    private readonly updateApplicationStateWorker: UpdateApplicationStateWorker,
    private readonly createInvoicingTransactionRecordWorker: CreateInvoicingTransactionRecordWorker,
    private readonly aggregateMerchantInvoicesWorker: AggregateMerchantInvoicesWorker,
    private readonly merchantDisbursementCallbackWorker: MerchantDisbursementCallbackWorker,
    private readonly postMerchantInvoicesWorker: PostMerchantInvoicesWorker,
    private readonly checkConsumersSanctionListWorker: CheckConsumersSanctionListWorker,
    @Inject('ORKES_CLIENT') private readonly client: ConductorClient, // Inject the OrkesClient from CommonModule
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
    private readonly orkesService: OrkesService,
  ) {
    this.logger = this.loggerFactory(ConductorModule.name);
  }

  async onModuleInit() {
    // Create a TaskManager to manage the polling of workers
    this.taskManager = new TaskManager(this.client, [
      this.getCreditLimitWorker,
      this.updateCreditLimitWorker,
      this.createApplicationWorker,
      this.createIdentityWorker,
      this.createEntityWorker,
      this.generateKratosRecoveryFlowWorker,
      this.sendOtpGreenServiceWorker,
      this.fetchConsumerCreditLimitFromScoringWorker,
      this.fetchConsumerDetailsFromMCWorker,
      this.createConsumerUserProfileEntityWorker,
      this.assignConsumerStatusAndCLWorker,
      this.isConsumerInSanctionListWorker,
      this.scoreConsumerViaRiskEngineWorker,
      this.updateApplicationWithKYCDataWorker,
      this.consumerIsInListsWorker,
      this.updateApplicationIsDuplicateWorker,
      this.fetchConsumerCreditLimitFromScoringByNationalIdWorker,
      this.updateApplicationWithMCDataWorker,
      this.updateApplicationWithRiskDataWorker,
      this.updateApplicationStepWorker,
      this.updateApplicationWithConsumerIdWorker,
      this.updateApplicationStateWorker,
      this.createInvoicingTransactionRecordWorker,
      this.aggregateMerchantInvoicesWorker,
      this.merchantDisbursementCallbackWorker,
      this.postMerchantInvoicesWorker,
      this.checkConsumersSanctionListWorker,
    ]);

    // Start polling for tasks
    this.taskManager.startPolling();
    this.logger.log('Task polling started .');
  }

  async onModuleDestroy() {
    // Stop polling for tasks when the module is destroyed
    if (this.taskManager) {
      await this.taskManager.stopPolling();
      this.logger.log('Task polling stopped.');
    }
  }
}
