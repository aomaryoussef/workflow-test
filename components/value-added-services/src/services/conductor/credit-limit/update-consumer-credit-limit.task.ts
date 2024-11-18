import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Inject, Injectable } from '@nestjs/common';
import { CreditLimitUseCase } from '../../../domain/consumer/use-cases/credit-limit.use-case';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum, WorkerResponse } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { transformAndValidate } from 'src/utils/validate-input.utils';
import { settings } from 'config/settings';
import { CreditLimitDirectionEnum } from 'src/domain/consumer/types/consumer-credit-limit.types';


class UpdateCreditLimitInputDTO {
    @IsString()
    @IsNotEmpty()
    consumer_id: string;

    @IsString()
    @IsEnum(CreditLimitDirectionEnum)
    direction: string;

    @IsNumber()
    amount: number
}

/**
 * Output DTO for the `create_application` task.
 */
class UpdateCreditLimitOutputDTO {
    credit_limit: number;
}
@Injectable()
export class UpdateCreditLimitWorker implements ConductorWorker {
    taskDefName = "vas_update_consumer_credit_limit";
    pollInterval = settings.conductor.pollingInterval;
    private readonly logger: CustomLoggerService

    constructor(
        private readonly creditLimitUseCase: CreditLimitUseCase,
        private readonly traceIdService: TraceIdService, // Injected service for WithTraceId 
        @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory
    ) {
        this.logger = this.loggerFactory(UpdateCreditLimitWorker.name);
    }

    @WithTraceId()
    async execute(task: Task): Promise<WorkerResponse<UpdateCreditLimitOutputDTO>> {
        try {
            this.logger.debug(
                `Starting \`vas_update_consumer_credit_limit\` task with input: ${JSON.stringify(task.inputData)}`,
            );
            const inputDto = await transformAndValidate(
                UpdateCreditLimitInputDTO,
                task.inputData,
            );
            const usedCredit = inputDto.direction === CreditLimitDirectionEnum.DECREASE ? inputDto.amount : (-1 * inputDto.amount);
            const result = await this.creditLimitUseCase.updateCreditLimit({ consumerId: task.inputData.consumer_id, usedCredit });

            const outputDTO = new UpdateCreditLimitOutputDTO();
            outputDTO.credit_limit = result.availableCreditLimit

            this.logger.debug(
                `\`vas_update_consumer_credit_limit\` task completed successfully: ${JSON.stringify(outputDTO)}`,
            );

            return {
                outputData: { credit_limit: result.availableCreditLimit },
                status: TaskStatusEnum.COMPLETED,
            };
        }
        catch (error) {
            this.logger.error(
                `Error in \`vas_update_consumer_credit_limit\` task: ${error.message}`,
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