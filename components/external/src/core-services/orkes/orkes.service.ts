import { Inject, Injectable } from '@nestjs/common';
import {
  ConductorClient,
  orkesConductorClient,
  WorkflowExecutor,
} from '@io-orkes/conductor-javascript';
import { CustomLoggerService } from '~/core-services/logger/logger.service';
import { LoggerFactory } from '~/core-services/logger/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrkesService {
  private readonly logger: CustomLoggerService;
  private client: ConductorClient;

  constructor(
    private configService: ConfigService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory('orkes');
    this.initializeClient();
  }

  private async initializeClient() {
    this.logger.debug('initializeClient');
    this.client = await orkesConductorClient({
      serverUrl: `${this.configService.get<string>('orkes.baseURL')}/api`,
    });
    this.logger.debug('initializeClient done');
  }

  async initConsumerRepaymentWorkflow(
    input,
    correlationId: string,
  ): Promise<string> {
    this.logger.debug('initConsumerRepaymentWorkflow');
    try {
      const executor = new WorkflowExecutor(this.client);
      const execution = await executor.executeWorkflow(
        {
          name: this.configService.get<string>(
            'orkes.workflows.consumerRepayment.name',
          ),
          input: input,
          correlationId: correlationId,
        },
        this.configService.get<string>(
          'orkes.workflows.consumerRepayment.name',
        ),
        this.configService.get<number>(
          'orkes.workflows.consumerRepayment.version',
        ),
        input.payment_details.id,
      );
      this.logger.debug(
        `initConsumerRepaymentWorkflow done with workflowId: ${execution.workflowId}`,
      );
      return execution.workflowId;
    } catch (error) {
      this.logger.error({
        context: 'initConsumerRepaymentWorkflow failed',
        error: error,
      });
      return '';
    }
  }
}
