import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { CreditLimitRepository } from '../../../../src/domain/consumer/repository/credit-limit.repository';
import { UsedCreditLimitRepository } from '../../../../src/domain/consumer/repository/used-credit-limit.repository';
import { CreditLimitUseCase } from '../../../../src/domain/consumer/use-cases/credit-limit.use-case';
import { ConsumerCreditLimit } from '../../../../src/domain/consumer/models/credit-limit.entity';
import { UsedConsumerCreditLimit } from '../../../../src/domain/consumer/models/used-credit-limit.entity';
import { createTestingModule } from '../../../utils/test-utils';
import { CreateOrUpdateCreditLimitDto } from '../../../../src/domain/consumer/dto/credit-limit.dto';

describe('CreditLimitUseCase', () => {
  let dataSource: DataSource;
  let creditLimitRepository: CreditLimitRepository;
  let usedCreditLimitRepository: UsedCreditLimitRepository;
  let creditLimitUseCase: CreditLimitUseCase;

  beforeAll(async () => {
    const entities = [ConsumerCreditLimit, UsedConsumerCreditLimit];
    const providers = [
      CreditLimitRepository,
      UsedCreditLimitRepository,
      CreditLimitUseCase,
    ];

    const moduleRef = await createTestingModule(entities, providers);

    dataSource = moduleRef.get<DataSource>(DataSource);
    creditLimitRepository = moduleRef.get<CreditLimitRepository>(
      CreditLimitRepository,
    );
    usedCreditLimitRepository = moduleRef.get<UsedCreditLimitRepository>(
      UsedCreditLimitRepository,
    );
    creditLimitUseCase = moduleRef.get<CreditLimitUseCase>(CreditLimitUseCase);

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

  describe('createCreditLimit', () => {
    it('should create a new credit limit for a new consumer', async () => {
      const dto: CreateOrUpdateCreditLimitDto = {
        consumerId: 'consumer-123',
        usedCredit: 500,
      };

      const result = await creditLimitUseCase.createCreditLimit(dto);

      expect(result).not.toBeNull();
      expect(result.consumerId).toBe(dto.consumerId);
      expect(result.availableCreditLimit).toBe(dto.usedCredit);

      // Verify that the used credit limit was also created
      const usedCredits = await usedCreditLimitRepository.findAll();
      expect(usedCredits.length).toBe(1);
      expect(usedCredits[0].consumerId).toBe(dto.consumerId);
      expect(usedCredits[0].usedCredit).toBe(dto.usedCredit);
    });

    it('should throw BadRequestException when credit limit already exists', async () => {
      const dto: CreateOrUpdateCreditLimitDto = {
        consumerId: 'consumer-123',
        usedCredit: 500,
      };

      // First, create a credit limit for the consumer
      await creditLimitUseCase.createCreditLimit(dto);

      // Attempt to create another credit limit for the same consumer
      await expect(creditLimitUseCase.createCreditLimit(dto)).rejects.toThrow(
        'Credit limit already exists for this consumer. Please update the credit limit instead.',
      );
    });
  });

  describe('updateCreditLimit', () => {
    it('should throw BadRequestException when no credit limit exists for the consumer', async () => {
      const dto: CreateOrUpdateCreditLimitDto = {
        consumerId: 'consumer-123',
        usedCredit: 100,
      };

      // Ensure there is no credit limit for the consumer
      const creditLimit = await creditLimitRepository.findLatestByConsumerId(
        dto.consumerId,
      );
      expect(creditLimit).toBeNull();

      await expect(creditLimitUseCase.updateCreditLimit(dto)).rejects.toThrow(
        'No credit limit found for this consumer.',
      );
    });

    it('should throw BadRequestException when usedCredit exceeds maxLimit', async () => {
      const dto: CreateOrUpdateCreditLimitDto = {
        consumerId: 'consumer-123',
        usedCredit: 200,
      };

      // Create initial credit limit with maxLimit 100
      await creditLimitUseCase.createCreditLimit({
        consumerId: dto.consumerId,
        usedCredit: 100,
      });

      await expect(creditLimitUseCase.updateCreditLimit(dto)).rejects.toThrow(
        'Credit limit exceeded available credit limit.',
      );
    });

    it('should successfully update credit limit when usedCredit is positive and less than maxLimit', async () => {
      const dto: CreateOrUpdateCreditLimitDto = {
        consumerId: 'consumer-123',
        usedCredit: 50,
      };

      // Create initial credit limit with maxLimit 100
      await creditLimitUseCase.createCreditLimit({
        consumerId: dto.consumerId,
        usedCredit: 100,
      });

      const result = await creditLimitUseCase.updateCreditLimit(dto);

      expect(result).not.toBeNull();
      expect(result.consumerId).toBe(dto.consumerId);
      expect(result.availableCreditLimit).toBe(50); // 100 - 50

      // Verify that the used credit limit was logged
      const usedCredits = await usedCreditLimitRepository.findAll();
      expect(usedCredits.length).toBe(2); // Initial and update
      expect(usedCredits[1].usedCredit).toBe(dto.usedCredit);
    });

    it('should successfully update credit limit when usedCredit is negative (refund)', async () => {
      const dto: CreateOrUpdateCreditLimitDto = {
        consumerId: 'consumer-123',
        usedCredit: -30,
      };

      // Create initial credit limit with maxLimit 70
      await creditLimitUseCase.createCreditLimit({
        consumerId: dto.consumerId,
        usedCredit: 70,
      });

      const result = await creditLimitUseCase.updateCreditLimit(dto);

      expect(result).not.toBeNull();
      expect(result.consumerId).toBe(dto.consumerId);
      expect(result.maxCreditLimit).toBe(100); // 70 + 30

      // Verify that the used credit limit was logged
      const usedCredits = await usedCreditLimitRepository.findAll();
      expect(usedCredits.length).toBe(2); // Initial and refund
      expect(usedCredits[1].usedCredit).toBe(dto.usedCredit);
    });

    it('should roll back transaction and rethrow error if an exception occurs', async () => {
      const dto: CreateOrUpdateCreditLimitDto = {
        consumerId: 'consumer-123',
        usedCredit: 50,
      };

      // Create initial credit limit with maxLimit 100
      await creditLimitUseCase.createCreditLimit({
        consumerId: dto.consumerId,
        usedCredit: 100,
      });

      // Mock the save method to throw an error
      jest
        .spyOn(creditLimitRepository, 'save')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(creditLimitUseCase.updateCreditLimit(dto)).rejects.toThrow(
        'Database error',
      );

      // Verify that the transaction was rolled back
      const creditLimit = await creditLimitRepository.findLatestByConsumerId(
        dto.consumerId,
      );
      expect(creditLimit.maxLimit).toBe(100); // Should not have changed

      // Restore the original save method
      jest.restoreAllMocks();
    });
  });

  describe('getLatestCreditLimitByConsumerId', () => {
    it('should return null when no credit limit exists for the consumer', async () => {
      const consumerId = 'consumer-123';

      const result =
        await creditLimitUseCase.getLatestCreditLimitByConsumerId(consumerId);

      expect(result).toBeNull();
    });

    it('should return the latest credit limit for the consumer', async () => {
      const consumerId = 'consumer-123';

      // Create initial credit limit
      await creditLimitUseCase.createCreditLimit({
        consumerId,
        usedCredit: 100,
      });

      // Introduce a 1-second delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update credit limit
      await creditLimitUseCase.updateCreditLimit({
        consumerId,
        usedCredit: 40,
      });

      const result =
        await creditLimitUseCase.getLatestCreditLimitByConsumerId(consumerId);

      expect(result).not.toBeNull();
      expect(result.consumerId).toBe(consumerId);
      expect(result?.availableCreditLimit).toBe(60); // 100 - 40

      // Verify that the activeSince date is the latest
      const allCreditLimits = await creditLimitRepository.findAll();
      const latestCreditLimit = allCreditLimits.reduce((latest, current) =>
        latest.activeSince > current.activeSince ? latest : current,
      );
      expect(result.activeSince).toEqual(latestCreditLimit.activeSince);
    });
  });
});
