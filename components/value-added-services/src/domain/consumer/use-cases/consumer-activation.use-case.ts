import { DataSource, EntityManager } from 'typeorm';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { TraceIdService } from 'src/common/services/trace-id.service';
import { OrkesService } from 'src/services/orkes/orkes.service';
import { UsedCreditLimitRepository } from '../repository/used-credit-limit.repository';
import { LegacyConsumerRepository } from '../repository/legacy-consumer.repository';
import { ConsumerRepository } from '../repository/consumer.repository';
import { CreditLimitRepository } from '../repository/credit-limit.repository';
import { LoggerFactory } from 'src/types/logger.interface';
import {
  ActivateConsumerDto,
  ActivateConsumerOutputDto,
  RejectConsumerDto,
  RejectConsumerOutputDto,
} from '../dto/api/consumer.dto';
import { ConsumerStatus } from '../types/consumer.types';
import { ConsumerStateRepository } from '../repository/consumer-state.repository';
import { NotFoundError } from 'src/exceptions/custom-exceptions';
import { plainToClass } from 'class-transformer';
import { LegacyConsumer } from '../models/legacy-consumer.entity';
import { ConsumerState } from '../models/consumer-state.entity';
import { ConsumerKYCRepository } from '../repository/consumer-kyc.repository';

@Injectable()
export class ConsumerActivationUseCase {
  private readonly logger: CustomLoggerService;

  /**
   * Initializes the `ConsumerActivationState` with the necessary dependencies.
   * @param consumerCreditLimitRepository
   * @param consumerRepository
   * @param legacyConsumerRepository
   * @param consumerStateRepository
   * @param usedCreditLimitRepository
   * @param orkesService
   * @param traceIdService
   * @param dataSource
   */
  constructor(
    private readonly consumerCreditLimitRepository: CreditLimitRepository,
    private readonly consumerRepository: ConsumerRepository,
    private readonly consumerKycRepository: ConsumerKYCRepository,
    private readonly legacyConsumerRepository: LegacyConsumerRepository,
    private readonly consumerStateRepository: ConsumerStateRepository,
    private readonly usedCreditLimitRepository: UsedCreditLimitRepository,
    private readonly orkesService: OrkesService,
    private readonly traceIdService: TraceIdService,
    private readonly dataSource: DataSource,

    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory('ConsumerActivationUseCase');
  }

  async activateConsumer(
    consumerId: string,
    activateConsumerDto: ActivateConsumerDto,
  ): Promise<ActivateConsumerOutputDto> {
    try {
      const { branchName, creditLimit, creditOfficerIamIad, comment } =
        activateConsumerDto;

      return await this.dataSource.transaction(
        async (manager: EntityManager) => {
          // Fetch the existing Consumer entity by consumer ID
          const consumer: LegacyConsumer =
            await this.legacyConsumerRepository.findOneBy(
              {
                id: consumerId,
              },
              manager,
            );

          if (!consumer) {
            throw new NotFoundError('Consumer not found');
          }

          const todayDay = new Date().getDate();
          const singlePaymentDay = Math.floor(todayDay / 3.3) + 1;
          consumer.activatedAt = new Date();
          consumer.activatedByIamId = creditOfficerIamIad;
          consumer.status = ConsumerStatus.ACTIVE;
          consumer.activationBranch = branchName;
          consumer.singlePaymentDay = singlePaymentDay;

          await this.legacyConsumerRepository.update(
            consumerId,
            consumer,
            manager,
          );

          // create a new record in consumer_state
          if (consumer.originationChannel === 'mylo') {
            const newConsumer = await this.consumerRepository.findOneBy(
              {
                id: consumerId,
              },
              manager,
            );

            if (!newConsumer) {
              throw new NotFoundError('New Consumer not found');
            }
            await this.consumerKycRepository
              .getRepository(manager)
              .update({ consumerId }, { singlePaymentDay });
            await this.updateConsumerState(
              consumerId,
              {
                state: ConsumerStatus.ACTIVE,
                activeSince: new Date(),
                createdBy: creditOfficerIamIad,
                branch: branchName,
                comment,
              },
              manager,
            );
          }

          // credit limit update
          await this.updateConsumerCreditLimit(
            consumerId,
            creditLimit,
            manager,
          );

          // start the consumer_onboarding workflow

          if (consumer.originationChannel === 'minicash') {
            await this.startLegacyConsumerOnBoarding(consumerId);
          }
          const outputDto = plainToClass(ActivateConsumerOutputDto, consumer);
          outputDto.creditLimit = creditLimit;

          return outputDto;
        },
      );
    } catch (error) {
      this.logger.error({
        message: `Failed to activate consumer for consumer ID: ${consumerId}. Error: ${error.message}`,
        errorStack: error.stack,
      });
      throw new BadRequestException('Failed to activate consumer');
    }
  }

  async rejectConsumer(
    consumerId: string,
    rejectConsumerDto: RejectConsumerDto,
  ): Promise<RejectConsumerOutputDto> {
    try {
      return await this.dataSource.transaction(
        async (manager: EntityManager) => {
          // Fetch the existing Consumer entity by consumer ID
          const consumer: LegacyConsumer =
            await this.legacyConsumerRepository.findOneBy(
              {
                id: consumerId,
              },
              manager,
            );

          if (!consumer) {
            throw new NotFoundError('Consumer not found');
          }

          consumer.status = ConsumerStatus.REJECTED;
          consumer.activationBranch = rejectConsumerDto.branchName;

          await this.legacyConsumerRepository.update(
            consumerId,
            consumer,
            manager,
          );

          // create a new record in consumer_state
          const newConsumer = await this.consumerRepository.findOneBy(
            {
              id: consumerId,
            },
            manager,
          );

          if (!newConsumer) {
            throw new NotFoundError('New Consumer not found');
          }

          const newState = await this.updateConsumerState(
              consumerId,
              {
                state: ConsumerStatus.REJECTED,
                branch: rejectConsumerDto.branchName,
                createdBy: rejectConsumerDto.creditOfficerIamIad,
                comment: rejectConsumerDto.comment,
                activeSince: new Date(),
              },
              manager,
            ),
            output = new RejectConsumerOutputDto(newState);
          return output;
        },
      );
    } catch (error) {
      this.logger.error({
        message: `Failed to activate consumer for consumer ID: ${consumerId}. Error: ${error.message}`,
        errorStack: error.stack,
      });
      throw new BadRequestException('Failed to activate consumer');
    }
  }
  private async updateConsumerState(
    consumerId: string,
    consumerState: Partial<ConsumerState>,
    manager: EntityManager,
  ) {
    try {
      const newConsumerEntity = this.consumerStateRepository.createEntity({
        ...consumerState,
        consumerId,
      });

      return await this.consumerStateRepository.save(
        newConsumerEntity,
        manager,
      );
    } catch (error) {
      this.logger.error({
        message: `Failed to save consumer state for consumer ID: ${consumerId}. Error: ${error.message}`,
        errorStack: error.stack,
      });
      throw new BadRequestException('Failed to save consumer state');
    }
  }

  private async updateConsumerCreditLimit(
    consumerId: string,
    creditLimit: number,
    manager: EntityManager,
  ) {
    try {
      const latestCreditLimit =
        await this.consumerCreditLimitRepository.findLatestByConsumerId(
          consumerId,
          manager,
        );

      if (!latestCreditLimit) {
        throw new NotFoundError(
          'latest credit limit not found for that consumer',
        );
      }

      const newCreditLimitEntity =
        this.consumerCreditLimitRepository.createEntity({
          consumerId,
          maxCreditLimit: creditLimit,
          availableCreditLimit: creditLimit,
          activeSince: new Date(),
        });

      this.consumerCreditLimitRepository.save(newCreditLimitEntity, manager);

      // update used credit limit
      await this.updateConsumerUsedCreditLimit(
        consumerId,
        creditLimit,
        latestCreditLimit.maxCreditLimit,
        manager,
      );
    } catch (error) {
      this.logger.error({
        message: `Failed to update consumer credit limit for consumer ID: ${consumerId}. Error: ${error.message}`,
        errorStack: error.stack,
      });
      throw new BadRequestException('Failed to update consumer credit limit');
    }
  }

  private async updateConsumerUsedCreditLimit(
    consumerId: string,
    creditLimit: number,
    maxCreditLimit: number,
    manager: EntityManager,
  ) {
    try {
      const calculatedUsedCreditLimit = -1 * (creditLimit - maxCreditLimit);

      const newConsumerUsedCreditLimitEntity =
        this.usedCreditLimitRepository.createEntity({
          consumerId,
          usedCredit: calculatedUsedCreditLimit,
          createdAt: new Date(),
        });

      this.usedCreditLimitRepository.save(
        newConsumerUsedCreditLimitEntity,
        manager,
      );
    } catch (error) {
      this.logger.error({
        message: `Failed to update consumer used credit limit for consumer ID: ${consumerId}. Error: ${error.message}`,
        errorStack: error.stack,
      });
      throw new BadRequestException(
        'Failed to update consumer used credit limit',
      );
    }
  }

  /**
   * Start the consumer onboarding workflow `consumer_onboarding` for the given consumer id
   * @param consumerId - The consumer id
   * @returns A promise that resolves to the status for firing the work flow.
   */
  private async startLegacyConsumerOnBoarding(
    consumerId: string,
  ): Promise<string> {
    try {
      // Start the workflow
      const workflowId = await this.orkesService.startWorkflow(
        'consumer_onboarding',
        {
          consumer_id: consumerId,
          traceId: this.traceIdService.getTraceId(),
        },
      );

      this.logger.log(
        `consumer_onboarding started with ID: ${workflowId}. Checking for task completion...`,
      );

      return workflowId;
    } catch (error) {
      this.logger.error({
        message: `Failed to Start Consumer Onboarding for consumer Id ${consumerId}. Error: ${error.message}`,
        errorStack: error.stack,
      });
      throw new BadRequestException('Failed to start consumer onboarding');
    }
  }
}
