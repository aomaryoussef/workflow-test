import { Inject, Injectable } from '@nestjs/common';
import { ConsumerCreditLimit } from '../models/credit-limit.entity';
import { CreateOrUpdateCreditLimitDto } from '../dto/api/credit-limit.dto';
import { CreditLimitRepository } from '../repository/credit-limit.repository';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { LoggerFactory } from '../../../types/logger.interface';
import { EntityManager, DataSource } from 'typeorm';

/**
 * Use case class for managing consumer credit limits.
 *
 * This class provides methods to create and update consumer credit limits.
 * - The `createCreditLimit` method is intended for initializing a consumer's credit limit when they are onboarded.
 * - The `updateCreditLimit` method is used for subsequent transactions after the consumer has been onboarded.
 */
@Injectable()
export class CreditLimitUseCase {
  private readonly logger: CustomLoggerService;

  /**
   * Initializes the `CreditLimitUseCase` with the necessary dependencies.
   *
   * @param creditLimitRepository - The repository for managing consumer credit limits.
   */
  constructor(private readonly creditLimitRepository: CreditLimitRepository,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
    private readonly dataSource: DataSource,

  ) {
    this.logger = this.loggerFactory('CreditLimitUseCase');
  }

  /**
   * Updates the consumer's credit limit based on usage or refunds.
   *
   * This method should be called for user transactions after the consumer has been onboarded.
   * It adjusts the consumer's existing credit limit by deducting used credit or adding refunded credit.
   *
   * @param createCreditLimitDto - Data transfer object containing `consumerId` and `usedCredit`.
   * @returns A promise that resolves to the updated `ConsumerCreditLimit` entity.
   *
   * @example
   * ```typescript
   * const updatedCreditLimit = await CreditLimitUseCase.updateCreditLimit({
   *   consumerId: 'consumer123',
   *   usedCredit: -100, // Refund of 100 units
   * });
   * ```
   */
  async updateCreditLimit(
    createCreditLimitDto: CreateOrUpdateCreditLimitDto,
  ): Promise<ConsumerCreditLimit> {
    const { consumerId, usedCredit } = createCreditLimitDto;

    return await this.creditLimitRepository.updateCreditLimitAndUsedCreditLimit(
      consumerId,
      usedCredit,
    );
  }

  /**
   * Creates a new credit limit for the consumer during onboarding.
   *
   * This method should be called only once when the consumer is first onboarded.
   * It initializes the consumer's credit limit and logs the initial used credit.
   *
   * @param createCreditLimitDto - Data transfer object containing `consumerId` and `usedCredit`.
   * @returns A promise that resolves to the newly created `ConsumerCreditLimit` entity.
   *
   * @example
   * ```typescript
   * const newCreditLimit = await CreditLimitUseCase.createCreditLimit({
   *   consumerId: 'consumer123',
   *   usedCredit: 500, // Initial credit limit of 500 units
   * });
   * ```
   *
   * @throws `BadRequestException` if a credit limit already exists for the consumer.
   */
  async createCreditLimit(
    createCreditLimitDto: CreateOrUpdateCreditLimitDto,
  ): Promise<ConsumerCreditLimit> {
    const { consumerId, usedCredit } = createCreditLimitDto;
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      return await this.creditLimitRepository.createCreditLimitAndUsedCreditLimit(
        consumerId,
        usedCredit,
        manager
      );
    })
  }
  /**
   * Retrieves the latest credit limit for a given consumer.
   *
   * This method fetches the most recent `ConsumerCreditLimit` record for the specified consumer,
   * ordered by `activeSince` in descending order. It returns the latest credit limit or `null`
   * if no credit limit is found for the consumer.
   *
   * @param consumerId - The unique identifier of the consumer.
   * @returns A promise that resolves to the latest `ConsumerCreditLimit` entity or `null` if not found.
   *
   * @example
   * ```typescript
   * const latestCreditLimit = await createCreditLimitUseCase.getLatestCreditLimitByConsumerId('consumer123');
   * if (latestCreditLimit) {
   *   console.log(`Consumer's max limit is ${latestCreditLimit.maxLimit}`);
   * } else {
   *   console.log('No credit limit found for this consumer.');
   * }
   * ```
   */
  async getLatestCreditLimitByConsumerId(
    consumerId: string,
  ): Promise<ConsumerCreditLimit | null> {
    this.logger.debug(
      `Logging get latest credit limit for consumer: ${consumerId}`,
    );
    return this.creditLimitRepository.findLatestByConsumerId(consumerId);
  }
}
