import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import {
  KratosIdentitySchema,
  KratosService,
} from '../../kratos/kratos.service';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { settings } from 'config/settings';

/**
 * Input DTO for the `create_identity` task.
 */
class CreateIdentityInputDTO {
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}

/**
 * Output DTO for the `create_identity` task.
 */
class CreateIdentityOutputDTO {
  identity_id: string;
}

@Injectable()
export class CreateIdentityWorker implements ConductorWorker {
  taskDefName = 'create_identity';
  pollInterval = settings.conductor.pollingInterval;
  private readonly logger: CustomLoggerService;

  /**
   * Initializes the worker with the necessary service.
   * @param kratosService - The service for managing identities in Kratos.
   * @param traceIdService - The service for managing trace IDs.
   * @param loggerFactory - The factory for creating custom loggers.
   */
  constructor(
    private readonly kratosService: KratosService,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(CreateIdentityWorker.name);
  }

  /**
   * The execution logic for the `create_identity` task.
   * @param task - Contains inputData and other metadata.
   * @returns The output data and status of the task.
   */
  @WithTraceId()
  async execute(task: Task): Promise<WorkerResponse<CreateIdentityOutputDTO>> {
    this.logger.debug(
      `Starting \`create_identity\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        CreateIdentityInputDTO,
        task.inputData,
      );

      // Invoke the service to handle business logic
      const identityId = await this.kratosService.createIdentity(
        KratosIdentitySchema.PHONE,
        inputDto.phone_number,
      );

      if (!identityId) {
        throw new Error('Failed to create identity');
      }

      // Prepare output DTO
      const outputDTO = new CreateIdentityOutputDTO();
      outputDTO.identity_id = identityId;

      this.logger.debug(
        `\`create_identity\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(`Error in \`create_identity\` task: ${error.message}`);

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
