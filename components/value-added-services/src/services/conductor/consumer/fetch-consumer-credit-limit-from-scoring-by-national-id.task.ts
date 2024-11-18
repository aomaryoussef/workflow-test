import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { ConsumerUseCase } from '../../../domain/consumer/use-cases/consumer-use-case';
import { settings } from 'config/settings';

/**
 * Input DTO for the `fetch_consumer_credit_limit_from_scoring_by_national_id` task.
 */
class FetchConsumerCreditLimitFromScoringByNationalIdInputDTO {
  @IsString()
  @IsNotEmpty()
  national_id: string;
}

/**
 * Output DTO for the `fetch_consumer_credit_limit_from_scoring_by_national_id` task.
 */
class FetchConsumerCreditLimitFromScoringByNationalIdOutputDTO {
  user_exists: boolean;
  credit_limit: number;
  classification: string;
  status: string;
  creation_date: string;
}

@Injectable()
export class FetchConsumerCreditLimitFromScoringByNationalIdWorker
  implements ConductorWorker {
  taskDefName = 'fetch_consumer_credit_limit_from_scoring_by_national_id';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUseCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(
      FetchConsumerCreditLimitFromScoringByNationalIdWorker.name,
    );
  }

  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`fetch_consumer_credit_limit_from_scoring_by_national_id\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        FetchConsumerCreditLimitFromScoringByNationalIdInputDTO,
        task.inputData,
      );

      // // Invoke the use-case method to handle business logic
      const creditLimitData =
        await this.consumerUseCase.fetchConsumerCreditLimitFromScoring(
          inputDto.national_id,
          true,
        );

      if (!creditLimitData) {
        throw new Error('Failed to fetch consumer credit limit');
      }

      // Prepare output DTO
      const outputDTO =
        new FetchConsumerCreditLimitFromScoringByNationalIdOutputDTO();
      outputDTO.credit_limit = creditLimitData.creditLimit;
      outputDTO.classification = creditLimitData.classification;
      outputDTO.status = creditLimitData.status;
      outputDTO.creation_date = creditLimitData.creationDate;
      outputDTO.user_exists = creditLimitData.userExists;

      this.logger.debug(
        `\`fetch_consumer_credit_limit_from_scoring_by_national_id\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`fetch_consumer_credit_limit_from_scoring_by_national_id\` task: ${error.message}`,
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
