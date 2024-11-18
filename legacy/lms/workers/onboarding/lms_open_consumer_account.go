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
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
)

type OpenConsumerAccountTask struct {
	app app.Application
}

func NewOpenConsumerAccountTask(app app.Application) worker.TaskWorker {
	t := &OpenConsumerAccountTask{app: app}
	return t
}

func (d *OpenConsumerAccountTask) GetName() string {
	return "lms_open_consumer_account"
}

func (d *OpenConsumerAccountTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start open consumer account")

	var input dto.OpenConsumerAccountRequest
	logger.Debugf("open consumer account input: %s", t.InputData)
	err := mapstructure.Decode(t.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding open consumer account request with message: ", err)
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
	_, err = financialAccountUseCase.CreateFinancialAccount(ctx, input.ConsumerId, faDomain.PartyAccountTypeIndividual)
	if err != nil {
		logger.Errorf("Error creating consumer account with message: ", err)
		tr.ReasonForIncompletion = fmt.Sprintf("Error creating consumer account with message: %s", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	logger.Infof("Finished open consumer account on GA")
	return nil
}

func (d *OpenConsumerAccountTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}

func (d *OpenConsumerAccountTask) GetBatchSize() int {
	return 1
}

func (d *OpenConsumerAccountTask) GetPollInterval() time.Duration {
	return time.Millisecond
}
