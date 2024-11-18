import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { ConsumerUseCase } from '../../../domain/consumer/use-cases/consumer-use-case';
import { Injectable, Inject } from '@nestjs/common';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import {
  ConsumerApplicationStateUpdateInputDto,
  ConsumerApplicationUpdateInputDto,
} from '../../../domain/consumer/dto/api/consumer.dto';
import { ConsumerStatus } from 'src/domain/consumer/types/consumer.types';
import { ApplicationState, ApplicationStep } from 'src/domain/consumer/types/consumer-application.types';
import { UpdateApplicationWithRiskDataInputDTO, UpdateApplicationWithRiskDataOutputDTO } from 'src/domain/consumer/dto/tasks/update-application-with-risk-data.dto';
import { settings } from 'config/settings';




@Injectable()
export class UpdateApplicationWithRiskDataWorker implements ConductorWorker {
  taskDefName = 'update_application_with_risk_data';
  pollInterval = settings.conductor.pollingInterval;;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly consumerUserCase: ConsumerUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(UpdateApplicationWithRiskDataWorker.name);
  }

  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`update_application_with_risk_data\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        UpdateApplicationWithRiskDataInputDTO,
        task.inputData,
      );

      const { risk_output, phone_number } = inputDto;

      const { state, step, consumer_status } =
        this.processRiskData(risk_output);

      const updateAppDto: ConsumerApplicationUpdateInputDto = {
        data: {
          step: step,
          application_status: state,
          consumer_cl: risk_output.consumer_cl,
          consumer_status: consumer_status,
        },
        updatedBy: `worker-task#${this.taskDefName}`,
      };

      const updateAppStateDto: ConsumerApplicationStateUpdateInputDto = {
        applicationState: state,
        createdBy: `worker-task#${this.taskDefName}`,
      };

      await this.consumerUserCase.updateApplicationWithState(
        phone_number,
        updateAppDto,
        updateAppStateDto,
      );

      // Prepare output DTO
      const outputDTO = new UpdateApplicationWithRiskDataOutputDTO();
      outputDTO.success = true;

      this.logger.debug(
        `\`update_application_with_risk_data\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: outputDTO,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`update_application_with_risk_data\` task: ${error.message}`,
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

  private processRiskData(risk_output: any) {
    let step: ApplicationStep;
    let consumer_status: ConsumerStatus;
    let application_status: ApplicationState;
    const dataObj: any = {};

    // Check if the risk output contains the necessary fields
    if (!risk_output.consumer_cl.hasOwnProperty('ar_status')) {
      throw new Error('Risk output does not contain ar_status');
    }

    if (risk_output.consumer_cl.ar_status !== 'accept') {
      application_status = ApplicationState.BLOCKED;
      step = ApplicationStep.COMPLETED;
      consumer_status = ConsumerStatus.BLOCKED;
      this.logger.debug('Consumer is blocked by risk engine');
    }

    dataObj['application_status'] = application_status;
    dataObj['step'] = step;
    dataObj['consumer_status'] = consumer_status;

    return { state: application_status, step, consumer_status };
  }
}
