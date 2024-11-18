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
 * Input DTO for the `update_application_with_mc_data` task.
 */
class UpdateApplicationWithMCDataInputDTO {
  // check why @IsJSON() is not working
  @IsNotEmpty()
  consumer_cl: any;

  @IsNotEmpty()
  mc_output: any;

  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

/**
 * Output DTO for the `update_application_with_mc_data` task.
 */
class UpdateApplicationWithMCDataOutputDTO {
  success: boolean;
}

@Injectable()
export class UpdateApplicationWithMCDataWorker implements ConductorWorker {
  taskDefName = 'update_application_with_mc_data';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUserCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(UpdateApplicationWithMCDataWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`update_application_with_mc_data\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        UpdateApplicationWithMCDataInputDTO,
        task.inputData,
      );

      const { consumer_cl, mc_output, phone_number } = inputDto;

      const dataObj = {
        step: ApplicationStep.COMPLETED,
        consumer_cl: consumer_cl,
        consumer_kyc: mc_output.consumerDetails,
      };

      const applicationDto: ConsumerApplicationUpdateInputDto = {
        data: dataObj,
        updatedBy: `worker-task#${this.taskDefName}`,
      };

      // Invoke the use-case to handle business logic
      const applicationResponseDto: ConsumerApplicationOutputDto =
        await this.consumerUserCase.updateApplicationByPhoneNumber(
          phone_number,
          applicationDto,
        );

      // Prepare output DTO
      const outputDTO = new UpdateApplicationWithMCDataOutputDTO();
      outputDTO.success = true;

      this.logger.debug(
        `\`update_application_with_mc_data\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`update_application_with_mc_data\` task: ${error.message}`,
      );

      return {
        status: TaskStatusEnum.FAILED,
        reasonForIncompletion: error.message || 'Unknown error',
      };
    }
  }
}
