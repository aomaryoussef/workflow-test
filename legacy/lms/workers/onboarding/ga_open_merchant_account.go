package onboarding

import (
	"context"
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

type GAOpenMerchantAccountTask struct {
	app app.Application
}

func NewGAOpenMerchantAccountTask(app app.Application) worker.TaskWorker {
	t := &GAOpenMerchantAccountTask{app: app}
	return t
}

func (d *GAOpenMerchantAccountTask) GetName() string {
	return "ga_open_merchant_account"
}

func (d *GAOpenMerchantAccountTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *GAOpenMerchantAccountTask) GetBatchSize() int {
	return 1
}
func (d *GAOpenMerchantAccountTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (d *GAOpenMerchantAccountTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start open merchant account on GA")

	// process input and map it to GA request
	var input dto.OpenMerchantAccountRequest
	logger.Debugf("Open GA merchant account input: %s", t.InputData)
	err := mapstructure.Decode(t.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding open GA merchant account request with message %s", err)
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
	account, err := msdynamicsUseCase.OpenMerchantAccount(ctx, &input)
	if err != nil {
		logger.Errorf("Error opening merchant account in GA with message: %s", err)
		tr.Status = model.FailedTask
		return err
	}
	// TODO: check for timeout, if timeout, return with retryable error on task result
	responseMap, err := utils.StructToMap(account)
	if err != nil {
		logger.Errorf("Error mapping merchant account from GA", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	logger.Infof("Finished open merchant account on GA")
	tr.OutputData = responseMap
	return nil
}
