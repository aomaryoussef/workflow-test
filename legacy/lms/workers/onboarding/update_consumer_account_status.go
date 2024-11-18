package onboarding

import (
	"context"
	"fmt"
	"time"

	"github.com/btechlabs/lms-lite/modules/financialaccount"
	"github.com/btechlabs/lms-lite/modules/financialaccount/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
)

type UpdateConsumerAccountStatusTask struct {
	app app.Application
}

func NewUpdateConsumerAccountStatusTask(app app.Application) worker.TaskWorker {
	t := &UpdateConsumerAccountStatusTask{app: app}
	return t
}

func (d *UpdateConsumerAccountStatusTask) GetName() string {
	return "lms_update_consumer_account_status"
}

func (d *UpdateConsumerAccountStatusTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start update consumer account status")

	var input dto.UpdateConsumerAccountStatusRequest
	logger.Debugf("update consumer account status input: %s", t.InputData)
	err := mapstructure.Decode(t.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding update consumer account status request with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	// Check if consumer account exists and is active
	aM, err := d.app.GetModule(financialaccount.FinancialAccountModuleName)
	if err != nil {
		logger.Errorf("Error loading financial account module with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	financialAccountModule := aM.(*financialaccount.FinancialAccountModule)
	financialAccountUseCase := financialAccountModule.GetUseCase()
	if input.Status == dto.AccountStatusActive {
		err = financialAccountUseCase.ActivateFinancialAccount(ctx, input.ConsumerId)
	} else if input.Status == dto.AccountStatusInactive {
		err = financialAccountUseCase.DeactivateFinancialAccount(ctx, input.ConsumerId)
	}
	if err != nil {
		logger.Errorf("Error updating consumer account with message: ", err)
		tr.ReasonForIncompletion = fmt.Sprintf("Error updating consumer account with message: %s", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	return nil
}

func (d *UpdateConsumerAccountStatusTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}

func (d *UpdateConsumerAccountStatusTask) GetBatchSize() int {
	return 1
}

func (d *UpdateConsumerAccountStatusTask) GetPollInterval() time.Duration {
	return time.Millisecond
}
