import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { ConsumerUseCase } from '../../../domain/consumer/use-cases/consumer-use-case';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import {
  ConsumerApplicationOutputDto,
} from '../../../domain/consumer/dto/api/consumer.dto';
import { ApplicationState } from 'src/domain/consumer/types/consumer-application.types';
import { settings } from 'config/settings';

/**
 * Input DTO for the `create_application` task.
 */
class UpdateApplicationWithConsumerIdInputDTO {
  @IsString()
  @IsNotEmpty()
  state: ApplicationState;

  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

/**
 * Output DTO for the `create_application` task.
 */
class UpdateApplicationStateOutputDTO {
  application_id: string;
}

@Injectable()
export class UpdateApplicationStateWorker implements ConductorWorker {
  taskDefName = 'update_application_state';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUserCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(UpdateApplicationStateWorker.name);
  }

  @WithTraceId()
  async execute(
    task: Task,
  ): Promise<WorkerResponse<UpdateApplicationStateOutputDTO>> {
    this.logger.debug(
      `Starting \`update_application_state\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        UpdateApplicationWithConsumerIdInputDTO,
        task.inputData,
      );

      // Invoke the use-case to handle business logic
      const applicationResponseDto: ConsumerApplicationOutputDto =
        await this.consumerUserCase.updateApplicationWithState(inputDto.phone_number, {
          updatedBy: `worker-task#${this.taskDefName}`,
          data: {
            application_status: ApplicationState.FAILED,
          }
        },
          {
            createdBy: `worker-task#${this.taskDefName}`,
            applicationState: ApplicationState.FAILED
          });

      // Prepare output DTO
      const outputDTO = new UpdateApplicationStateOutputDTO();
      outputDTO.application_id = applicationResponseDto.id;
      this.logger.debug(
        `\`update_application_state\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`update_application_state\` task: ${error.message}`,
      );

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
