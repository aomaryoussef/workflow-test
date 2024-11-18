import { TaskExecLog } from '@io-orkes/conductor-javascript';

export type TaskStatus =
  | 'IN_PROGRESS'
  | 'FAILED'
  | 'FAILED_WITH_TERMINAL_ERROR'
  | 'COMPLETED';

export enum TaskStatusEnum {
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
  FAILED_WITH_TERMINAL_ERROR = 'FAILED_WITH_TERMINAL_ERROR',
  COMPLETED = 'COMPLETED',
}

export type WorkerSuccesResponse<T> = {
  status: TaskStatusEnum;
  outputData: T;
  logs?: Array<TaskExecLog>;
};
export type WorkerFailedResponse = {
  status: TaskStatusEnum;
  reasonForIncompletion?: string;
  logs?: Array<TaskExecLog>;
};
export type WorkerResponse<T> = WorkerFailedResponse | WorkerSuccesResponse<T>;
