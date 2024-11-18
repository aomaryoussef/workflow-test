import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Injectable, Inject } from '@nestjs/common';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { settings } from 'config/settings';
import { SanctionListUseCase } from 'src/domain/consumer/use-cases/sanction-list.use-case';
import { SanctionType } from 'src/domain/consumer/types/sanction-list.types';
import { ConsumerDetailsDTO } from 'src/domain/consumer/dto/tasks/update-application-with-kyc-data.dto';
import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IsConsumerInSanctionListInputDTO {
  @IsNotEmpty()
  @IsString()
  phone_number: string

  @IsObject()
  @ValidateNested()
  @Type(() => ConsumerDetailsDTO)
  consumer_details: ConsumerDetailsDTO;

  @IsNotEmpty()
  @IsString()
  consumer_id: string
}

class IsConsumerInSanctionListOutputDTO {
  is_user_in_list: boolean;
  list_type?: SanctionType;
  national_id?: string;
  name?: string;
}

@Injectable()
export class IsConsumerInSanctionListWorker implements ConductorWorker {
  taskDefName = 'is_consumer_in_sanction_list';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly sanctionListUseCase: SanctionListUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(IsConsumerInSanctionListWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`is_consumer_in_sanction_list\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        IsConsumerInSanctionListInputDTO,
        task.inputData,
      );

      const user = await this.sanctionListUseCase.searchSanction(
        `${inputDto.consumer_details.first_name || ''}${inputDto.consumer_details.middle_name || ''}${inputDto.consumer_details.last_name || ''}`,
        inputDto.consumer_details.national_id,
      );

      const outputDTO = new IsConsumerInSanctionListOutputDTO();
      outputDTO.is_user_in_list = false;

      if (user) {
        outputDTO.is_user_in_list = true;
        outputDTO.national_id = user.nationalId;
        outputDTO.name = user.originalName;
        outputDTO.list_type = user.sanctionType;
      }



      this.logger.debug(
        `\`is_consumer_in_sanction_list\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error) {
      this.logger.error(
        `Error in \`is_consumer_in_sanction_list\` task: ${error.message}`,
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
