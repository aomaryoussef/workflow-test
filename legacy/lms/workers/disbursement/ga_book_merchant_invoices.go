package disbursement

import (
	"context"
	"errors"
	"fmt"
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

type GABookMerchantInvoicesTask struct {
	app app.Application
}

func NewGABookMerchantInvoicesTask(app app.Application) worker.TaskWorker {
	t := &GABookMerchantInvoicesTask{app: app}
	return t
}

func (t *GABookMerchantInvoicesTask) GetName() string {
	return "ga_book_merchant_invoices"
}

func (t *GABookMerchantInvoicesTask) GetTaskFunction() worker.TaskFunction {
	return t.taskFunction
}
func (t *GABookMerchantInvoicesTask) GetBatchSize() int {
	return 1
}
func (t *GABookMerchantInvoicesTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (d *GABookMerchantInvoicesTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) (err error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("Start GA book merchant invoices")

	// process input and map it to GA request
	var input dto.NewMerchantInvoicesRequest
	logger.Debugf("New GA merchant invoice input: %s", t.InputData)
	err = mapstructure.Decode(t.InputData, &input)
	if err != nil {
		logger.Errorf("Error decoding new GA merchant invoice request with message %s", err)
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
	dynamics, err := msdynamicsUseCase.NewMerchantInvoices(ctx, &input)
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
		errMsg := fmt.Sprintf("ga_book_merchant_invoices#taskFunction - error posting merchant invoices to dynamics: %s", err.Error())
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}

	tr.Status = model.CompletedTask

	return nil
}
