import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { KratosService } from '../../kratos/kratos.service';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { settings } from 'config/settings';

/**
 * Input DTO for the `generate_kratos_recovery_flow` task.
 */
class GenerateKratosRecoveryFlowInputDTO {
  @IsString()
  @IsNotEmpty()
  identity_id: string;
}

/**
 * Output DTO for the `generate_kratos_recovery_flow` task.
 */
class GenerateKratosRecoveryFlowOutputDTO {
  flow_id: string;
  otp: string;
}

@Injectable()
export class GenerateKratosRecoveryFlowWorker implements ConductorWorker {
  taskDefName = 'generate_kratos_recovery_flow';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly kratosService: KratosService,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(GenerateKratosRecoveryFlowWorker.name);
  }

  @WithTraceId()
  async execute(
    task: Task,
  ): Promise<WorkerResponse<GenerateKratosRecoveryFlowOutputDTO>> {
    this.logger.debug(
      `Starting \`generate_kratos_recovery_flow\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        GenerateKratosRecoveryFlowInputDTO,
        task.inputData,
      );

      // Invoke the service to handle business logic
      const recoveryData = await this.kratosService.createRecoveryCode(
        inputDto.identity_id,
      );

      if (!recoveryData) {
        throw new Error('Failed to generate recovery flow');
      }

      // Prepare output DTO
      const outputDTO = new GenerateKratosRecoveryFlowOutputDTO();
      outputDTO.flow_id = recoveryData.flow_id;
      outputDTO.otp = recoveryData.recovery_code;

      this.logger.debug(
        `\`generate_kratos_recovery_flow\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`generate_kratos_recovery_flow\` task: ${error.message}`,
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
