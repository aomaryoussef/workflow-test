import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { CreateConsumerProfileUseCaseInputDto } from '../../../domain/consumer/dto/api/consumer.dto';
import { settings } from 'config/settings';
import { ConsumerProfileUseCase } from 'src/domain/consumer/use-cases/consumer-profile.use-case';

class CreateUserProfileEntityInputDTO {
  @IsString()
  @IsNotEmpty()
  consumer_id: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

class CreateUserProfileEntityOutputDTO {
  success: boolean;
}

@Injectable()
export class CreateConsumerUserProfileEntityWorker implements ConductorWorker {
  taskDefName = 'create_user_profile';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerProfileUseCase: ConsumerProfileUseCase,

    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(
      CreateConsumerUserProfileEntityWorker.name,
    );
  }

  @WithTraceId()
  async execute(
    task: Task,
  ): Promise<WorkerResponse<CreateUserProfileEntityOutputDTO>> {
    this.logger.debug(
      `Starting \`create_user_profile\` with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        CreateUserProfileEntityInputDTO,
        task.inputData,
      );

      const createConsumerInput = new CreateConsumerProfileUseCaseInputDto();
      createConsumerInput.consumerId = inputDto.consumer_id;
      createConsumerInput.phoneNumber = inputDto.phone_number;
      createConsumerInput.createdBy = `worker-task#${this.taskDefName}`;

      const result =
        await this.consumerProfileUseCase.createConsumerProfile(createConsumerInput);
      // Prepare output DTO
      const outputDTO = new CreateUserProfileEntityOutputDTO();
      outputDTO.success = result.success;

      this.logger.debug(
        `\`create_user_profile\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(`Error in \`create_user_profile\`: ${error.message}`);

      return {
        status: TaskStatusEnum.FAILED,
        reasonForIncompletion: error.message || 'Unknown error',
        logs: [
          {
            log: JSON.stringify(error),
            createdTime: new Date().getTime(),
          },
        ],
      };
    }
  }
}
