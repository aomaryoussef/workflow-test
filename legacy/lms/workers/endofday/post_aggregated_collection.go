package endofday

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms-lite/modules/msdynamics"
	"github.com/btechlabs/lms-lite/modules/msdynamics/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
	"time"
)

type PostAggregatedCollectionTask struct {
	app app.Application
}

const (
	TaskNamePostAggregatedCollection         = "post_aggregated_collection"
	TaskBatchSizePostAggregatedCollection    = 1
	TaskPollIntervalPostAggregatedCollection = 5 * time.Second
)

func NewPostAggregatedCollectionTask(app app.Application) worker.TaskWorker {
	return &PostAggregatedCollectionTask{app: app}
}

func (d *PostAggregatedCollectionTask) GetName() string {
	return TaskNamePostAggregatedCollection
}

func (d *PostAggregatedCollectionTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *PostAggregatedCollectionTask) GetBatchSize() int {
	return TaskBatchSizePostAggregatedCollection
}
func (d *PostAggregatedCollectionTask) GetPollInterval() time.Duration {
	return TaskPollIntervalPostAggregatedCollection
}

func (d *PostAggregatedCollectionTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
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
			Log:         fmt.Sprintf("%s, ask development team to ensure code check on application if ms-dynamics module is being unregistered", errMsg),
		})
		return errors.New(errMsg)
	}
	msdynamicsModule := module.(*msdynamics.MSDynamicsModule)
	
	aggregateCollectionAccounts := t.InputData["aggregate_collection_accounts"]
	if aggregateCollectionAccounts == nil {
		errMsg := "post_aggregated_collection#taskFunction - aggregate_collection_accounts is nil"
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}
	
	var input dto.PostAggregatedCollectionRequest
	err = mapstructure.Decode(aggregateCollectionAccounts, &input)
	if err != nil {
		errMsg := fmt.Sprintf("post_aggregated_collection#taskFunction - error decoding task input: %v", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}
	
	dynamics, err := msdynamicsModule.GetUseCase().PostAggregatedCollectionsAtEndOfDay(ctx, input)
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
	
	tr.Status = model.CompletedTask
	
	return nil
}
