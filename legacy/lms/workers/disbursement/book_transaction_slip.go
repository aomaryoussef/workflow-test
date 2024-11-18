package disbursement

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/btechlabs/lms-lite/pkg/utils"

	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
)

type BookTransactionSlipTask struct {
	app app.Application
}

func NewBookTransactionSlipTask(app app.Application) worker.TaskWorker {
	t := &BookTransactionSlipTask{app: app}
	return t
}

func (t *BookTransactionSlipTask) GetName() string {
	return "book_transaction_slip"
}

func (t *BookTransactionSlipTask) GetTaskFunction() worker.TaskFunction {
	return t.taskFunction
}
func (t *BookTransactionSlipTask) GetBatchSize() int {
	return 1
}
func (t *BookTransactionSlipTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (t *BookTransactionSlipTask) taskFunction(ctx context.Context, task *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("Start book_transaction_slip")
	var err error

	activatedLoanJson := task.InputData["activated_loan"].(map[string]interface{})
	if activatedLoanJson == nil {
		err = errors.New("cannot find `activated_loan` as task input")
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	b, err := utils.MapToBytes(activatedLoanJson)
	if err != nil {
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	var lts dto.LoanTransactionRequest
	err = json.Unmarshal(b, &lts)
	if err != nil {
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

	err = useCase.BookLoanTransactionSlip(ctx, lts)
	if err != nil {
		tr.Status = model.FailedTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	logger.Info("Finished successful confirming disbursements")
	tr.Status = model.CompletedTask
	return nil
}
