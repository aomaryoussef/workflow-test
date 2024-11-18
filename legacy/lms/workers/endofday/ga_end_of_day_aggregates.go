package endofday

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/btechlabs/lms-lite/modules/msdynamics"
	"github.com/btechlabs/lms-lite/modules/msdynamics/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
)

type GAEndOfDayAggregatesTask struct {
	app app.Application
}

func NewGAEndOfDayAggregatesTask(app app.Application) worker.TaskWorker {
	t := &GAEndOfDayAggregatesTask{app: app}
	return t
}

func (t *GAEndOfDayAggregatesTask) GetName() string {
	return "ga_end_of_day_aggregates"
}

func (t *GAEndOfDayAggregatesTask) GetTaskFunction() worker.TaskFunction {
	return t.taskFunction
}
func (t *GAEndOfDayAggregatesTask) GetBatchSize() int {
	return 1
}
func (t *GAEndOfDayAggregatesTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (d *GAEndOfDayAggregatesTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) (err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("Start GA end of day aggregates")

	// process input and map it to GA request
	var input dto.GeneralJournalEndOfDayAggregatesRequest
	logger.Debugf("GA end of day aggregates input: %s", t.InputData)
	err = mapstructure.Decode(t.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding GA end of day aggregates request with message %s", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	// call GA http request
	msD, err := d.app.GetModule(msdynamics.MSDynamicsModuleName)
	if err != nil {
		logger.Errorf("Error loading msdynamics module with message: %s", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	msdynamicsModule := msD.(*msdynamics.MSDynamicsModule)
	msdynamicsUseCase := msdynamicsModule.GetUseCase()
	dynamics, err := msdynamicsUseCase.EndOfDayAggregates(ctx, &input)
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
		errMsg := fmt.Sprintf("ga_end_of_day_aggregates#taskFunction - error posting aggregates to dynamics: %s", err.Error())
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}

	tr.Status = model.CompletedTask

	return nil
}
