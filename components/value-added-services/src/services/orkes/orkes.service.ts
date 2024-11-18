// src/common/services/orkes.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  ConductorClient,
  WorkflowDef,
  WorkflowExecutor,
} from '@io-orkes/conductor-javascript';
import { LoggerFactory } from '../../types/logger.interface';
import { CustomLoggerService } from '../../common/services/logger.service';
import { TraceIdService } from 'src/common/services/trace-id.service';

@Injectable()
export class OrkesService {
  private readonly logger: CustomLoggerService; // Logger for the service
  private readonly executor: WorkflowExecutor; // Use WorkflowExecutor for executing workflows

  constructor(
    @Inject('ORKES_CLIENT') private readonly client: ConductorClient,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
    private readonly traceIdService: TraceIdService,
  ) {
    this.executor = new WorkflowExecutor(this.client); // Initialize the WorkflowExecutor
    this.logger = this.loggerFactory(OrkesService.name);
  }

  /**
   * Start a workflow in Conductor using WorkflowExecutor
   * @param workflowName The name of the workflow
   * @param input The input data for the workflow
   * @param version The version of the workflow (optional)
   */
  async startWorkflow(workflowName: string, input: any, version?: number) {
    if (!workflowName || typeof workflowName !== 'string') {
      this.logger.error('Workflow name is invalid');
      throw new BadRequestException('Invalid workflow name');
    }

    if (!input || typeof input !== 'object') {
      this.logger.error('Workflow input is invalid');
      throw new BadRequestException('Invalid workflow input');
    }

    try {
      this.logger.log(
        `Starting workflow: ${workflowName} (version ${version ?? "latest"})`,
      );
      if (!version) {
        this.logger.log(`Fetching latest version for workflow: ${workflowName}`);
        const metadata = await this.client.metadataResource.get(workflowName);
        version = metadata.version;  // Get the latest version from the metadata
        this.logger.log(`Found latest version for ${workflowName}: ${version}`);
      }

      const execution = await this.executor.executeWorkflow(
        {
          name: workflowName,
          version: version,
          input: input,
        },
        workflowName,
        version,
        this.traceIdService.getTraceId(),
      );
      this.logger.log(
        `Workflow ${workflowName} started successfully with execution ID: ${execution.workflowId}`,
      );
      return execution.workflowId;
    } catch (error) {
      this.logger.error({
        message: `Failed to start workflow: ${workflowName}`,
        error,
      });
      throw new Error(
        `Error starting workflow ${workflowName}: ${error.message}`,
      );
    }
  }

  /**
   * Get the status of a workflow
   * @param workflowId The ID of the workflow
   */
  async getWorkflowStatus(workflowId: string) {
    if (!workflowId) {
      throw new BadRequestException('Workflow ID is required');
    }

    try {
      this.logger.log(`Fetching status for workflow: ${workflowId}`);
      const workflowStatus =
        await this.client.workflowResource.getWorkflowStatusSummary(
          workflowId,
          false,
        ); // false = do not include full execution history
      return workflowStatus;
    } catch (error) {
      this.logger.error({
        message: `Failed to fetch workflow status for ID: ${workflowId}`,
        error,
      });
      throw new Error(
        `Error fetching workflow status for ${workflowId}: ${error.message}`,
      );
    }
  }

  /**
   * Terminate a workflow
   * @param workflowId The ID of the workflow to terminate
   */
  async terminateWorkflow(workflowId: string, reason: string) {
    if (!workflowId) {
      throw new BadRequestException('Workflow ID is required');
    }

    try {
      this.logger.log(
        `Terminating workflow: ${workflowId} for reason: ${reason}`,
      );
      await this.client.workflowBulkResource.terminate([workflowId], reason);
      this.logger.log(`Workflow ${workflowId} terminated successfully.`);
    } catch (error) {
      this.logger.error({
        message: `Failed to terminate workflow ${workflowId}`,
        error,
      });
      throw new Error(
        `Error terminating workflow ${workflowId}: ${error.message}`,
      );
    }
  }
  async completeHumanTaskByWorkflowId<T>(
    workflowId: string,
    taskDefName: string,
    outputData: T,
  ) {
    if (!workflowId) {
      throw new BadRequestException('Workflow ID is required');
    }

    try {
      this.logger.log(
        `Fetching workflow details for workflow ID: ${workflowId}`,
      );

      // Fetch the workflow execution details
      let workflow = await this.client.workflowResource.getExecutionStatus(
        workflowId,
        true,
      ); // `true` includes full task execution history

      // checkout for time_out_task in the human task in the workflow 
      const timedOutHumanTask = workflow.tasks.find(
        (task) =>
          task.taskType === 'HUMAN' &&
          task.status === 'TIMED_OUT' &&
          task.taskDefName === taskDefName,
      );

      if (timedOutHumanTask?.status === 'TIMED_OUT') {
        this.logger.log(
          `Resuming timed-out task: ${timedOutHumanTask.taskId} in workflow ${workflowId}`,
        );
        // retry the flow 
        await this.executor.retry(
          workflowId,
          true
        );

        workflow = await this.client.workflowResource.getExecutionStatus(
          workflowId,
          true,
        ); // `true` includes full task execution history

      }

      const pendingHumanTask = workflow.tasks.find(
        (task) =>
          task.taskType === 'HUMAN' &&
          ['IN_PROGRESS', 'SCHEDULED'].includes(task.status) &&
          task.taskDefName === taskDefName,
      );
      if (!pendingHumanTask) {
        this.logger.error(
          `No pending human task found in workflow ${workflowId} with taskDefName ${taskDefName}`,
        );
        throw new Error(
          `No pending human task found in workflow ${workflowId} with taskDefName ${taskDefName}`,
        );
      }

      // Complete the human task
      this.logger.log(`Completing human task: ${pendingHumanTask.taskId}`);

      await this.executor.updateTask(
        pendingHumanTask.taskId,
        workflowId,
        'COMPLETED',
        outputData,
      );

      this.logger.log(
        `Task ${pendingHumanTask.taskId} has been successfully completed.`,
      );
    } catch (error) {
      this.logger.error({
        message: `Failed to complete task in workflow ${workflowId}`,
        error: error,
      });
      throw new Error(
        `Error completing task in workflow ${workflowId}: ${error.message}`,
      );
    }
  }
  async registerWorkflow(workflowDef: WorkflowDef) {
    try {
      // First, check if the workflow already exists
      try {
        await this.client.metadataResource.get(
          workflowDef.name,
          workflowDef.version,
        );
      } catch (error) {
        if (error.status === 404)
          // If the workflow doesn't exist, register it
          await this.executor.registerWorkflow(true, workflowDef);
        return;
      }
      console.log(
        `Workflow with name ${workflowDef.name} already exists. Skipping registration.`,
      );
    } catch (error) {
      if (error.status === 409) {
        console.log(
          `Workflow with name ${workflowDef.name} already exists. Conflict avoided.`,
        );
      } else {
        throw error; // Re-throw the error for further handling
      }
    }
  }
  async checkTaskCompletion(
    workflowId: string,
    taskDefName: string,
    timeout: number = 10000, // Total time limit in milliseconds (10 seconds)
    initialInterval: number = 200 // Initial interval in milliseconds (200 ms)
  ): Promise<boolean> {
    const startTime = Date.now();
    let currentInterval = initialInterval;

    while (Date.now() - startTime < timeout) {
      const workflowStatus = await this.client.workflowResource.getExecutionStatus(workflowId);
      const task = workflowStatus.tasks.find((task) => task.taskDefName === taskDefName);

      if (task?.status === 'COMPLETED') {
        this.logger.log(`Task ${taskDefName} has been successfully completed.`);
        return true; // Task has been completed
      }

      if (task?.status === 'FAILED') {
        this.logger.error(`Task ${taskDefName} failed in workflow ${workflowId}.`);
        throw new Error(`Task ${taskDefName} has failed in workflow ${workflowId}.`);
      }

      // Log retry attempt
      this.logger.log(`Task ${taskDefName} is not completed yet. Waiting for ${currentInterval / 1000} seconds before retrying...`);

      // Wait before the next check
      await this.sleep(currentInterval);

      // Increase the interval using exponential backoff, capped at 2 seconds (2000 ms)
      currentInterval = Math.min(currentInterval * 2, 2000);
    }

    // If the timeout is reached without completing the task
    this.logger.error(`Timeout reached. Task ${taskDefName} was not completed within ${timeout / 1000} seconds.`);
    return false; // Task not completed in time
  }

  /**
   * Sleep function to delay execution for a specified amount of time.
   * 
   * @param ms Time in milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
