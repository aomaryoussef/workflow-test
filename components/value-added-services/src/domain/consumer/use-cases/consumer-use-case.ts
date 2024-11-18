import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityManager } from 'typeorm';

import {
  ConsumerApplicationRepository,
  ConsumerApplicationStateRepository,
} from '../repository/consumer-application.repository';
import {
  AssignConsumerStatusAndCLOutputDto,
  ConsumerApplicationInputDto,
  ConsumerApplicationOutputDto,
  ConsumerApplicationStateOutputDto,
  ConsumerApplicationStateUpdateInputDto,
  ConsumerApplicationUpdateInputDto,
  ConsumerDetailsDto,
  CreateConsumerInputDto,
  CreateConsumerKycDto,
  CreateConsumerKycOutputDto,
  CreateConsumerOutputDto,
  CreateIdentityInputDto,
  CreateIdentityOutputDto,
  CreateRecoveryCodeInputDto,
  CreateRecoveryCodeOutputDto,
  FetchConsumerCreditLimitFromScoringOutputDto,
  GetFlowIdByIdentifierInputDto,
  GetFlowIdByIdentifierOutputDto,
  SendOtpInputDto,
  UpdateConsumerApplicationNationalIdOutputDto,
} from '../dto/api/consumer.dto';
import { SMSHandlerService } from '../../../services/sms/sms-handler.service';
import { ConsumerApplication } from '../models/consumer-application.entity';
import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestError,
  DuplicateError,
  GenericError,
  NotFoundError,
  ServiceUnavailableError,
} from '../../../exceptions/custom-exceptions';
import {
  KratosIdentitySchema,
  KratosService,
} from '../../../services/kratos/kratos.service';
import { MinicashService } from '../../../services/minicash/minicash.service';
import {
  ConsumerStatusFilteringService,
  ScoringEngineService,
} from '../../../services/scoring-engine/scoring-engine.service';
import { ConsumerRepository } from '../repository/consumer.repository';
import { OrkesService } from 'src/services/orkes/orkes.service';
import { TraceIdService } from 'src/common/services/trace-id.service';
import { ApplicationState, ApplicationStep, ConsumerCl, ConsumerKyc } from '../types/consumer-application.types';
import { ConsumerDetailsDTO } from '../dto/tasks/update-application-with-kyc-data.dto';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { LoggerFactory } from 'src/types/logger.interface';
import { AreaRepository } from '../repository/area.repository';

/**
 * Use case class for managing consumer.
 *
 * This class provides methods to create consumer applications along with their initial states.
 */
@Injectable()
export class ConsumerUseCase {
  private readonly logger: CustomLoggerService;

  /**
   * Initializes the `ConsumerApplicationUseCase` with the necessary dependencies.
   *
   * @param consumerApplicationRepository - The repository for managing consumer applications.
   * @param consumerApplicationStateRepository
   * @param notificationsService - The service for sending SMS notifications.
   * @param kratosService
   * @param minicashService
   * @param scoringEngineService
   * @param consumerStatusFilteringService
   * @param consumerRepository
   * @param orkesService
   * @param riskEngineService
   * @param traceIdService
   */
  constructor(
    private readonly consumerApplicationRepository: ConsumerApplicationRepository,
    private readonly consumerApplicationStateRepository: ConsumerApplicationStateRepository,
    private readonly notificationsService: SMSHandlerService,
    private readonly kratosService: KratosService,
    private readonly minicashService: MinicashService,
    private readonly scoringEngineService: ScoringEngineService,
    private readonly consumerStatusFilteringService: ConsumerStatusFilteringService,
    private readonly consumerRepository: ConsumerRepository,
    private readonly orkesService: OrkesService,
    private readonly traceIdService: TraceIdService,
    private readonly areaRepository: AreaRepository,

    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,

  ) {
    this.logger = this.loggerFactory('CreditLimitUseCase');

  }

  /**
   * Start the consumer onboarding workflow `set_passcode` for the given phone number
   * and updates the consumer application by phone number.
   *
   * @param phoneNumber - The consumer's phone number.
   * @returns A promise that resolves to the status for firing the work flow.
   */
  async startConsumerOnboarding(phoneNumber: string): Promise<string> {
    try {
      // Start the workflow
      const workflowId = await this.orkesService.startWorkflow(
        'consumer_onboarding_process',
        {
          phone_number: phoneNumber,
          traceId: this.traceIdService.getTraceId(),
        }
      );

      this.logger.log(`consumer_onboarding_process started with ID: ${workflowId}. Checking for task completion...`);

      // Check for the completion of the 'create_application' task
      const isTaskCompleted = await this.orkesService.checkTaskCompletion(workflowId, 'create_application');

      if (isTaskCompleted) {
        this.logger.log('Task create_application has been successfully completed.');
        return workflowId;
      } else {
        throw new Error('Task create_application did not complete in the expected time.');
      }
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to Start Consumer Onboarding for phone number ${phoneNumber}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException(
        'Failed to start consumer onboarding process.',
      );
    }
  }

  async createConsumer(
    createConsumerDto: CreateConsumerInputDto,
  ): Promise<CreateConsumerOutputDto> {
    const { identityId, uniqueIdentifier, createdBy } = createConsumerDto;

    this.logger.debug(
      `Creating consumer with identityId: ${identityId}, uniqueIdentifier: ${uniqueIdentifier}`,
    );

    try {
      // Create a new consumer entity
      const consumer = this.consumerRepository.createEntity({
        id: uuidv4(),
        identityId,
        uniqueIdentifier,
        createdAt: new Date(),
        createdBy: createdBy,
      });

      // Save the consumer entity to the database
      const savedConsumer = await this.consumerRepository.save(consumer);

      this.logger.debug(
        `Consumer created successfully with ID: ${savedConsumer.id}`,
      );

      // Convert to output DTO
      const responseDto = plainToClass(CreateConsumerOutputDto, savedConsumer);

      return responseDto;
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to create consumer. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException('Failed to create consumer.');
    }
  }

  /**
   * Creates a new consumer application along with its initial applicationState.
   *
   * This method initializes a consumer's application and its corresponding applicationState atomically.
   *
   * @param createAppDto - Data Transfer Object containing ConsumerApplication data.
   * @returns A promise that resolves to the newly created `ConsumerApplicationOutputDto` entity.
   *
   * @example
   * ```typescript
   * const newApplication = await consumerApplicationUseCase.createApplication(createAppDto, createAppStateDto);
   * ```
   *
   * @throws `BadRequestException` if the creation fails.
   */
  async createApplicationWithState(
    createAppDto: ConsumerApplicationInputDto,
  ): Promise<ConsumerApplicationOutputDto> {
    const { consumerId, applicationState, phoneNumber, data, createdBy } =
      createAppDto;

    this.logger.debug({
      message: `Starting creation of ConsumerApplication`,
      consumerId,
      applicationState: applicationState,
      phoneNumber,
      data,
      createdBy,
    });

    try {
      // Invoke the repository method to create application and applicationState within a transaction
      const consumerApplication =
        await this.consumerApplicationRepository.createApplicationWithState(
          createAppDto,
        );

      this.logger.debug(
        `Successfully created ConsumerApplication with ID: ${consumerApplication.id}`,
      );

      const responseDto = plainToClass(
        ConsumerApplicationOutputDto,
        consumerApplication,
      );

      return responseDto;
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to create ConsumerApplication for user: ${createdBy}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException(
        'Failed to create consumer application and its applicationState.',
      );
    }
  }

  private async updateApplication(
    consumerApplication: ConsumerApplication,
    updateAppDto: ConsumerApplicationUpdateInputDto,
  ): Promise<ConsumerApplicationOutputDto> {
    try {
      const { data, updatedBy } = updateAppDto;

      this.logger.debug({
        message: `Starting update of ConsumerApplication`,
        data,
        updatedBy,
      });

      // Merge existing data with new data
      consumerApplication.data = {
        ...consumerApplication.data,
        ...updateAppDto.data,
        consumer_kyc: {
          ...consumerApplication.data.consumer_kyc,
          ...(updateAppDto.data.consumer_kyc || {}) as ConsumerKyc // Merge consumer_kyc updates
        },
        consumer_cl: {
          ...consumerApplication.data.consumer_cl,
          ...(updateAppDto.data.consumer_cl || {}) as ConsumerCl // Merge consumer_cl updates
        }
      };
      if (updateAppDto.consumerId) {
        consumerApplication.consumerId = updateAppDto.consumerId;
      }
      consumerApplication.updatedBy = updatedBy;
      consumerApplication.updatedAt = new Date();

      this.logger.debug(`Updating ConsumerApplication entity with input ${JSON.stringify(consumerApplication)}`);

      // Update the ConsumerApplication entity
      const updatedApplication = await this.consumerApplicationRepository.update(
        consumerApplication.id,
        consumerApplication,
      );

      this.logger.debug(
        `Successfully updated ConsumerApplication with ID: ${consumerApplication.id}`,
      );

      const responseDto = plainToClass(
        ConsumerApplicationOutputDto,
        updatedApplication,
      );

      return responseDto;
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to update applicatiion  Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException(
        'Failed to update applicatiion state.',
      );
    }
  }

  /**
   * Resumes the human task `set_passcode` for the given workflow ID
   * and updates the consumer application by phone number.
   *
   * @param phoneNumber - The consumer's phone number.
   * @param updateAppDto - Data Transfer Object containing ConsumerApplication data.
   * @returns A promise that resolves to the updated `ConsumerApplicationOutputDto` entity.
   */
  async resumeSetPasscode(
    phoneNumber: string,
    updateAppDto: ConsumerApplicationUpdateInputDto,
  ): Promise<ConsumerApplicationOutputDto> {
    let workFlowId = null;
    try {
      // Fetch the existing ConsumerApplication entity by phone number
      const consumerApplication =
        await this.consumerApplicationRepository.findLatestApplicationByPhoneNumber(phoneNumber);

      if (!consumerApplication) {
        throw new NotFoundError('ConsumerApplication not found');
      }
      workFlowId = consumerApplication.data.workflow_id;
      await this.orkesService.completeHumanTaskByWorkflowId(
        workFlowId,
        'set_passcode',
        {},
      );

      // Proceed with updating the application
      return this.updateApplicationByPhoneNumber(phoneNumber, updateAppDto);
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to resume set_passcode for workflow ID: ${workFlowId}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException(
        'Failed to complete human task and update consumer application.',
      );
    }
  }

  /**
   * Resumes the human task `wait_ssn` for the given workflow ID
   * and updates the consumer application by phone number.
   *
   * @param phoneNumber - The consumer's phone number.
   * @param updateAppDto - Data Transfer Object containing ConsumerApplication data.
   * @returns A promise that resolves to the updated `ConsumerApplicationOutputDto` entity.
   */
  async resumeWaitSsn(
    phoneNumber: string,
    updateAppDto: ConsumerApplicationUpdateInputDto,
  ): Promise<UpdateConsumerApplicationNationalIdOutputDto> {
    let workFlowId = null;

    try {
      // Fetch the existing ConsumerApplication entity by phone number
      const consumerApplication =
        await this.consumerApplicationRepository.findLatestApplicationByPhoneNumber(phoneNumber);

      if (!consumerApplication) {
        throw new NotFoundError('ConsumerApplication not found');
      }
      workFlowId = consumerApplication.data.workflow_id;

      // Complete the human task in Orkes for `wait_ssn` by workflow ID
      await this.orkesService.completeHumanTaskByWorkflowId(
        workFlowId,
        'wait_ssn',
        { national_id: updateAppDto.data.consumer_kyc.ssn },
      );

      updateAppDto.data.step = ApplicationStep.MC_SUCCESS;

      // Proceed with updating the application
      await this.updateApplicationByPhoneNumber(phoneNumber, updateAppDto);
      return { success: true };
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to resume wait_ssn for workflow ID: ${workFlowId}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException(
        'Failed to complete human task and update consumer application.',
      );
    }
  }

  /**
   * Resumes the human task `wait_consumer_kyc_data` for the given workflow ID
   *
   * @param phoneNumber - The consumer's phone number.
   * @param createKycDto - Data Transfer Object containing ConsumerKyc data.
   * @returns A promise that resolves to the updated `ConsumerKycOutputDto` entity.
   */
  async resumeWaitConsumerKycData(
    phoneNumber: string,
    createKycDto: CreateConsumerKycDto,
  ): Promise<CreateConsumerKycOutputDto> {
    let workFlowId = null;

    try {
      // Fetch the existing ConsumerApplication entity by phone number
      const consumerApplication =
        await this.consumerApplicationRepository.findLatestApplicationByPhoneNumber(
          phoneNumber);

      if (!consumerApplication) {
        throw new NotFoundError('ConsumerApplication not found');
      }
      workFlowId = consumerApplication.data.workflow_id;
      const area = await this.areaRepository.getAreaWithCityAndGovernorateById(createKycDto.areaId)
      if (!area || area.cityId !== createKycDto.cityId || area.governorateId !== createKycDto.governorateId) {
        throw new BadRequestException('Area details are not valid for the given city and governorate');
      }
      this.logger.debug(`Resuming wait_consumer_kyc_data for workflow ID: ${JSON.stringify(area)}`);
      // Complete the human task in Orkes for `wait_ssn` by workflow ID
      await this.orkesService.completeHumanTaskByWorkflowId<ConsumerDetailsDTO>(
        workFlowId,
        'wait_consumer_kyc_data',
        {
          first_name: createKycDto.firstName,
          email: createKycDto.email,
          middle_name: createKycDto.middleName,
          last_name: createKycDto.lastName,
          job_type: createKycDto.jobType,
          job_title: createKycDto.jobTitle,
          company_name: createKycDto.companyName,
          house_type: createKycDto.houseType,
          marital_status: createKycDto.maritalStatus,
          car_model: createKycDto.carModel,
          car_year: createKycDto.carYear,
          primary_income: createKycDto.primaryIncome,
          governorate: area.governorate.nameEn,
          city: area.city.nameEn,
          area: area.nameEn, //createKycDto.area,
          address: createKycDto.address,
          area_id: createKycDto.areaId,
          city_id: createKycDto.cityId,
          governorate_id: createKycDto.governorateId,
          club: createKycDto.club,
          number_of_kids: createKycDto.numberOfKids,
          national_id: createKycDto.nationalId,
          mobile_os_type: createKycDto.mobileOsType,
        },
      );
      // Proceed with updating the application
      return { success: true };
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to resume wait_consumer_kyc_data for workflow ID: ${workFlowId}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException('Failed to complete human task.');
    }
  }
  /**
   * Updates an existing consumer application using the phone number.
   *
   * This method updates a consumer's application atomically without updating its applicationState.
   *
   * @param phoneNumber
   * @param updateAppDto - Data Transfer Object containing ConsumerApplication data.
   * @returns A promise that resolves to the updated `ConsumerApplicationOutputDto` entity.
   *
   * @throws `BadRequestException` if the update fails.
   */
  async updateApplicationByPhoneNumber(
    phoneNumber: string,
    updateAppDto: ConsumerApplicationUpdateInputDto,
  ): Promise<ConsumerApplicationOutputDto> {
    try {
      // Fetch the existing ConsumerApplication entity by phone number
      const consumerApplication =
        await this.consumerApplicationRepository.findLatestApplicationByPhoneNumber(phoneNumber);

      if (!consumerApplication) {
        throw new NotFoundError('ConsumerApplication not found');
      }

      return this.updateApplication(consumerApplication, updateAppDto);
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to update ConsumerApplication for phone number: ${phoneNumber}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException('Failed to update consumer application.');
    }
  }

  async updateApplicationByConsumerId(
    consumerId: string,
    updateAppDto: ConsumerApplicationUpdateInputDto,
  ): Promise<ConsumerApplicationOutputDto> {
    try {
      // Fetch the existing ConsumerApplication entity by consumer ID
      const consumerApplication =
        await this.consumerApplicationRepository.findOneBy({
          consumerId: consumerId,
        });
      if (!consumerApplication) {
        throw new NotFoundError('ConsumerApplication not found');
      }

      return this.updateApplication(consumerApplication, updateAppDto);
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to update ConsumerApplication for consumer ID: ${consumerId}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException('Failed to update consumer application.');
    }
  }

  async updateApplicationStateByConsumerId(
    consumerId: string,
    updateStateDto: ConsumerApplicationStateUpdateInputDto,
  ): Promise<ConsumerApplicationStateOutputDto> {
    try {
      // Fetch the existing ConsumerApplication entity by consumer ID
      const consumerApplication =
        await this.consumerApplicationRepository.findOneBy({
          consumerId: consumerId,
        });
      if (!consumerApplication) {
        throw new NotFoundError('ConsumerApplication not found');
      }

      // Retrieve the application ID
      const applicationId = consumerApplication.id;

      // Fetch the existing ConsumerApplicationState entity by application ID
      const consumerApplicationState =
        await this.consumerApplicationStateRepository.findOneBy({
          consumerApplicationId: applicationId,
        });
      if (!consumerApplicationState) {
        throw new NotFoundError('ConsumerApplicationState not found');
      }
      // Validate and update the application state
      try {
        consumerApplicationState.state =
          ApplicationState[updateStateDto.applicationState];
      } catch (error) {
        throw new BadRequestException('Invalid application state');
      }

      // Update the applicationState
      consumerApplicationState.createdAt = new Date();
      consumerApplicationState.createdBy = updateStateDto.createdBy;

      // Save the updated ConsumerApplicationState entity
      const updatedState = await this.consumerApplicationStateRepository.save(
        consumerApplicationState,
      );

      // Convert to output DTO
      const responseDto = plainToClass(
        ConsumerApplicationStateOutputDto,
        updatedState,
      );

      return responseDto;
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to update ConsumerApplicationState for consumer ID: ${consumerId}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException(
        'Failed to update consumer application applicationState.',
      );
    }
  }

  /**
   * Updates an existing consumer application and creates a new application state.
   *
   * @param phoneNumber - The consumer's phone number.
   * @param updateAppDto - Data Transfer Object containing ConsumerApplication data.
   * @param updateAppStateDto - Data Transfer Object containing ConsumerApplicationState data.
   * @returns A promise that resolves to the updated `ConsumerApplicationOutputDto` entity.
   */
  async updateApplicationWithState(
    phoneNumber: string,
    updateAppDto: ConsumerApplicationUpdateInputDto,
    updateAppStateDto: ConsumerApplicationStateUpdateInputDto,
    manager?: EntityManager
  ): Promise<ConsumerApplicationOutputDto> {
    this.logger.debug(
      `Updating ConsumerApplication and creating new ConsumerApplicationState for phone number: ${phoneNumber}`,
    );

    try {
      // Call the repository method to update application and create applicationState within a transaction
      const consumerApplication =
        await this.consumerApplicationRepository.updateApplicationWithState(
          phoneNumber,
          updateAppDto,
          updateAppStateDto,
          manager
        );

      this.logger.debug(
        `Successfully updated ConsumerApplication with ID: ${consumerApplication.id}`,
      );

      const responseDto = plainToClass(
        ConsumerApplicationOutputDto,
        consumerApplication,
      );

      return responseDto;
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to update ConsumerApplication for phone number: ${phoneNumber}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException(
        'Failed to update consumer application and create new applicationState.',
      );
    }
  }

  async createIdentity(
    createIdentityDto: CreateIdentityInputDto,
  ): Promise<CreateIdentityOutputDto> {
    const { phoneNumber } = createIdentityDto;

    this.logger.debug(`Creating identity for phone number: ${phoneNumber}`);

    try {
      const identityId = await this.kratosService.createIdentity(
        KratosIdentitySchema.PHONE,
        phoneNumber,
      );

      if (!identityId) {
        throw new GenericError('Failed to create identity');
      }

      this.logger.debug(`Identity created successfully with ID: ${identityId}`);

      // Convert to output DTO
      const responseDto: CreateIdentityOutputDto = { identityId };

      return responseDto;
    } catch (error) {
      if (error instanceof DuplicateError) {
        throw new BadRequestException('Identity already exists');
      } else {
        throw new GenericError('Failed to create identity');
      }
    }
  }

  async createRecoveryCodeByIdentityId(
    createRecoveryCodeInputDto: CreateRecoveryCodeInputDto,
  ): Promise<CreateRecoveryCodeOutputDto> {
    const { identityId } = createRecoveryCodeInputDto;
    this.logger.debug(`Creating recovery code for identity ID: ${identityId}`);

    try {
      const recoveryCodeResponse =
        await this.kratosService.createRecoveryCode(identityId);

      if (!recoveryCodeResponse) {
        throw new GenericError('Failed to create recovery code');
      }

      this.logger.debug(
        `Recovery code created successfully for identity ID: ${identityId}`,
      );
      const responseDto: CreateRecoveryCodeOutputDto = {
        flowId: recoveryCodeResponse.flow_id,
        recoveryCode: recoveryCodeResponse.recovery_code,
      };
      return responseDto;
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to create recovery code for identity ID: ${identityId}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException('Failed to create recovery code');
    }
  }

  async getFlowIdByIdentifier(
    getFlowIdByIdentifierInputDto: GetFlowIdByIdentifierInputDto,
  ): Promise<GetFlowIdByIdentifierOutputDto> {
    const { phoneNumber } = getFlowIdByIdentifierInputDto;
    this.logger.debug(`Fetching flow ID for phone number: ${phoneNumber}`);

    try {
      const flowId =
        await this.kratosService.getFlowIdByIdentifier(phoneNumber);

      if (!flowId) {
        throw new GenericError('Failed to retrieve flow ID');
      }

      this.logger.debug(
        `Flow ID retrieved successfully for phone number: ${phoneNumber}`,
      );

      const responseDto: GetFlowIdByIdentifierOutputDto = { flowId };

      return responseDto;
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to retrieve flow ID for phone number: ${phoneNumber}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException('Failed to retrieve flow ID');
    }
  }

  /**
   * Fetches consumer details from Minicash service using either national ID or phone number.
   *
   * This method retrieves consumer details from the Minicash service by first authenticating
   * and then fetching the data based on the provided national ID or phone number.
   *
   * @param {string} identifier - The national ID or phone number of the consumer.
   * @param {boolean} isNationalId - Flag indicating whether the identifier is a national ID.
   * @returns {Promise<ConsumerDetailsDto>} The consumer details.
   * @throws {ServiceUnavailableError} If the Minicash service is unavailable.
   * @throws {BadRequestError} If the identifier is invalid or not provided.
   */
  async fetchConsumerDetailsFromMC(
    identifier: string,
    isNationalId: boolean,
  ): Promise<ConsumerDetailsDto> {
    this.logger.debug(
      `Fetching consumer details from Minicash, identifier: ${identifier}, isNationalId: ${isNationalId}`,
    );

    if (!identifier) {
      throw new BadRequestError('Identifier must be provided');
    }

    try {
      let consumerData;
      if (isNationalId) {
        consumerData =
          await this.minicashService.getConsumerMinicashDataByNationalId(
            identifier,
          );
      } else {
        consumerData =
          await this.minicashService.getConsumerMinicashDataByPhoneNumber(
            identifier,
          );
      }

      this.logger.debug(
        `Consumer details fetched successfully from Minicash for identifier: ${identifier}`,
      );

      // Convert the consumer data to ConsumerDetailsDto
      const consumerDetailsDto = plainToClass(ConsumerDetailsDto, consumerData);

      return consumerDetailsDto;
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to fetch consumer details from Minicash for identifier: ${identifier}. Error: ${error.message}`,
          errorStack: error.stack,
        }

      );
      throw new ServiceUnavailableError(
        'Failed to fetch consumer details from Minicash. Please try again later.',
      );
    }
  }
  /**
   * Fetches consumer credit limit from the Scoring Engine service using either phone number or SSN.
   *
   * @param {string} identifier - The phone number or national id of the consumer.
   * @param {boolean} isNationalId - Flag indicating whether the identifier is an SSN.
   * @returns {Promise<any>} The consumer's credit limit data.
   * @throws {ServiceUnavailableError} If the Scoring Engine service is unavailable.
   * @throws {BadRequestError} If the identifier is invalid or not provided.
   */
  async fetchConsumerCreditLimitFromScoring(
    identifier: string,
    isNationalId: boolean,
  ): Promise<any> {
    this.logger.debug(
      `Fetching consumer credit limit from Scoring Engine, identifier: ${identifier}, isNationalId: ${isNationalId}`,
    );

    if (!identifier) {
      throw new BadRequestError('Identifier must be provided');
    }

    try {
      let creditLimitData;
      if (isNationalId) {
        creditLimitData =
          await this.scoringEngineService.getConsumerCreditLimit(
            undefined,
            identifier,
          );
      } else {
        creditLimitData =
          await this.scoringEngineService.getConsumerCreditLimit(identifier);
      }

      this.logger.debug(
        `Consumer credit limit fetched successfully from Scoring Engine for identifier: ${identifier}`,
      );

      return creditLimitData;
    } catch (error) {
      if (error instanceof DuplicateError) {
        this.logger.error(
          `Duplicate error encountered for identifier: ${identifier}`,
        );
        throw new DuplicateError('Duplicate consumer found');
      } else {
        this.logger.error(
          {
            message: `Failed to fetch consumer credit limit from Scoring Engine for identifier: ${identifier}. Error: ${error.message}`,
            errorStack: error.stack,
          }
        );
        throw new ServiceUnavailableError(
          'Failed to fetch consumer credit limit from Scoring Engine. Please try again later.',
        );
      }
    }
  }

  /**
   * Assigns consumer status and parses credit limit, then updates the consumer application data.
   *
   * This method takes in a DTO containing consumer credit limit information, assigns a consumer status
   * based on the provided data, parses the credit limit, and updates the consumer application data
   * in the repository without overriding existing data.
   *
   * @param {FetchConsumerCreditLimitFromScoringOutputDto} inputDto - The input DTO containing consumer credit limit information.
   * @throws {NotFoundError} If the consumer application is not found.
   * @throws {BadRequestException} If the update operation fails.
   */
  async assignConsumerStatusAndCL(
    inputDto: FetchConsumerCreditLimitFromScoringOutputDto,
  ): Promise<AssignConsumerStatusAndCLOutputDto> {
    const { creditLimit, classification, status, creationDate, phoneNumber } =
      inputDto;

    try {
      // Assign consumer status
      const consumerStatus =
        this.consumerStatusFilteringService.assignConsumerStatus(
          creditLimit,
          classification,
          status,
          creationDate,
        );

      // Parse credit limit
      const parsedCreditLimit =
        this.consumerStatusFilteringService.parseCreditLimit(creditLimit);

      // Create and populate the output DTO
      const outputDto = new AssignConsumerStatusAndCLOutputDto();
      outputDto.status = consumerStatus;
      outputDto.creditLimit = parsedCreditLimit;

      return outputDto;
    } catch (error) {
      this.logger.error(
        {
          message: `Failed to update consumer application for phone number: ${phoneNumber}. Error: ${error.message}`,
          errorStack: error.stack,
        }
      );
      throw new BadRequestException('Failed to update consumer application.');
    }
  }

  async sendOtp(sendOtpDto: SendOtpInputDto): Promise<boolean> {
    this.logger.debug(`Sending OTP to ${sendOtpDto.phoneNumber}`);
    try {
      // Send OTP via SMS
      await this.notificationsService.sendSms(
        sendOtpDto.phoneNumber,
        sendOtpDto.otpCode,
        'consumer',
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error sending OTP to ${sendOtpDto.phoneNumber}: ${error.message}`,
      );
      throw new BadRequestException('Failed to send OTP');
    }
  }

}
