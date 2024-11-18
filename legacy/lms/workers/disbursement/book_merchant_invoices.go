package disbursement

import (
	"context"
	"errors"
	"time"

	"github.com/mitchellh/mapstructure"

	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
)

type BookMerchantInvoicesTask struct {
	app app.Application
}

func NewBookMerchantInvoicesTask(app app.Application) worker.TaskWorker {
	t := &BookMerchantInvoicesTask{app: app}
	return t
}

func (t *BookMerchantInvoicesTask) GetName() string {
	return "book_merchant_invoices"
}

func (t *BookMerchantInvoicesTask) GetTaskFunction() worker.TaskFunction {
	return t.taskFunction
}
func (t *BookMerchantInvoicesTask) GetBatchSize() int {
	return 1
}
func (t *BookMerchantInvoicesTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (t *BookMerchantInvoicesTask) taskFunction(ctx context.Context, task *model.Task, tr *model.TaskResult) (err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("Start book_merchant_invoices")

	var input dto.BookInvoicesRequest
	logger.Debugf("Book merchant invoices input: %s", task.InputData)
	err = mapstructure.Decode(task.InputData, &input)
	//TODO add input validation
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

	response, err := useCase.BookMerchantInvoices(ctx, &input)
	if err != nil {
		tr.Status = model.FailedTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	responseMap, err := utils.StructToMap(response)
	if err != nil {
		logger.Errorf("Error mapping merchant disbursements", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	tr.OutputData = responseMap
	logger.Debugf("Merchant disbursements output: %s", tr.OutputData)

	logger.Info("Finished book_merchant_invoices")
	tr.Status = model.CompletedTask
	return nil
}
