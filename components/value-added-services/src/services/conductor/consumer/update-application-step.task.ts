import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { ConsumerUseCase } from '../../../domain/consumer/use-cases/consumer-use-case';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import {
  ConsumerApplicationOutputDto,
  ConsumerApplicationUpdateInputDto,
} from '../../../domain/consumer/dto/api/consumer.dto';
import { ApplicationStep } from 'src/domain/consumer/types/consumer-application.types';
import { settings } from 'config/settings';

/**
 * Input DTO for the `update_application_step` task.
 */
class UpdateApplicationStepInputDTO {
  @IsString()
  @IsNotEmpty()
  step: any;

  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

/**
 * Output DTO for the `update_application_step` task.
 */
class UpdateApplicationStepOutputDTO {
  success: boolean;
}

@Injectable()
export class UpdateApplicationStepWorker implements ConductorWorker {
  taskDefName = 'update_application_step';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUserCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(UpdateApplicationStepWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`update_application_step\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        UpdateApplicationStepInputDTO,
        task.inputData,
      );

      const { step, phone_number } = inputDto;

      const applicationDto: ConsumerApplicationUpdateInputDto = {
        data: {
          step: ApplicationStep[step],
        },
        updatedBy: `worker-task#${this.taskDefName}`,
      };

      // Invoke the use-case to handle business logic
      await this.consumerUserCase.updateApplicationByPhoneNumber(
        phone_number,
        applicationDto,
      );

      // Prepare output DTO
      const outputDTO = new UpdateApplicationStepOutputDTO();
      outputDTO.success = true;

      this.logger.debug(
        `\`update_application_step\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`update_application_step\` task: ${error.message}`,
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
