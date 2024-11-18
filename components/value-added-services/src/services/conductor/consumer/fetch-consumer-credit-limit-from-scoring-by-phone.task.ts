import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { ConsumerUseCase } from '../../../domain/consumer/use-cases/consumer-use-case';
import { DuplicateError } from '../../../exceptions/custom-exceptions';
import { settings } from 'config/settings';

/**
 * Input DTO for the `fetch_consumer_credit_limit_from_scoring_by_phone` task.
 */
class FetchConsumerCreditLimitFromScoringByPhoneInputDTO {
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

/**
 * Output DTO for the `fetch_consumer_credit_limit_from_scoring_by_phone` task.
 */
class FetchConsumerCreditLimitFromScoringByPhoneOutputDTO {
  user_exists: boolean;
  credit_limit: number;
  classification: string;
  status: string;
  creation_date: string;
  is_duplicate: boolean;
}

@Injectable()
export class FetchConsumerCreditLimitFromScoringByPhoneWorker
  implements ConductorWorker {
  taskDefName = 'fetch_consumer_credit_limit_from_scoring_by_phone';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUseCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(
      FetchConsumerCreditLimitFromScoringByPhoneWorker.name,
    );
  }

  @WithTraceId()
  async execute(task: Task): Promise<WorkerResponse<any>> {
    this.logger.debug(
      `Starting \`fetch_consumer_credit_limit_from_scoring_by_phone\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        FetchConsumerCreditLimitFromScoringByPhoneInputDTO,
        task.inputData,
      );

      // // Invoke the use-case method to handle business logic
      const creditLimitData =
        await this.consumerUseCase.fetchConsumerCreditLimitFromScoring(
          inputDto.phone_number,
          false,
        );

      if (!creditLimitData) {
        throw new Error('Failed to fetch consumer credit limit');
      }

      // Prepare output DTO
      const outputDTO =
        new FetchConsumerCreditLimitFromScoringByPhoneOutputDTO();
      outputDTO.credit_limit = creditLimitData.creditLimit;
      outputDTO.classification = creditLimitData.classification;
      outputDTO.status = creditLimitData.status;
      outputDTO.creation_date = creditLimitData.creationDate;
      outputDTO.user_exists = creditLimitData.userExists;
      outputDTO.is_duplicate = creditLimitData.isDuplicate;

      this.logger.debug(
        `\`fetch_consumer_credit_limit_from_scoring_by_phone\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      if (error instanceof DuplicateError) {
        this.logger.error(
          `Duplicate error encountered for phone number: ${task.inputData.phone_number}. Updating application step to MC_DUPLICATE.`,
        );
        return {
          outputData: {
            is_duplicate: true,
            user_exists: true,
          },
          status: TaskStatusEnum.COMPLETED,
        };
      }
      this.logger.error(
        `Error in \`fetch_consumer_credit_limit_from_scoring_by_phone\` task: ${error.message}`,
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
