package endofday

import (
	"context"
	"errors"
	"time"

	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
)

type EndOfDayAggregatesTask struct {
	app app.Application
}

func NewEndOfDayAggregatesTask(app app.Application) worker.TaskWorker {
	t := &EndOfDayAggregatesTask{app: app}
	return t
}

func (t *EndOfDayAggregatesTask) GetName() string {
	return "lms_get_end_of_day_aggregates"
}

func (t *EndOfDayAggregatesTask) GetTaskFunction() worker.TaskFunction {
	return t.taskFunction
}
func (t *EndOfDayAggregatesTask) GetBatchSize() int {
	return 1
}
func (t *EndOfDayAggregatesTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (t *EndOfDayAggregatesTask) taskFunction(ctx context.Context, task *model.Task, tr *model.TaskResult) (err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("Start end of day aggregates")

	var input dto.EndOfDayAggregatesRequest
	logger.Debugf("End of day aggregates input: %s", task.InputData)
	err = mapstructure.Decode(task.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding task input", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	module, err := t.app.GetModule(ga.GaModuleName)
	if err != nil {
		err = errors.New("module `GaModule` not set in app")
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	gaModule := module.(*ga.GaModule)
	useCase := gaModule.GetUseCase()

	response, err := useCase.EndOfDayAggregates(ctx, &input)
	if err != nil {
		tr.Status = model.FailedTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	responseMap, err := utils.StructToMap(response)
	if err != nil {
		logger.Errorf("Error mapping daily aggregates", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	tr.OutputData = responseMap
	logger.Debugf("Daily aggregates output: %s", tr.OutputData)

	logger.Info("Finished end of day aggregates")
	tr.Status = model.CompletedTask
	return nil
}
