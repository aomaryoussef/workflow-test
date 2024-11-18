import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerFactory } from '~/core-services/logger/types';
import { CustomLoggerService } from '~/core-services/logger/logger.service';
import { orkesConductorClient, StartWorkflowRequest } from '@io-orkes/conductor-javascript';

@Injectable()
export class WorkflowService {
  private workflowBaseURL: string;
  private readonly logger: CustomLoggerService;
  private client: any;
  
  constructor(
    private configService: ConfigService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
    
  ) {
    this.workflowBaseURL = this.configService.get<string>('workflow.url');
    this.logger = this.loggerFactory('workflow');
    this.initializeClient(); 
  }

  private async initializeClient(): Promise<void> {
    const workflowConfig = {
      serverUrl: `${this.workflowBaseURL}/api`,
    };
    this.client = await orkesConductorClient(workflowConfig);
  }

 async startWorkflow(startWorkflowRequest: StartWorkflowRequest): Promise<string> {
  try {
    const workflowId = await this.client.workflowResource.startWorkflow(startWorkflowRequest);
    this.logger.log("workflow id :"+ workflowId);
    return  workflowId;;
  } catch (error) {
    this.logger.error("Error starting workflow"+ error);
    throw new Error(error);
  }
}

async waitForWorkflowCompletion(workflowId: string): Promise<string> {
    const pollInterval = 5000; // Polling interval in milliseconds (5 seconds)
    let isWorkflowCompleted = false;
    let status = ''; 
   try{
    while (!isWorkflowCompleted) {
         // Ensure that client is initialized before accessing its methods
     
      const workflowStatus =(await  this.client.workflowResource.getExecutionStatus(workflowId, false)).status;
      this.logger.log(`getExecutionStatus ${workflowId} status: ${workflowStatus}`);

    //   const workflowStatus =await  clients.workflowResource.getWorkflowStatusSummary(workflowId, false);
      this.logger.log(`Workflow ${workflowId} status: ${workflowStatus}`);
       status = workflowStatus;
        this.logger.log(`Workflow ${workflowId} status is ${status}`);
      if (status === 'COMPLETED' || status === 'FAILED' || status === 'TERMINATED') {
        this.logger.log(`Workflow ${workflowId} status is ${status}`);
        isWorkflowCompleted = true;
      } else {
        this.logger.log(`Workflow ${workflowId} is still in progress...`);
        await this.delay(pollInterval); // Wait before polling again
      }
    }

    this.logger.log(`Workflow ${workflowId} finished with status: ${status}`);
    return status;
    }
    catch (error) {
      this.logger.error("Error waiting for workflow completion"+ error);
      throw new Error(error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
