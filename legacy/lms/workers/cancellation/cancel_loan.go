package cancellation

import (
	"context"
	"errors"
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

type CancelLoanTask struct {
	app app.Application
}

func NewCancelLoanTask(app app.Application) worker.TaskWorker {
	t := &CancelLoanTask{app: app}
	return t
}

func (c *CancelLoanTask) GetName() string {
	return "lms_cancel_loan"
}

func (c *CancelLoanTask) GetTaskFunction() worker.TaskFunction {
	return c.taskFunction
}

func (c *CancelLoanTask) GetBatchSize() int {
	return 1
}

func (c *CancelLoanTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (c *CancelLoanTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)

	cancelLoanDetails, ok := t.InputData["cancel_loan_details"]
	if !ok {
		errMsg := "cancel_loan_details not found in input data"
		logger.Error(errMsg)
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         errMsg,
		})
		return errors.New(errMsg)
	}

	var input dto.CancelLoanRequest
	err := mapstructure.Decode(cancelLoanDetails, &input)
	if err != nil {
		logger.Errorf("Error decoding loan cancellation request with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	m, err := c.app.GetModule(servicing.ServicingModuleName)
	if err != nil {
		logger.Errorf("Error loading servicing module with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	servicingModule := m.(*servicing.ServicingModule)
	useCase := servicingModule.GetUseCase()
	response, err := useCase.CancelLoan(ctx, input)
	if err != nil {
		logger.Errorf("Error cancelling laon or getting loan amount", err)
		tr.ReasonForIncompletion = err.Error()
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	responseMap, err := utils.StructToMap(*response)
	if err != nil {
		logger.Errorf("Error mapping loan amount with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	logger.Debugf("Loan amount mapped content %s", responseMap)
	tr.OutputData = responseMap

	logger.Info("Finished successful cancelling loan and getting loan amount")
	return nil
}
