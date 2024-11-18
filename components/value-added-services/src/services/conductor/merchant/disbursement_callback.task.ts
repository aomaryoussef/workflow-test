import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Injectable, Inject } from '@nestjs/common';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { MerchantInvoiceUseCase } from 'src/domain/merchant/use-cases/merchant-invoice.use-case';
import { MerchantPaymentNotFoundError } from 'src/common/errors/merchant-payment-not-found.error';
import { MerchantDisbursementCallbackInputDTO } from 'src/domain/merchant/dto/tasks/disbursement-callback.dto';

@Injectable()
export class MerchantDisbursementCallbackWorker implements ConductorWorker {
  taskDefName = 'merchant_disbursement_callback_task';
  pollInterval = 5000;
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly merchantInvoiceUseCase : MerchantInvoiceUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(MerchantDisbursementCallbackWorker.name);
  }


  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`${this.taskDefName}\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        MerchantDisbursementCallbackInputDTO,
        task.inputData,
      );

      const outputData = await this.merchantInvoiceUseCase.handlePaymentDisbursementCallback(inputDto);
      this.logger.debug(`\`${this.taskDefName}\` task completed successfully: ${JSON.stringify(outputData)}`,);

      return {
        status: TaskStatusEnum.COMPLETED
      };
    } 
    catch (error: any) {
      let taskStatus: TaskStatusEnum

      // Need to improve this to handle multiple errors types not just one
      const isBlockingError = error instanceof MerchantPaymentNotFoundError
      if (isBlockingError) {
        taskStatus = TaskStatusEnum.FAILED_WITH_TERMINAL_ERROR
      } else {
        taskStatus = TaskStatusEnum.FAILED
      }

      this.logger.error(
        `Error in\`${this.taskDefName}\` task: ${error.message}`,
      );

      return {
        status: taskStatus,
        reasonForIncompletion: error.message || 'Unknown error',
      };
    }
  }
}
