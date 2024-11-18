package endofday

import (
	"context"
	"errors"
	"time"

	"github.com/btechlabs/lms-lite/modules/servicing"
	"github.com/btechlabs/lms-lite/modules/servicing/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
)

type RecognizeInterestRevenueTask struct {
	app app.Application
}

func NewRecognizeInterestRevenueTask(app app.Application) worker.TaskWorker {
	t := &RecognizeInterestRevenueTask{app: app}
	return t
}

func (t *RecognizeInterestRevenueTask) GetName() string {
	return "lms_recognize_interest_revenue"
}

func (t *RecognizeInterestRevenueTask) GetTaskFunction() worker.TaskFunction {
	return t.taskFunction
}
func (t *RecognizeInterestRevenueTask) GetBatchSize() int {
	return 1
}
func (t *RecognizeInterestRevenueTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (t *RecognizeInterestRevenueTask) taskFunction(ctx context.Context, task *model.Task, tr *model.TaskResult) (err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("Start recognizing interest revenue")

	var input dto.EndOfDayRequest
	logger.Debugf("Recognizing interest revenue input: %s", task.InputData)
	err = mapstructure.Decode(task.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding task input", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	module, err := t.app.GetModule(servicing.ServicingModuleName)
	if err != nil {
		err = errors.New("module `ServicingModule` not set in app")
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	servicingModule := module.(*servicing.ServicingModule)
	useCase := servicingModule.GetUseCase()

	err = useCase.RecognizeInterestRevenueEarned(ctx, &input)
	if err != nil {
		tr.Status = model.FailedTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	// TODO: respond with loans that were recognized as their due date is in given range

	logger.Info("Finished recognizing interest revenues")
	tr.Status = model.CompletedTask
	return nil
}
