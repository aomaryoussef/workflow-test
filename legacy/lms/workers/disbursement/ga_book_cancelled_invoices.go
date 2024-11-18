package disbursement

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/modules/msdynamics"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
	"time"
)

type GaBookCancelledInvoicesTask struct {
	app app.Application
}

const (
	TaskNameGaBookCancelledInvoices         = "ga_book_cancelled_invoices"
	TaskBatchSizeGaBookCancelledInvoices    = 1
	TaskPollIntervalGaBookCancelledInvoices = 5 * time.Second
)

func NewGaBookCancelledInvoicesTask(app app.Application) worker.TaskWorker {
	return &GaBookCancelledInvoicesTask{app: app}
}

func (d *GaBookCancelledInvoicesTask) GetName() string {
	return TaskNameGaBookCancelledInvoices
}

func (d *GaBookCancelledInvoicesTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *GaBookCancelledInvoicesTask) GetBatchSize() int {
	return TaskBatchSizeGaBookCancelledInvoices
}
func (d *GaBookCancelledInvoicesTask) GetPollInterval() time.Duration {
	return TaskPollIntervalGaBookCancelledInvoices
}

func (d *GaBookCancelledInvoicesTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	module, err := d.app.GetModule(msdynamics.MSDynamicsModuleName)
	if err != nil {
		errMsg := "ms-dynamics module not loaded in the application"
		logger.Error(errMsg)
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         fmt.Sprintf("%s, ask development team to ensure code check on application if MS-Dynamics module is being unregistered", errMsg),
		})
		return errors.New(errMsg)
	}
	msDynamicsModule := module.(*msdynamics.MSDynamicsModule)
	
	module, err = d.app.GetModule(ga.GaModuleName)
	if err != nil {
		errMsg := "ga module module not loaded in the application"
		logger.Error(errMsg)
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         fmt.Sprintf("%s, ask development team to ensure code check on application if ga module is being unregistered", errMsg),
		})
		return errors.New(errMsg)
	}
	gaModule := module.(*ga.GaModule)
	
	var input dto.BookInvoicesRequest
	err = mapstructure.Decode(t.InputData, &input)
	if err != nil {
		errMsg := fmt.Sprintf("ga_book_cancelled_invoices#taskFunction - error decoding task input: %v", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}
	
	aggregate, err := gaModule.GetUseCase().GetMerchantCancelledDisbursements(ctx, dto.EndOfDayAggregatesRequest{
		ReferenceId:    t.WorkflowInstanceId,
		DateRangeStart: input.DateRangeStart,
		DateRangeEnd:   input.DateRangeEnd,
	})
	if err != nil {
		errMsg := fmt.Sprintf("ga_book_cancelled_invoices#taskFunction - failed to aggregate merchant invoices: %v", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}
	
	logData := ""
	logData += fmt.Sprintf("Aggregated %d cancelled invoices\n", len(aggregate.CancelledMerchantDisbursementRecords))
	for _, record := range aggregate.CancelledMerchantDisbursementRecords {
		logData += fmt.Sprintf("MerchantID: %s, PayableUnits: %d\n", record.MerchantGlobalAccountId, record.PayableUnits)
	}
	tr.Logs = append(tr.Logs, model.TaskExecLog{
		TaskId:      t.TaskId,
		CreatedTime: time.Now().UTC().Unix(),
		Log:         logData,
	})
	
	if len(aggregate.CancelledMerchantDisbursementRecords) == 0 {
		tr.Status = model.CompletedTask
		tr.ReasonForIncompletion = "No cancelled invoices to post"
		return nil
	}
	
	dynamics, err := msDynamicsModule.GetUseCase().PostCancelledInvoicesAccount(ctx, *aggregate)
	if dynamics != nil {
		outputData := make(map[string]interface{})
		outputData["dynamics_url"] = dynamics.Url
		requestBody, err := utils.JsonBytesToMap(dynamics.RequestBodyJson)
		if err != nil {
			// in case of error, store the request body as string (as best effort)
			outputData["dynamics_request_string"] = string(dynamics.RequestBodyJson)
		} else {
			outputData["dynamics_request"] = requestBody
		}
		responseBody, err := utils.JsonBytesToMap(dynamics.ResponseBodyJson)
		if err != nil {
			// in case of error, store the response body as string (as best effort)
			outputData["dynamics_response_string"] = string(dynamics.ResponseBodyJson)
		} else {
			outputData["dynamics_response"] = responseBody
		}
		
		tr.OutputData = outputData
	}
	if err != nil {
		errMsg := fmt.Sprintf("ga_book_cancelled_invoices#taskFunction - error posting aggregates to dynamics: %s", err.Error())
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}
	
	tr.Status = model.CompletedTask
	
	return nil
}
