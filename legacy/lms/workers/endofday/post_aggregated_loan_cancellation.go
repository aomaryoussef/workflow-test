package endofday

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/modules/msdynamics"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
	"time"
)

type PostAggregatedLoanCancellationTask struct {
	app app.Application
}

const (
	TaskNamePostAggregatedLoanCancellation             = "post_aggregated_loan_cancellation"
	TaskBatchSizePostAggregatedLoanCancellationTask    = 1
	TaskPollIntervalPostAggregatedLoanCancellationTask = 5 * time.Second
)

func NewPostAggregatedLoanCancellationTask(app app.Application) worker.TaskWorker {
	return &PostAggregatedLoanCancellationTask{app: app}
}

func (d *PostAggregatedLoanCancellationTask) GetName() string {
	return TaskNamePostAggregatedLoanCancellation
}

func (d *PostAggregatedLoanCancellationTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *PostAggregatedLoanCancellationTask) GetBatchSize() int {
	return TaskBatchSizePostAggregatedLoanCancellationTask
}
func (d *PostAggregatedLoanCancellationTask) GetPollInterval() time.Duration {
	return TaskPollIntervalPostAggregatedLoanCancellationTask
}

func (d *PostAggregatedLoanCancellationTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	module, err := d.app.GetModule(msdynamics.MSDynamicsModuleName)
	if err != nil {
		errMsg := "ms-dynamics module not loaded in the application"
		logger.Error(errMsg)
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         fmt.Sprintf("%s, ask development team to ensure code check on application if MS-Dynamics module is being unregistered", errMsg),
		})
		return errors.New(errMsg)
	}
	msDynamicsModule := module.(*msdynamics.MSDynamicsModule)
	
	inputMap := t.InputData["aggregate_loan_cancellation_result"]
	if inputMap == nil {
		errMsg := "aggregate_loan_cancellation_result not found in task input"
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}
	inputData := inputMap.(map[string]interface{})
	
	var input dto.EndOfDayLoanCancellationsAggregate
	err = mapstructure.Decode(inputData, &input)
	if err != nil {
		errMsg := fmt.Sprintf("post_aggregated_loan_cancellation#taskFunction - error decoding task input: %v", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}
	
	dynamics, err := msDynamicsModule.GetUseCase().PostAggregatedLoanCancellationsAtEndOfDay(ctx, input)
	if dynamics != nil {
		outputData := make(map[string]interface{})
		outputData["dynamics_url"] = dynamics.Url
		requestBody, err := utils.JsonBytesToMap(dynamics.RequestBodyJson)
		if err != nil {
			// in case of error, store the request body as string (as best effort)
			outputData["dynamics_request_string"] = string(dynamics.RequestBodyJson)
		} else {
			outputData["dynamics_request"] = requestBody
		}
		responseBody, err := utils.JsonBytesToMap(dynamics.ResponseBodyJson)
		if err != nil {
			// in case of error, store the response body as string (as best effort)
			outputData["dynamics_response_string"] = string(dynamics.ResponseBodyJson)
		} else {
			outputData["dynamics_response"] = responseBody
		}
		
		tr.OutputData = outputData
	}
	
	if err != nil {
		errMsg := fmt.Sprintf("post_aggregated_loan_cancellation#taskFunction - error posting aggregates to dynamics: %s", err.Error())
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}
	
	tr.Status = model.CompletedTask
	
	return nil
}
