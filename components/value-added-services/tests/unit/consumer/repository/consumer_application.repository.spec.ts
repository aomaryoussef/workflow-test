import { DataSource } from 'typeorm';
import { Logger, BadRequestException } from '@nestjs/common';
import { ConsumerApplication } from '../../../../src/domain/consumer/models/consumer_application.entity';
import { ConsumerApplicationState } from '../../../../src/domain/consumer/models/consumer_application_state.entity';
import { createTestingModule } from '../../../utils/test-utils';
import {
  ConsumerApplicationInputDto,
  ApplicationState,
} from '../../../../src/domain/consumer/dto/consumer.dto';
import {
  ConsumerApplicationRepository,
  ConsumerApplicationStateRepository,
} from '../../../../src/domain/consumer/repository/consumer-application.repository';

describe('ConsumerApplicationRepository', () => {
  let dataSource: DataSource;
  let consumerApplicationRepository: ConsumerApplicationRepository;
  let consumerApplicationStateRepository: ConsumerApplicationStateRepository;

  beforeAll(async () => {
    const entities = [ConsumerApplication, ConsumerApplicationState];
    const providers = [
      ConsumerApplicationRepository,
      {
        provide: ConsumerApplicationStateRepository,
        useClass: ConsumerApplicationStateRepository, // Explicitly provide the repository class
      },
    ];

    const moduleRef = await createTestingModule(entities, providers);

    dataSource = moduleRef.get<DataSource>(DataSource);
    consumerApplicationRepository =
      moduleRef.get<ConsumerApplicationRepository>(
        ConsumerApplicationRepository,
      );
    consumerApplicationStateRepository =
      moduleRef.get<ConsumerApplicationStateRepository>(
        ConsumerApplicationStateRepository,
      );

    // Mock the Logger methods to prevent actual logging during tests
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    await dataSource.getRepository(ConsumerApplicationState).delete({});
    await dataSource.getRepository(ConsumerApplication).delete({});
  });

  describe('createApplicationWithState', () => {
    it('should create a ConsumerApplication and its corresponding ConsumerApplicationState', async () => {
      const createAppDto: ConsumerApplicationInputDto = {
        consumerId: 'consumer-123',
        data: { someData: 'value' },
        createdBy: 'test-user',
      };

      const result =
        await consumerApplicationRepository.createApplicationWithState(
          createAppDto,
        );

      expect(result).not.toBeNull();
      expect(result.consumerId).toBe(createAppDto.consumerId);
      expect(result.data).toEqual(createAppDto.data);
      expect(result.createdBy).toBe(createAppDto.createdBy);

      const savedStates = await consumerApplicationStateRepository.findAll();
      expect(savedStates.length).toBe(1);
      expect(savedStates[0].consumerApplicationId).toBe(result.id);
      expect(savedStates[0].state).toBe(ApplicationState.IN_PROGRESS);
    });

    it('should throw BadRequestException if the creation fails', async () => {
      // Mock the save method to throw an error to simulate a failure
      jest
        .spyOn(consumerApplicationRepository, 'save')
        .mockRejectedValueOnce(new Error('Save failed'));

      const createAppDto: ConsumerApplicationInputDto = {
        consumerId: 'consumer-123',
        data: { someData: 'value' },
        createdBy: 'test-user',
      };

      await expect(
        consumerApplicationRepository.createApplicationWithState(createAppDto),
      ).rejects.toThrow(BadRequestException);

      jest.restoreAllMocks();
    });
  });
});
