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
  ConsumerApplicationInputDto,
  ConsumerApplicationOutputDto,
} from '../../../domain/consumer/dto/api/consumer.dto';
import { ApplicationState, ApplicationStep } from 'src/domain/consumer/types/consumer-application.types';
import { settings } from '../../../../config/settings';

/**
 * Input DTO for the `create_application` task.
 */
class CreateApplicationInputDTO {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  workflow_id: string;

}

/**
 * Output DTO for the `create_application` task.
 */
class CreateApplicationOutputDTO {
  application_id: string;
  consumer_details: any;
}

@Injectable()
export class CreateApplicationWorker implements ConductorWorker {
  taskDefName = 'create_application';
  pollInterval = settings.conductor.pollingInterval;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUserCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(CreateApplicationWorker.name);
  }

  @WithTraceId()
  async execute(
    task: Task,
  ): Promise<WorkerResponse<CreateApplicationOutputDTO>> {
    this.logger.debug(
      `Starting \`create_application\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        CreateApplicationInputDTO,
        task.inputData,
      );

      const dataObj = {
        phone_number: inputDto.phone_number,
        workflow_id: inputDto.workflow_id,
        application_status: ApplicationState.IN_PROGRESS,
        step: ApplicationStep.CREATED,
        consumer_kyc: {},
        consumer_cl: {},
      };

      const applicationDto: ConsumerApplicationInputDto = {
        phoneNumber: inputDto.phone_number,
        data: dataObj,
        createdBy: `worker-task#${this.taskDefName}`,
      };

      // Invoke the use-case to handle business logic
      const applicationResponseDto: ConsumerApplicationOutputDto =
        await this.consumerUserCase.createApplicationWithState(applicationDto);

      // Prepare output DTO
      const outputDTO = new CreateApplicationOutputDTO();
      outputDTO.application_id = applicationResponseDto.id;
      outputDTO.consumer_details = applicationResponseDto.data;

      this.logger.debug(
        `\`create_application\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`create_application\` task: ${error.message}`,
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
