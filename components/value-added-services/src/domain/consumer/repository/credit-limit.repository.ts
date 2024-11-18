import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ConsumerCreditLimit } from '../models/credit-limit.entity';
import { BaseRepository } from '../../common/repository/base.repository';
import { UsedCreditLimitRepository } from './used-credit-limit.repository';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { LoggerFactory } from '../../../types/logger.interface';

/**
 * Repository class for managing `ConsumerCreditLimit` entities.
 * Extends the `BaseRepository` to inherit common CRUD operations.
 * This repository includes methods for specific operations related to consumer credit limits,
 * including transaction management and coordination with `UsedCreditLimitRepository`.
 */
@Injectable()
export class CreditLimitRepository extends BaseRepository<ConsumerCreditLimit> {
  private readonly logger: CustomLoggerService;

  /**
   * Initializes the `CreditLimitRepository` with the necessary dependencies.
   * @param consumerCreditLimitRepository - The TypeORM repository for `ConsumerCreditLimit`.
   * @param dataSource - The TypeORM `DataSource` for database connections and transactions.
   * @param usedCreditLimitRepository - Repository for managing `UsedConsumerCreditLimit` entities.
   */
  constructor(
    @InjectRepository(ConsumerCreditLimit)
    private readonly consumerCreditLimitRepository: Repository<ConsumerCreditLimit>,
    private readonly dataSource: DataSource,
    private readonly usedCreditLimitRepository: UsedCreditLimitRepository,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    super(consumerCreditLimitRepository);
    this.logger = this.loggerFactory(CreditLimitRepository.name);
  }

  /**
   * Finds the latest `ConsumerCreditLimit` for a given consumer, ordered by `activeSince` descending.
   *
   * This method retrieves the most recent credit limit record for the specified consumer.
   * Supports optional transaction via `EntityManager`.
   *
   * @param consumerId - The ID of the consumer.
   * @param manager - Optional `EntityManager` for transactional operations.
   * @returns A promise that resolves to the latest `ConsumerCreditLimit` or `null` if not found.
   *
   * @example
   * ```typescript
   * const latestCreditLimit = await creditLimitRepository.findLatestByConsumerId('consumer123');
   * ```
   */
  async findLatestByConsumerId(
    consumerId: string,
    manager?: EntityManager,
  ): Promise<ConsumerCreditLimit | null> {
    this.logger.debug(`Logging findLatestByConsumerId: ${consumerId}`);
    const repo = manager
      ? manager.getRepository(ConsumerCreditLimit)
      : this.consumerCreditLimitRepository;
    return await repo.findOne({
      where: { consumerId: consumerId },
      order: { activeSince: 'DESC' },
    });
  }

  async createCreditLimitAndUsedCreditLimit(
    consumerId: string,
    newCredit: number,
    manager?: EntityManager
  ): Promise<ConsumerCreditLimit> {
    try {
      this.logger.debug({
        messege: `Starting to create credit limit for consumer: ${consumerId}, newCredit: ${newCredit}`,
        consumerId: consumerId,
      });
      // Fetch the latest credit limit for the consumer within the transaction
      const latestCreditLimit = await this.findLatestByConsumerId(
        consumerId,
        manager,
      );

      if (latestCreditLimit) {
        this.logger.debug(
          `Credit limit already exists for consumer: ${consumerId}`,
        );
        throw new BadRequestException(
          'Credit limit already exists for this consumer. Please update the credit limit instead.',
        );
      }

      // Log credit funding
      this.logger.debug(
        `Credit funded: ${newCredit} for consumer ${consumerId}`,
      );

      // Create and save the used credit transaction
      const usedCreditTransaction =
        this.usedCreditLimitRepository.createEntity({
          id: uuidv4(),
          consumerId: consumerId,
          usedCredit: -newCredit,
          createdAt: new Date(),
        });

      this.logger.debug(
        `Logging the used credit transaction for consumer: ${consumerId}, newCredit: ${newCredit}`,
      );

      await this.usedCreditLimitRepository.save(
        usedCreditTransaction,
        manager,
      );

      // Create and save the new credit limit
      const newCreditLimit = this.createEntity({
        id: uuidv4(),
        consumerId: consumerId,
        maxCreditLimit: newCredit,
        availableCreditLimit: newCredit,
        activeSince: new Date(),
        createdAt: new Date(),
      });

      await this.save(newCreditLimit, manager);

      this.logger.debug(
        `Successfully created credit limit for consumer: ${consumerId}. New max limit: ${newCredit}`,
      );

      return newCreditLimit;

    } catch (error) {
      // Log the error
      this.logger.error(
        `Failed to create credit limit for consumer: ${consumerId}. Error: ${error.message}`,
      );

      // Rethrow the error to be handled by higher-level code
      throw error;
    }
  }
  /**
   * Updates the credit limit and logs the used credit limit for a consumer within a transaction.
   *
   * This method performs the following operations atomically:
   * - Fetches the latest credit limit for the consumer.
   * - Validates the used credit against the current max limit.
   * - Creates a new `UsedConsumerCreditLimit` record.
   * - Creates a new `ConsumerCreditLimit` record with the updated max limit.
   *
   * Includes error handling to log failures during the transaction.
   *
   * @param consumerId - The ID of the consumer.
   * @param usedCredit - The amount of credit used (positive to deduct, negative to refund).
   * @returns A promise that resolves to the updated `ConsumerCreditLimit`.
   *
   * @throws `BadRequestException` if no credit limit is found or if the used credit exceeds the available limit.
   *
   * @example
   * ```typescript
   * const updatedCreditLimit = await creditLimitRepository.updateCreditLimitAndUsedCreditLimit('consumer123', -100);
   * ```
   */
  async updateCreditLimitAndUsedCreditLimit(
    consumerId: string,
    usedCredit: number,
  ): Promise<ConsumerCreditLimit> {
    this.logger.debug({
      message: `Starting to update credit limit for consumer: ${consumerId}, usedCredit: ${usedCredit}`,
      consumerId: consumerId,
    });

    try {
      return await this.dataSource.transaction(
        async (manager: EntityManager) => {
          // Fetch the latest credit limit for the consumer within the transaction
          const latestCreditLimit = await this.findLatestByConsumerId(
            consumerId,
            manager,
          );

          if (!latestCreditLimit) {
            this.logger.debug(
              `No credit limit found for consumer: ${consumerId}`,
            );
            throw new BadRequestException(
              'No credit limit found for this consumer.',
            );
          }

          // Calculate the new max limit based on usedCredit
          let updatedMaxLimit: number;
          let usedCreditWithoutFractions = usedCredit
          if (usedCredit > 0) {
            // If positive, deduct the used credit from the max limit
            if (latestCreditLimit.availableCreditLimit < usedCredit) {
              this.logger.debug(
                `Credit limit exceeded for consumer: ${consumerId}, availableCreditLimit: ${latestCreditLimit.availableCreditLimit}, usedCredit: ${usedCredit}`,
              );
              throw new BadRequestException(
                'Credit limit exceeded available credit limit.',
              );
            }
            usedCreditWithoutFractions = Math.floor(usedCredit / 100) * 100;
            updatedMaxLimit =
              latestCreditLimit.availableCreditLimit - usedCreditWithoutFractions;
            this.logger.debug(
              `Used credit: ${usedCreditWithoutFractions}. Deducting from max limit. Updated max available limit: ${updatedMaxLimit}`,
            );
          } else {
            // If negative, add the used credit back to the max limit
            usedCreditWithoutFractions = Math.ceil(usedCredit / 100) * 100;
            updatedMaxLimit =
              latestCreditLimit.availableCreditLimit + Math.abs(usedCreditWithoutFractions);
            this.logger.debug(
              `Credit refunded: ${usedCreditWithoutFractions}. Adding back to max limit. Updated max available limit: ${updatedMaxLimit}`,
            );
          }

          // Create and save the used credit transaction
          const usedCreditTransaction =
            this.usedCreditLimitRepository.createEntity({
              consumerId: consumerId,
              usedCredit: usedCreditWithoutFractions,
              createdAt: new Date(),
            });

          this.logger.debug(
            `Logging the used credit transaction for consumer: ${consumerId}, usedCredit: ${usedCreditWithoutFractions}`,
          );

          await this.usedCreditLimitRepository.save(
            usedCreditTransaction,
            manager,
          );

          // Create and save the new credit limit
          const newCreditLimit = this.createEntity({
            consumerId: consumerId,
            maxCreditLimit: latestCreditLimit.maxCreditLimit,
            availableCreditLimit: updatedMaxLimit,
            activeSince: new Date(),
            createdAt: new Date(),
          });

          await this.save(newCreditLimit, manager);

          this.logger.debug(
            `Successfully updated credit limit for consumer: ${consumerId}. New max limit: ${updatedMaxLimit}`,
          );

          return newCreditLimit;
        },
      );
    } catch (error) {
      // Log the error
      this.logger.error(
        `Failed to update credit limit for consumer: ${consumerId}. Error: ${error.message}`,
      );

      // Rethrow the error to be handled by higher-level code
      throw error;
    }
  }
}
