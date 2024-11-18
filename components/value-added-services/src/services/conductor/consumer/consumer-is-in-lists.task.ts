import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Injectable, Inject } from '@nestjs/common';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { ConsumerUseCase } from 'src/domain/consumer/use-cases/consumer-use-case';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { settings } from 'config/settings';
import { ApplicationState, ApplicationStep } from 'src/domain/consumer/types/consumer-application.types';
import { ConsumerStatus } from 'src/domain/consumer/types/consumer.types';
import { SanctionType } from 'src/domain/consumer/types/sanction-list.types';
import { ConsumerDetailsDTO } from 'src/domain/consumer/dto/tasks/update-application-with-kyc-data.dto';
import { Type } from 'class-transformer';

class ConsumerIsInListsInputDTO {

  @IsEnum(SanctionType)
  @IsNotEmpty()
  sacntiion_list_type: SanctionType

  @IsString()
  @IsOptional()
  sanction_list_consumer_national_id: string

  @IsString()
  @IsNotEmpty()
  sanction_list_consumer_name: string

  @IsString()
  @IsNotEmpty()
  phone_number: string

  @IsObject()
  @ValidateNested()
  @Type(() => ConsumerDetailsDTO)
  consumer_details: ConsumerDetailsDTO
}

class ConsumerIsInListsOutputDTO {
  success: boolean;
}

@Injectable()
export class ConsumerIsInListsWorker implements ConductorWorker {
  taskDefName = 'consumer_is_in_lists';
  pollInterval = settings.conductor.pollingInterval;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUseCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(ConsumerIsInListsWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`consumer_is_in_lists\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        ConsumerIsInListsInputDTO,
        task.inputData,
      );

      // change application state to blocked
      this.consumerUseCase.updateApplicationWithState(inputDto.phone_number, {
        updatedBy: `worker-task#${this.taskDefName}`,
        data: {
          application_status: ApplicationState.BLOCKED,
          step: inputDto.sacntiion_list_type === SanctionType.TerroristsList ?
            ApplicationStep.RISK_ENGINE_VALIDATION_TERRORIST : ApplicationStep.RISK_ENGINE_VALIDATION_SANCTION,
          consumer_status: ConsumerStatus.BLOCKED,
        }

      }, {
        createdBy: `worker-task#${this.taskDefName}`,
        applicationState: ApplicationState.BLOCKED,
      });

      // Prepare output DTO
      const outputDTO = new ConsumerIsInListsOutputDTO();
      outputDTO.success = true;

      this.logger.debug(
        `\`consumer_is_in_lists\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`consumer_is_in_lists\` task: ${error.message}`,
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
