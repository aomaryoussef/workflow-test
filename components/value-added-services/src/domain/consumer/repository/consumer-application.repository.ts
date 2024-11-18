import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { ConsumerApplication } from '../models/consumer-application.entity';
import { ConsumerApplicationState } from '../models/consumer-application-state.entity';
import {
  ConsumerApplicationInputDto,
  ConsumerApplicationStateUpdateInputDto,
  ConsumerApplicationUpdateInputDto,
} from '../dto/api/consumer.dto';
import { LoggerFactory } from 'src/types/logger.interface';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { ApplicationState, ConsumerCl, ConsumerKyc } from '../types/consumer-application.types';

@Injectable()
export class ConsumerApplicationStateRepository extends BaseRepository<ConsumerApplicationState> {
  private readonly logger: CustomLoggerService; // Logger for the service

  constructor(
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
    @InjectRepository(ConsumerApplicationState)
    private readonly consumerApplicationStateRepo: Repository<ConsumerApplicationState>,
  ) {
    super(consumerApplicationStateRepo);
    this.logger = this.loggerFactory(ConsumerApplicationStateRepository.name);
  }
}

@Injectable()
export class ConsumerApplicationRepository extends BaseRepository<ConsumerApplication> {
  private readonly logger: CustomLoggerService; // Logger for the service

  constructor(
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
    @InjectRepository(ConsumerApplication)
    private readonly consumerApplicationRepository: Repository<ConsumerApplication>,
    private readonly dataSource: DataSource,
    private readonly consumerApplicationStateRepository: ConsumerApplicationStateRepository,
  ) {
    super(consumerApplicationRepository);
    this.logger = this.loggerFactory(ConsumerApplicationRepository.name);
  }

  /**
   * Creates a ConsumerApplication and its corresponding ConsumerApplicationState within a transaction.
   *
   * @param createAppDto - Data Transfer Object containing ConsumerApplication data.
   * @returns The created ConsumerApplication entity.
   *
   * @throws BadRequestException if the creation fails.
   *
   * @example
   * ```typescript
   * const newApp = await consumerApplicationRepository.createApplicationWithState(createAppDto);
   * ```
   */
  async createApplicationWithState(
    createAppDto: ConsumerApplicationInputDto,
  ): Promise<ConsumerApplication> {
    this.logger.debug(
      'Starting transaction to create ConsumerApplication and ConsumerApplicationState',
    );

    try {
      return await this.dataSource.transaction(
        async (manager: EntityManager) => {
          // create uuid4 for the application
          const application_id: string = uuidv4();

          // Manually create the ConsumerApplication entity
          const consumerApplication = new ConsumerApplication();
          consumerApplication.id = application_id;
          consumerApplication.consumerId = createAppDto.consumerId;
          consumerApplication.phoneNumber = createAppDto.phoneNumber;
          consumerApplication.data = createAppDto.data;
          consumerApplication.createdBy = createAppDto.createdBy;
          consumerApplication.createdAt = new Date();

          this.logger.debug('Creating ConsumerApplication entity');

          // Save the ConsumerApplication within the transaction
          const savedApplication = await this.save(
            consumerApplication,
            manager,
          );

          this.logger.debug(
            `ConsumerApplication created with ID: ${savedApplication.id}`,
          );

          // Manually create the ConsumerApplicationState entity
          const consumerApplicationState = new ConsumerApplicationState();
          consumerApplicationState.id = uuidv4();
          consumerApplicationState.consumerApplicationId = application_id;
          consumerApplicationState.activeSince = new Date();
          consumerApplicationState.state = ApplicationState.IN_PROGRESS;
          consumerApplicationState.createdAt = new Date();
          consumerApplicationState.createdBy = createAppDto.createdBy;

          this.logger.debug('Creating ConsumerApplicationState entity');

          // Save the ConsumerApplicationState within the transaction
          await this.consumerApplicationStateRepository.save(
            consumerApplicationState,
            manager,
          );

          this.logger.debug(
            `ConsumerApplicationState created successfully with ID: ${consumerApplicationState.id}`,
          );

          return savedApplication;
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to create ConsumerApplication and ConsumerApplicationState: ${error}`,
      );
      throw new BadRequestException(
        'Failed to create application and its applicationState',
      );
    }
  }

  async updateApplicationWithState(
    phoneNumber: string,
    updateAppDto: ConsumerApplicationUpdateInputDto,
    updateAppStateDto: ConsumerApplicationStateUpdateInputDto,
    manager?: EntityManager
  ): Promise<ConsumerApplication> {
    this.logger.debug(
      'Starting process to update ConsumerApplication and create new ConsumerApplicationState',
    );
    const executeTransaction = async (entityManager: EntityManager) => {
      // Fetch the existing ConsumerApplication by phone number
      const consumerApplication =
        await this.findLatestApplicationByPhoneNumber(phoneNumber, entityManager);

      if (!consumerApplication) {
        throw new BadRequestException('ConsumerApplication not found');
      }

      // Update the ConsumerApplication entity
      consumerApplication.data = {
        ...consumerApplication.data,
        ...updateAppDto.data,
        consumer_kyc: {
          ...consumerApplication.data.consumer_kyc,
          ...(updateAppDto.data.consumer_kyc || {}) as ConsumerKyc, // Merge consumer_kyc updates
        },
        consumer_cl: {
          ...consumerApplication.data.consumer_cl,
          ...(updateAppDto.data.consumer_cl || {}) as ConsumerCl, // Merge consumer_cl updates
        },
      };
      consumerApplication.updatedBy = updateAppDto.updatedBy;
      consumerApplication.updatedAt = new Date();

      this.logger.debug('Updating ConsumerApplication entity');

      // Save the updated ConsumerApplication within the transaction
      const updatedApplication = await this.save(consumerApplication, entityManager);

      this.logger.debug(
        `ConsumerApplication updated with ID: ${updatedApplication.id}`,
      );

      // Check if applicationState is provided and not empty
      if (updateAppStateDto.applicationState) {
        const consumerApplicationState = new ConsumerApplicationState();
        consumerApplicationState.id = uuidv4();
        consumerApplicationState.consumerApplicationId = updatedApplication.id;
        consumerApplicationState.activeSince = new Date();
        consumerApplicationState.state = updateAppStateDto.applicationState;
        consumerApplicationState.createdAt = new Date();
        consumerApplicationState.createdBy = updateAppDto.updatedBy;

        this.logger.debug('Creating new ConsumerApplicationState entity');

        // Save the new ConsumerApplicationState within the transaction
        await this.consumerApplicationStateRepository.save(consumerApplicationState, entityManager);

        this.logger.debug(
          `New ConsumerApplicationState created successfully with ID: ${consumerApplicationState.id}`,
        );
      } else {
        this.logger.debug(
          'No new ConsumerApplicationState created, applicationState is empty',
        );
      }

      return updatedApplication;
    };

    try {
      if (manager) {
        // Use the provided manager directly (no transaction management)
        return await executeTransaction(manager);
      } else {
        // Create a new transaction if no manager is provided
        return await this.dataSource.transaction(
          async (newManager: EntityManager) => {
            return await executeTransaction(newManager);
          },
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to update ConsumerApplication and create new ConsumerApplicationState: ${error}`,
      );
      throw new BadRequestException(
        'Failed to update application and create new applicationState',
      );
    }
  }
  async findLatestApplicationByPhoneNumber(
    phoneNumber: string,
    manager?: EntityManager
  ): Promise<ConsumerApplication> {

    try {
      this.logger.debug(
        `Starting findLatestApplicationByPhoneNumber for phone ${phoneNumber}`,
      );
      return await this.getQueryBuilder('consumerApplication', manager)
        .leftJoin('consumerApplication.applicationStates', 'applicationState')
        .where('consumerApplication.phoneNumber = :phoneNumber', { phoneNumber })
        .orderBy('applicationState.activeSince', 'DESC')
        .limit(1)
        .getOne();

    } catch (error) {
      this.logger.error(
        `Failed findLatestApplicationByPhoneNumber for phone ${phoneNumber} with error: ${JSON.stringify(error)}`,
      );
      throw new BadRequestException(
        'Failed to create application and its applicationState',
      );
    }
  }
}
