import { ConductorWorker, Task } from '@io-orkes/conductor-javascript';
import { Injectable, Inject } from '@nestjs/common';
import { transformAndValidate } from '../../../utils/validate-input.utils';
import { WithTraceId } from '../../../common/decorators/with-trace-id.decorator';
import { TraceIdService } from '../../../common/services/trace-id.service';
import { TaskStatusEnum } from '../../../types/conductor.types';
import { LoggerFactory } from '../../../types/logger.interface';
import { CustomLoggerService } from '../../../common/services/logger.service';
import {MerchantInvoiceUseCase} from "../../../domain/merchant/use-cases/merchant-invoice.use-case";
import {CreateInvoicingTransactionInputDTO} from "../../../domain/merchant/dto/tasks/create-invoicing-transaction.dto";

@Injectable()
export class CreateInvoicingTransactionRecordWorker implements ConductorWorker {
  taskDefName = 'create_invoicing_transaction_record_task';
  pollInterval = 5000;
  private logger: CustomLoggerService;

  constructor(
    private readonly merchantInvoiceUseCase: MerchantInvoiceUseCase,
    private readonly traceIdService: TraceIdService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory(CreateInvoicingTransactionRecordWorker.name);
  }


  @WithTraceId()
  async execute(task: Task): Promise<any> {
    this.logger.debug(
      `Starting \`${this.taskDefName}\` task with input: ${JSON.stringify(task.inputData)}`,
    );

    try {
      // Transform and validate input data
      const inputDto = await transformAndValidate(
        CreateInvoicingTransactionInputDTO,
        task.inputData,
      );

      const outputData = await this.merchantInvoiceUseCase.createInvoicingRecord(inputDto);
      this.logger.debug(
        `\`${this.taskDefName}\` task completed successfully: ${JSON.stringify(outputData)}`,
      );
      return {
        outputData: outputData,
        status: TaskStatusEnum.COMPLETED,
      };
    } catch (error: any) {
      this.logger.error(
        `Error in \`${this.taskDefName}\` task: ${error.message}`,
      );

      return {
        status: TaskStatusEnum.FAILED,
        reasonForIncompletion: error.message || 'Unknown error',
      };
    }
  }
}
