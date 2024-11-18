// credit-limit.repository.spec.ts
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { CreditLimitRepository } from '../../../../src/domain/consumer/repository/credit-limit.repository';
import { UsedCreditLimitRepository } from '../../../../src/domain/consumer/repository/used-credit-limit.repository';
import { ConsumerCreditLimit } from '../../../../src/domain/consumer/models/credit-limit.entity';
import { UsedConsumerCreditLimit } from '../../../../src/domain/consumer/models/used-credit-limit.entity';
import { createTestingModule } from '../../../utils/test-utils';

describe('CreditLimitRepository', () => {
  let dataSource: DataSource;
  let creditLimitRepository: CreditLimitRepository;
  let usedCreditLimitRepository: UsedCreditLimitRepository;

  beforeAll(async () => {
    const entities = [ConsumerCreditLimit, UsedConsumerCreditLimit];
    const providers = [CreditLimitRepository, UsedCreditLimitRepository];

    const moduleRef = await createTestingModule(entities, providers);

    dataSource = moduleRef.get<DataSource>(DataSource);
    creditLimitRepository = moduleRef.get<CreditLimitRepository>(
      CreditLimitRepository,
    );
    usedCreditLimitRepository = moduleRef.get<UsedCreditLimitRepository>(
      UsedCreditLimitRepository,
    );

    // Mock the Logger methods to prevent actual logging during tests
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => { });
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => { });
  });

  afterAll(async () => {
    // Close the database connection
    await dataSource.destroy();
    // The container will be stopped by the global teardown
  });

  afterEach(async () => {
    // Clean up database between tests
    await dataSource.getRepository(UsedConsumerCreditLimit).delete({});
    await dataSource.getRepository(ConsumerCreditLimit).delete({});
  });

  describe('findLatestByConsumerId', () => {
    it('should return null when no credit limit exists for the consumer', async () => {
      const consumerId = 'consumer-123';

      const result =
        await creditLimitRepository.findLatestByConsumerId(consumerId);

      expect(result).toBeNull();
    });

    it('should return the latest credit limit for the consumer', async () => {
      const consumerId = 'consumer-123';

      // Insert two credit limits with different activeSince dates
      const creditLimit1 = creditLimitRepository.createEntity({
        consumerId,
        availableCreditLimit: 100,
        activeSince: new Date('2023-01-01'),
        createdAt: new Date('2023-01-01'),
      });

      const creditLimit2 = creditLimitRepository.createEntity({
        consumerId,
        availableCreditLimit: 200,
        activeSince: new Date('2023-02-01'),
        createdAt: new Date('2023-02-01'),
      });

      await creditLimitRepository.save(creditLimit1);
      await creditLimitRepository.save(creditLimit2);

      const result =
        await creditLimitRepository.findLatestByConsumerId(consumerId);

      expect(result).not.toBeNull();
      expect(result?.availableCreditLimit).toBe(200);
      expect(result.activeSince).toEqual(new Date('2023-02-01'));
    });
  });

  describe('createCreditLimitAndUsedCreditLimit', () => {
    it('should create a new credit limit and used credit limit for a new consumer', async () => {
      const consumerId = 'consumer-123';
      const usedCredit = 500;

      const result =
        await creditLimitRepository.createCreditLimitAndUsedCreditLimit(
          consumerId,
          usedCredit,
        );

      expect(result).not.toBeNull();
      expect(result.consumerId).toBe(consumerId);
      expect(result.availableCreditLimit).toBe(usedCredit);

      // Verify that the used credit limit was also created
      const usedCredits = await usedCreditLimitRepository.findAll();
      expect(usedCredits.length).toBe(1);
      expect(usedCredits[0].consumerId).toBe(consumerId);
      expect(usedCredits[0].usedCredit).toBe(usedCredit);
    });

    it('should throw BadRequestException when credit limit already exists', async () => {
      const consumerId = 'consumer-123';
      const usedCredit = 500;

      // First, create a credit limit for the consumer
      await creditLimitRepository.createCreditLimitAndUsedCreditLimit(
        consumerId,
        usedCredit,
      );

      // Attempt to create another credit limit for the same consumer
      await expect(
        creditLimitRepository.createCreditLimitAndUsedCreditLimit(
          consumerId,
          usedCredit,
        ),
      ).rejects.toThrow(
        'Credit limit already exists for this consumer. Please update the credit limit instead.',
      );
    });
  });

  describe('updateCreditLimitAndUsedCreditLimit', () => {
    it('should update the credit limit when usedCredit is positive and less than maxLimit', async () => {
      const consumerId = 'consumer-123';
      const initialCredit = 500;
      const usedCredit = 200;

      // First, create a credit limit for the consumer
      await creditLimitRepository.createCreditLimitAndUsedCreditLimit(
        consumerId,
        initialCredit,
      );

      // Update the credit limit
      const result =
        await creditLimitRepository.updateCreditLimitAndUsedCreditLimit(
          consumerId,
          usedCredit,
        );

      expect(result).not.toBeNull();
      expect(result.consumerId).toBe(consumerId);
      expect(result.availableCreditLimit).toBe(initialCredit - usedCredit);

      // Verify that the used credit limit was logged
      const usedCredits = await usedCreditLimitRepository.findAll();
      expect(usedCredits.length).toBe(2); // Initial and update
      expect(usedCredits[1].usedCredit).toBe(usedCredit);
    });

    it('should throw BadRequestException when no credit limit exists for the consumer', async () => {
      const consumerId = 'consumer-123';
      const usedCredit = 100;

      await expect(
        creditLimitRepository.updateCreditLimitAndUsedCreditLimit(
          consumerId,
          usedCredit,
        ),
      ).rejects.toThrow('No credit limit found for this consumer.');
    });

    it('should throw BadRequestException when usedCredit exceeds maxLimit', async () => {
      const consumerId = 'consumer-123';
      const initialCredit = 100;
      const usedCredit = 200;

      // Create initial credit limit
      await creditLimitRepository.createCreditLimitAndUsedCreditLimit(
        consumerId,
        initialCredit,
      );

      // Attempt to update with usedCredit exceeding maxLimit
      await expect(
        creditLimitRepository.updateCreditLimitAndUsedCreditLimit(
          consumerId,
          usedCredit,
        ),
      ).rejects.toThrow('Credit limit exceeded available credit limit.');
    });

    it('should refund credit when usedCredit is negative', async () => {
      const consumerId = 'consumer-123';
      const initialCredit = 300;
      const refundCredit = -50;

      // Create initial credit limit
      await creditLimitRepository.createCreditLimitAndUsedCreditLimit(
        consumerId,
        initialCredit,
      );

      // Update the credit limit with a refund
      const result =
        await creditLimitRepository.updateCreditLimitAndUsedCreditLimit(
          consumerId,
          refundCredit,
        );

      expect(result).not.toBeNull();
      expect(result.consumerId).toBe(consumerId);
      expect(result.availableCreditLimit).toBe(initialCredit + Math.abs(refundCredit));

      // Verify that the used credit limit was logged
      const usedCredits = await usedCreditLimitRepository.findAll();
      expect(usedCredits.length).toBe(2); // Initial and refund
      expect(usedCredits[1].usedCredit).toBe(refundCredit);
    });
  });
});
