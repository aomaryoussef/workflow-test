package checkout

import (
	"context"
	"time"

	"github.com/btechlabs/lms-lite/modules/servicing"
	"github.com/btechlabs/lms-lite/modules/servicing/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
)

type ActivateLoanTask struct {
	app app.Application
}

func NewActivateLoanTask(app app.Application) worker.TaskWorker {
	t := &ActivateLoanTask{app: app}
	return t
}

func (d *ActivateLoanTask) GetName() string {
	return "lms_activate_loan"
}

func (d *ActivateLoanTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start loan activation")

	var input dto.ActivateLoanRequest
	logger.Debugf("Loan activation input: %s", t.InputData)
	err := mapstructure.Decode(t.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding loan activation request with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	// Activate loan
	m, err := d.app.GetModule(servicing.ServicingModuleName)
	if err != nil {
		logger.Errorf("Error loading servicing module with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	servicingModule := m.(*servicing.ServicingModule)
	useCase := servicingModule.GetUseCase()
	loan, err := useCase.ActivateLoan(ctx, input)
	if err != nil {
		logger.Errorf("Error during loan activation with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	responseMap, err := utils.StructToMap(loan)
	if err != nil {
		logger.Errorf("Error mapping commercial offer", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	logger.Infof("Finished loan activation")
	tr.OutputData = responseMap
	return nil
}

func (d *ActivateLoanTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *ActivateLoanTask) GetBatchSize() int {
	return 1
}
func (d *ActivateLoanTask) GetPollInterval() time.Duration {
	return time.Millisecond
}
