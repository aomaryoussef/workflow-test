import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Injectable, Inject } from '@nestjs/common';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { ConsumerUseCase } from 'src/domain/consumer/use-cases/consumer-use-case';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { IsOptional, IsString } from 'class-validator';
import { ConsumerDetailsDto } from 'src/domain/consumer/dto/api/consumer.dto';
import { settings } from 'config/settings';

class FetchConsumerDetailsFromMCInputDTO {
  @IsOptional()
  @IsString()
  national_id?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;
}

class FetchConsumerDetailsFromMCOutputDTO {
  consumerDetails: any;
}

@Injectable()
export class FetchConsumerDetailsFromMCWorker implements ConductorWorker {
  taskDefName = 'fetch_consumer_details_from_mc';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUseCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(FetchConsumerDetailsFromMCWorker.name);
  }

  @WithTraceId()
  async execute(
    task: Task,
  ): Promise<WorkerResponse<FetchConsumerDetailsFromMCOutputDTO>> {
    this.logger.debug(
      `Starting \`fetch_consumer_details_from_mc\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        FetchConsumerDetailsFromMCInputDTO,
        task.inputData,
      );

      let consumerDetails: ConsumerDetailsDto;
      if (inputDto.national_id) {
        consumerDetails = await this.consumerUseCase.fetchConsumerDetailsFromMC(
          inputDto.national_id,
          true,
        );
      } else {
        consumerDetails = await this.consumerUseCase.fetchConsumerDetailsFromMC(
          inputDto.phone_number,
          false,
        );
      }

      // Prepare output DTO
      const outputDTO = new FetchConsumerDetailsFromMCOutputDTO();
      outputDTO.consumerDetails = consumerDetails;

      this.logger.debug(
        `\`fetch_consumer_details_from_mc\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`fetch_consumer_details_from_mc\` task: ${error.message}`,
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
