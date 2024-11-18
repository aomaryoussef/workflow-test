import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { Inject, Injectable } from '@nestjs/common';
import { RiskEngineService } from '../../risk-engine/risk-engine.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import {
  ScoreConsumerViaRiskEngineInputDTO,
  ScoreConsumerViaRiskEngineOutputDTO,
} from 'src/domain/consumer/dto/tasks/score-consumer-via-risk-engine.dto';
import { settings } from 'config/settings';
import { GetRiskEngineScoreInputDTO } from 'src/services/risk-engine/dto/risk-score.dto';
import { ScoringScenarios } from 'src/services/risk-engine/types/risk-engine.types';

@Injectable()
export class ScoreConsumerViaRiskEngineWorker implements ConductorWorker {
  taskDefName = 'score_consumer_via_risk_engine';
  pollInterval = settings.conductor.pollingInterval;
  private readonly logger: CustomLoggerService;

  /**
   * Initializes the worker with the necessary services.
   * @param riskEngineService - The service for interacting with the risk engine.
   * @param traceIdService - The service for managing trace IDs.
   * @param loggerFactory - The factory for creating custom loggers.
   */
  constructor(
    private readonly riskEngineService: RiskEngineService,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(ScoreConsumerViaRiskEngineWorker.name);
  }
  /**
   * The execution logic for the `score_consumer_via_risk_engine` task.
   * @param task - Contains inputData and other metadata.
   * @returns The output data and status of the task.
   */
  @WithTraceId()
  async execute(
    task: Task,
  ): Promise<WorkerResponse<ScoreConsumerViaRiskEngineOutputDTO>> {
    this.logger.debug(
      `Starting \`score_consumer_via_risk_engine\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        ScoreConsumerViaRiskEngineInputDTO,
        task.inputData,
      );

      // Call the service to get the risk score
      const riskIInput = new GetRiskEngineScoreInputDTO(inputDto);

      this.logger.debug(
        `\`score_consumer_via_risk_engine\` caling risk scoring engine with input: ${JSON.stringify(riskIInput)}`,
      );
      const riskScore = await this.riskEngineService.getRiskScore(
        inputDto.booking_time || new Date().toISOString(),
        ScoringScenarios.SCORING,
        riskIInput,
      );

      if (!riskScore) {
        throw new Error('Failed to get risk score');
      }

      // Prepare output DTO
      const outputDTO = new ScoreConsumerViaRiskEngineOutputDTO();
      outputDTO.consumer_id = riskScore.consumer_id;
      outputDTO.ar_status = riskScore.ar_status;
      outputDTO.calc_credit_limit = riskScore.calc_credit_limit;
      outputDTO.pd_predictions = riskScore.pd_predictions;
      outputDTO.income_predictions = riskScore.income_predictions;
      outputDTO.income_zone = riskScore.income_zone;
      outputDTO.final_net_income = riskScore.final_net_income;
      outputDTO.cwf_segment = riskScore.cwf_segment;
      outputDTO.cwf = riskScore.cwf;
      outputDTO.is_consumer_in_lists = false;

      this.logger.debug(
        `\`score_consumer_via_risk_engine\` task completed successfully: ${JSON.stringify(outputDTO)}`,
      );

      return {
        outputData: riskScore,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`score_consumer_via_risk_engine\` task: ${error.message}`,
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
