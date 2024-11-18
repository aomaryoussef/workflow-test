package onboarding

import (
	"context"
	"fmt"
	"time"

	"github.com/btechlabs/lms-lite/modules/financialaccount"
	faDomain "github.com/btechlabs/lms-lite/modules/financialaccount/domain"
	"github.com/btechlabs/lms-lite/modules/financialaccount/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
)

type OpenMerchantAccountTask struct {
	app app.Application
}

func NewOpenMerchantAccountTask(app app.Application) worker.TaskWorker {
	t := &OpenMerchantAccountTask{app: app}
	return t
}

func (d *OpenMerchantAccountTask) GetName() string {
	return "lms_open_merchant_account"
}

func (d *OpenMerchantAccountTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start open merchant account on LMS")

	var input dto.OpenMerchantAccountRequest
	logger.Debugf("open merchant account input: %s", t.InputData)
	err := mapstructure.Decode(t.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding open merchant account request with message: ", err)
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
	id, err := financialAccountUseCase.CreateFinancialAccount(ctx, input.MerchantId, faDomain.PartyAccountTypeMerchant)
	if err != nil {
		logger.Errorf("Error creating merchant account with message: ", err)
		tr.ReasonForIncompletion = fmt.Sprintf("Error creating merchant account with message: %s", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	output := dto.OpenMerchantAccountResponse{
		Id: id,
	}
	responseMap, err := utils.StructToMap(output)
	if err != nil {
		logger.Errorf("Error mapping merchant id from LMS", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	logger.Infof("Finished open merchant account on LMS")
	tr.OutputData = responseMap
	return nil
}

func (d *OpenMerchantAccountTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *OpenMerchantAccountTask) GetBatchSize() int {
	return 1
}
func (d *OpenMerchantAccountTask) GetPollInterval() time.Duration {
	return time.Millisecond
}
