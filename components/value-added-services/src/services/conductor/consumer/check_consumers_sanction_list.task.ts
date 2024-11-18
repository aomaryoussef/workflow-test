import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Injectable, Inject } from '@nestjs/common';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { settings } from 'config/settings';
import { SanctionListUseCase } from 'src/domain/consumer/use-cases/sanction-list.use-case';
import { SanctionType } from 'src/domain/consumer/types/sanction-list.types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CheckConsumersSanctionListInputDTO {
  @IsNotEmpty()
  @IsString()
  national_id: string

  @IsOptional()
  @IsString()
  full_name: string
}

class CheckConsumersSanctionListOutputDTO {
  is_user_in_list: boolean;
  list_type?: SanctionType;
  national_id?: string;
  name?: string;
}

@Injectable()
export class CheckConsumersSanctionListWorker implements ConductorWorker {
  taskDefName = 'check_consumers_sanction_list';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly sanctionListUseCase: SanctionListUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(CheckConsumersSanctionListWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<WorkerResponse<CheckConsumersSanctionListOutputDTO>> {
    this.logger.debug(
      `Starting \`check_consumers_sanction_list\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        CheckConsumersSanctionListInputDTO,
        task.inputData,
      );

      const user = await this.sanctionListUseCase.searchSanction(
        inputDto.full_name,
        inputDto.national_id,
      );

      const outputDTO = new CheckConsumersSanctionListOutputDTO();
      outputDTO.is_user_in_list = false;
      if (user) {
        outputDTO.is_user_in_list = true;
        outputDTO.national_id = user.nationalId;
        outputDTO.name = user.originalName;
        outputDTO.list_type = user.sanctionType;
        this.logger.debug(
          `\`check_consumers_sanction_list\` task completed with status ${TaskStatusEnum.FAILED_WITH_TERMINAL_ERROR} for reason user is in list: ${JSON.stringify(outputDTO)}`,
        );

        return {
          outputData: outputDTO,
          reasonForIncompletion: `consumer is in ${user.sanctionType}`,
          status: TaskStatusEnum.FAILED_WITH_TERMINAL_ERROR,
        };
      }



      this.logger.debug(
        `\`check_consumers_sanction_list\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error) {
      this.logger.error(
        `Error in \`check_consumers_sanction_list\` task: ${error.message}`,
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
