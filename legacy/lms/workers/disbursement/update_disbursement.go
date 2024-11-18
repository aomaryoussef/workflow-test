package disbursement

import (
	"context"
	"time"

	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
)

type UpdateDisbursementTask struct {
	app app.Application
}

func NewUpdateDisbursementTask(app app.Application) worker.TaskWorker {
	t := &UpdateDisbursementTask{app: app}
	return t
}

func (t *UpdateDisbursementTask) GetName() string {
	return "lms_disbursement"
}

func (t *UpdateDisbursementTask) GetTaskFunction() worker.TaskFunction {
	return t.taskFunction
}
func (t *UpdateDisbursementTask) GetBatchSize() int {
	return 1
}
func (t *UpdateDisbursementTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (t *UpdateDisbursementTask) taskFunction(ctx context.Context, task *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start disbursement status update")

	var input dto.UpdateDisbursementStatusRequest
	logger.Debugf("Disbursement update input: %s", task.InputData)
	err := utils.Decode(task.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding task input", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	module, err := t.app.GetModule(ga.GaModuleName)
	if err != nil {
		logger.Errorf("Error loading General Accounting module with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	gaModule := module.(*ga.GaModule)
	useCase := gaModule.GetUseCase()

	err = useCase.UpdateDisbursement(ctx, input)
	if err != nil {
		logger.Errorf("Error updating disbursement with message: ", err)
		tr.Status = model.FailedTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	logger.Info("Finished disbursement update")
	tr.Status = model.CompletedTask
	return nil
}
