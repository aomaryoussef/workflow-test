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

type UpdateMerchantAccountStatusTask struct {
	app app.Application
}

func NewUpdateMerchantAccountStatusTask(app app.Application) worker.TaskWorker {
	t := &UpdateMerchantAccountStatusTask{app: app}
	return t
}

func (d *UpdateMerchantAccountStatusTask) GetName() string {
	return "lms_update_merchant_account_status"
}

func (d *UpdateMerchantAccountStatusTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start update merchant account status")

	var input dto.UpdateMerchantAccountStatusRequest
	logger.Debugf("update merchant account status input: %s", t.InputData)
	err := mapstructure.Decode(t.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding update merchant account status request with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	// Check if merchant account exists and is active
	aM, err := d.app.GetModule(financialaccount.FinancialAccountModuleName)
	if err != nil {
		logger.Errorf("Error loading financial account module with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	financialAccountModule := aM.(*financialaccount.FinancialAccountModule)
	financialAccountUseCase := financialAccountModule.GetUseCase()
	if input.Status == dto.AccountStatusActive {
		err = financialAccountUseCase.ActivateFinancialAccount(ctx, input.MerchantId)
	} else if input.Status == dto.AccountStatusInactive {
		err = financialAccountUseCase.DeactivateFinancialAccount(ctx, input.MerchantId)
	}
	if err != nil {
		logger.Errorf("Error updating merchant account with message: ", err)
		tr.ReasonForIncompletion = fmt.Sprintf("Error updating merchant account with message: %s", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	return nil
}

func (d *UpdateMerchantAccountStatusTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *UpdateMerchantAccountStatusTask) GetBatchSize() int {
	return 1
}
func (d *UpdateMerchantAccountStatusTask) GetPollInterval() time.Duration {
	return time.Millisecond
}
