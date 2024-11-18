import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Inject, Injectable } from '@nestjs/common';
import { CreditLimitUseCase } from '../../../domain/consumer/use-cases/credit-limit.use-case';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { IsNotEmpty, IsString } from 'class-validator';
import { transformAndValidate } from 'src/utils/validate-input.utils';
import { settings } from 'config/settings';

class GetCreditLimitInputDTO {
    @IsString()
    @IsNotEmpty()
    consumer_id: string;

}

/**
 * Output DTO for the `create_application` task.
 */
class GetCreditLimitOutputDTO {
    credit_limit: number;
}

@Injectable()
export class GetCreditLimitWorker implements ConductorWorker {
    taskDefName = "vas_get_consumer_credit_limit";
    pollInterval = settings.conductor.pollingInterval;
    private readonly logger: CustomLoggerService

    constructor(
        private readonly creditLimitUseCase: CreditLimitUseCase,
        private readonly traceIdService: TraceIdService, // Injected service for WithTraceId 
        @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory
    ) {
        this.logger = this.loggerFactory(GetCreditLimitWorker.name);
    }

    @WithTraceId()
    async execute(task: Task): Promise<WorkerResponse<GetCreditLimitOutputDTO>> {
        try {
            this.logger.debug(
                `Starting \`create_application\` task with input: ${JSON.stringify(task.inputData)}`,
            );
            const inputDto = await transformAndValidate(
                GetCreditLimitInputDTO,
                task.inputData,
            );

            const result = await this.creditLimitUseCase.getLatestCreditLimitByConsumerId(inputDto.consumer_id);
            const outputDTO = new GetCreditLimitOutputDTO();
            outputDTO.credit_limit = result.availableCreditLimit
            this.logger.debug(
                `\`create_application\` task completed successfully: ${JSON.stringify(outputDTO)}`,
            );

            return {
                outputData: outputDTO,
                status: TaskStatusEnum.COMPLETED,
            };
        } catch (error) {
            this.logger.error(
                `Error in \`create_application\` task: ${error.message}`,
            );
            return {
                status: TaskStatusEnum.FAILED,
                reasonForIncompletion: error.message || 'Unknown error',
                logs: [{
                    log: JSON.stringify(error),
                    createdTime: new Date().getTime()
                }]
            };
        }
    }
}