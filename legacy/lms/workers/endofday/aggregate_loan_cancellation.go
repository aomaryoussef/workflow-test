package endofday

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
	"time"
)

type AggregateLoanCancellationTask struct {
	app app.Application
}

const (
	TaskNameAggregateLoanCancellation         = "aggregate_loan_cancellation"
	TaskBatchSizeAggregateLoanCancellation    = 1
	TaskPollIntervalAggregateLoanCancellation = 5 * time.Second
)

func NewAggregateLoanCancellationTask(app app.Application) worker.TaskWorker {
	return &AggregateLoanCancellationTask{app: app}
}

func (d *AggregateLoanCancellationTask) GetName() string {
	return TaskNameAggregateLoanCancellation
}

func (d *AggregateLoanCancellationTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *AggregateLoanCancellationTask) GetBatchSize() int {
	return TaskBatchSizeAggregateLoanCancellation
}
func (d *AggregateLoanCancellationTask) GetPollInterval() time.Duration {
	return TaskPollIntervalAggregateLoanCancellation
}

func (d *AggregateLoanCancellationTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	module, err := d.app.GetModule(ga.GaModuleName)
	if err != nil {
		errMsg := "ga module not loaded in the application"
		logger.Error(errMsg)
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         fmt.Sprintf("%s, ask development team to ensure code check on application if GA module is being unregistered", errMsg),
		})
		return errors.New(errMsg)
	}
	gaModule := module.(*ga.GaModule)
	
	var input dto.EndOfDayAggregatesRequest
	err = mapstructure.Decode(t.InputData, &input)
	if err != nil {
		errMsg := fmt.Sprintf("aggregate_collection#taskFunction - error decoding task input: %v", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}
	
	input.ReferenceId = t.WorkflowInstanceId
	
	aggregate, err := gaModule.GetUseCase().EndOfDayAggregatesLoanCancellation(ctx, input)
	if err != nil {
		errMsg := err.Error()
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         errMsg,
		})
		return errors.New(errMsg)
	}
	
	aggregateMap, err := utils.StructToMap(aggregate)
	if err != nil {
		errMsg := err.Error()
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         errMsg,
		})
		return errors.New(errMsg)
	}
	
	tr.OutputData = map[string]interface{}{
		"aggregate_loan_cancellation_result": aggregateMap,
	}
	tr.Status = model.CompletedTask
	
	return nil
}
