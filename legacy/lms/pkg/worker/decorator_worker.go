package worker

import (
	"context"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/sql"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"time"
)

// DecoratorTaskWorker is a decorator for all the conductor tasks.
// The goal of this decorator is to create a context from the incoming task
// model and wraps up the internal task function with a SQL transaction.
type DecoratorTaskWorker struct {
	t  TaskWorker
	cm sql.PgConnectionManager
}

func NewDecoratorTaskWorker(t TaskWorker, cm sql.PgConnectionManager) DecoratorTaskWorker {
	d := DecoratorTaskWorker{t: t, cm: cm}
	return d
}

func (d DecoratorTaskWorker) GetName() string {
	return d.t.GetName()
}
func (d DecoratorTaskWorker) GetTaskFunction() model.ExecuteTaskFunction {
	return func(t *model.Task) (interface{}, error) {
		ctx := contextFromTask(t)
		logger := logging.LogHandle.WithContext(ctx)
		if t.TaskDefName != "" && t.WorkflowTask.Name != "" && t.WorkflowInstanceId != "" {
			logger.Debugf("start - task: %s for workflow: %s-%s", t.TaskDefName, t.WorkflowTask.Name, t.WorkflowInstanceId)
		}
		
		ctx, err := d.cm.InjectTx(ctx)
		if err != nil {
			// TODO Should panic ?
			panic(err)
		}
		
		taskResult := &model.TaskResult{
			WorkflowInstanceId: t.WorkflowInstanceId,
			TaskId:             t.TaskId,
		}
		err = d._doInternal(ctx, t, taskResult)
		// See task status: https://orkes.io/content/developer-guides/task-and-workflow-status-in-conductor
		// Make the task fail in case where commit or rollback fails
		// This way Conductor will restart the task
		if err != nil {
			_ = d.cm.RollbackTx(ctx)
			logger.Error(err.Error())
			if taskResult.Status == "" {
				taskResult.Status = model.FailedTask
			}
			if taskResult.ReasonForIncompletion == "" {
				taskResult.ReasonForIncompletion = err.Error()
			}
			return taskResult, err
		} else {
			err = d.cm.CommitTx(ctx)
			if err != nil {
				logger.Errorf("failed commit transaction for task %s with %s", t.TaskDefName, err)
				taskResult.Status = model.FailedTask
				return taskResult, err
			}
			// If the task status is not set by the internal task function,
			// then only set it to completed as there were no errors
			if taskResult.Status == "" {
				taskResult.Status = model.CompletedTask
			}
		}
		
		if t.TaskDefName != "" && t.WorkflowTask.Name != "" && t.WorkflowInstanceId != "" {
			logger.Debugf("end - task: %s for workflow: %s-%s", t.TaskDefName, t.WorkflowTask.Name, t.WorkflowInstanceId)
		}
		return taskResult, nil
	}
}
func (d DecoratorTaskWorker) GetBatchSize() int {
	return d.t.GetBatchSize()
}
func (d DecoratorTaskWorker) GetPollInterval() time.Duration {
	return d.t.GetPollInterval()
}

func (d DecoratorTaskWorker) _doInternal(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	taskInternalFn := d.t.GetTaskFunction()
	return taskInternalFn(ctx, t, tr)
}
