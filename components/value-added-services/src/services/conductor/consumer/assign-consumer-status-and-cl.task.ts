import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Injectable, Inject } from '@nestjs/common';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { ConsumerUseCase } from 'src/domain/consumer/use-cases/consumer-use-case';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { settings } from 'config/settings';

class AssignConsumerStatusAndCLInputDTO {
  @IsOptional()
  scoring_by_phone: any;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsOptional()
  scoring_by_national_id: any;
}

class AssignConsumerStatusAndCLOutputDTO {
  status: string;
  credit_limit: number;
}

@Injectable()
export class AssignConsumerStatusAndCLWorker implements ConductorWorker {
  taskDefName = 'assign_consumer_status_and_cl';
  pollInterval = settings.conductor.pollingInterval;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUseCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(AssignConsumerStatusAndCLWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`assign_consumer_status_and_cl\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        AssignConsumerStatusAndCLInputDTO,
        task.inputData,
      );

      let scoringData = {} as {
        credit_limit: number;
        classification: string;
        status: string;
        creation_date: string;
      };
      if (inputDto.scoring_by_phone) {
        scoringData = inputDto.scoring_by_phone;
      } else if (inputDto.scoring_by_national_id) {
        scoringData = inputDto.scoring_by_national_id;
      } else {
        throw new Error('No scoring data provided');
      }

      // Invoke the use case to handle business logic
      const { status, creditLimit } =
        await this.consumerUseCase.assignConsumerStatusAndCL({
          creditLimit: scoringData.credit_limit,
          classification: scoringData.classification,
          status: scoringData.status,
          creationDate: scoringData.creation_date,
          phoneNumber: inputDto.phone_number,
        });

      // Prepare output DTO
      const outputDTO = new AssignConsumerStatusAndCLOutputDTO();
      outputDTO.status = status;
      outputDTO.credit_limit = creditLimit;

      this.logger.debug(
        `\`assign_consumer_status_and_cl\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`assign_consumer_status_and_cl\` task: ${error.message}`,
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
