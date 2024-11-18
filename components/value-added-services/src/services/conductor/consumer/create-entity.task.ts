import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { ConsumerUseCase } from '../../../domain/consumer/use-cases/consumer-use-case';
import { settings } from '../../../../config/settings';

class CreateEntityInputDTO {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  identity_id: string;
}

class CreateEntityOutputDTO {
  consumer_id: string;
}

@Injectable()
export class CreateEntityWorker implements ConductorWorker {
  taskDefName = 'create_entity';
  pollInterval = settings.conductor.pollingInterval;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUseCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(CreateEntityWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<WorkerResponse<CreateEntityOutputDTO>> {
    this.logger.debug(
      `Starting \`create_entity\` with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        CreateEntityInputDTO,
        task.inputData,
      );

      // Invoke the use-case to handle business logic
      const createConsumerDto = {
        identityId: inputDto.identity_id,
        createdBy: `worker-task#${this.taskDefName}`,
      };
      const consumer =
        await this.consumerUseCase.createConsumer(createConsumerDto);

      // Prepare output DTO
      const outputDTO = new CreateEntityOutputDTO();
      outputDTO.consumer_id = consumer.id;

      this.logger.debug(
        `\`create_entity\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(`Error in \`create_entity\`: ${error.message}`);

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
