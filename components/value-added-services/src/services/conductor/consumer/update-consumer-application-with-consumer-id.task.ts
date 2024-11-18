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
import { ApplicationState, ApplicationStep } from 'src/domain/consumer/types/consumer-application.types';
import { settings } from 'config/settings';

/**
 * Input DTO for the `create_application` task.
 */
class UpdateApplicationWithConsumerIdInputDTO {
  @IsString()
  @IsNotEmpty()
  consumer_id: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  workflow_id: string;

  @IsString()
  @IsNotEmpty()
  flow_id: string;
}

/**
 * Output DTO for the `create_application` task.
 */
class UpdateApplicationWithConsumerIdOutputDTO {
  application_id: string;
  consumer_details: any;
}

@Injectable()
export class UpdateApplicationWithConsumerIdWorker implements ConductorWorker {
  taskDefName = 'update_application_with_consumer_id';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUserCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(UpdateApplicationWithConsumerIdWorker.name);
  }

  @WithTraceId()
  async execute(
    task: Task,
  ): Promise<WorkerResponse<UpdateApplicationWithConsumerIdOutputDTO>> {
    this.logger.debug(
      `Starting \`update_application_with_consumer_id\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        UpdateApplicationWithConsumerIdInputDTO,
        task.inputData,
      );

      // Invoke the use-case to handle business logic
      const applicationResponseDto: ConsumerApplicationOutputDto =
        await this.consumerUserCase.updateApplicationByPhoneNumber(inputDto.phone_number, {
          updatedBy: `worker-task#${this.taskDefName}`,
          consumerId: inputDto.consumer_id,
          data: {
            flow_id: inputDto.flow_id,
            step: ApplicationStep.OTP_VALIDATION,
            application_status: ApplicationState.IN_PROGRESS,
          }
        });

      // Prepare output DTO
      const outputDTO = new UpdateApplicationWithConsumerIdOutputDTO();
      outputDTO.application_id = applicationResponseDto.id;
      outputDTO.consumer_details = applicationResponseDto.data;

      this.logger.debug(
        `\`update_application_with_consumer_id\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`update_application_with_consumer_id\` task: ${error.message}`,
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
