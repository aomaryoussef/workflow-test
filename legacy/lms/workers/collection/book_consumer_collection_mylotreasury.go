// Books the payment received from any channel into MYLO treasury
package collection

import (
	"context"
	"errors"
	"fmt"
	"time"

	dynamics "github.com/btechlabs/lms-lite/modules/msdynamics"
	dynamicsDomain "github.com/btechlabs/lms-lite/modules/msdynamics/domain"
	"github.com/btechlabs/lms-lite/modules/msdynamics/dto"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/mitchellh/mapstructure"

	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
)

type BookConsumerCollectionMyloTreasuryTask struct {
	app app.Application
}

const (
	TaskNameBookConsumerCollectionMyloTreasury         = "book_collection_mylo_treasury"
	TaskBatchSizeBookConsumerCollectionMyloTreasury    = 1
	TaskPollIntervalBookConsumerCollectionMyloTreasury = 5 * time.Second
)

func NewBookConsumerCollectionMyloTreasuryTask(app app.Application) worker.TaskWorker {
	t := &BookConsumerCollectionMyloTreasuryTask{app: app}
	return t
}

func (d *BookConsumerCollectionMyloTreasuryTask) GetName() string {
	return TaskNameBookConsumerCollectionMyloTreasury
}

func (d *BookConsumerCollectionMyloTreasuryTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *BookConsumerCollectionMyloTreasuryTask) GetBatchSize() int {
	return TaskBatchSizeBookConsumerCollectionMyloTreasury
}
func (d *BookConsumerCollectionMyloTreasuryTask) GetPollInterval() time.Duration {
	return TaskPollIntervalBookConsumerCollectionMyloTreasury
}

func (d *BookConsumerCollectionMyloTreasuryTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	module, err := d.app.GetModule(dynamics.MSDynamicsModuleName)
	if err != nil {
		errMsg := "dynamics module not loaded in the application"
		logger.Error(errMsg)
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         fmt.Sprintf("%s, ask development team to ensure code check on application if dynamics module is being unregistered", errMsg),
		})
		return errors.New(errMsg)
	}
	dynamicsModule := module.(*dynamics.MSDynamicsModule)

	paymentDetails, ok := t.InputData["payment_details"].(map[string]interface{})
	if !ok {
		errMsg := "payment_details not found in input data"
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

	// Check if collected_as_early_settlement is true
	if collectedAsEarlySettlement, ok := paymentDetails["collected_as_early_settlement"].(bool); ok && collectedAsEarlySettlement {
		delete(paymentDetails, "billing_account_schedule_id")
	}

	var input BookConsumerCollectionTaskRequest
	err = mapstructure.Decode(paymentDetails, &input)
	if err != nil {
		errMsg := "error decoding consumer collection request with message"
		logger.Error(fmt.Sprintf("%s: %v", errMsg, err))

		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         errMsg,
		})
		return errors.Join(errors.New(errMsg), err)
	}

	bookingTime, err := time.Parse(time.RFC3339, input.BookingTime)
	if err != nil {
		errMsg := "error parsing booking time"
		logger.Error(fmt.Sprintf("%s: %v", errMsg, err))

		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         errMsg,
		})
		return errors.Join(errors.New(errMsg), err)
	}

	var consumerCollection dynamicsDomain.ConsumerCollection

	switch input.Channel {
	case "BTECH_STORE":
		consumerCollection = &dynamicsDomain.ConsumerCollectionBTechStoreChannel{
			PaymentReferenceId: input.PaymentReferenceId,
			BillingAccount:     input.BillingAccount,
			BookingTime:        bookingTime,
			PaidAmountUnits:    input.PaidAmountUnits,
			PaidAmountCurrency: money.Currency_EGP,
			CollectionStoreId:  input.RawRequest.CollectionStoreID,
			CollectedBy:        input.CreatedBy,
			PaymentMethod:      input.RawRequest.PaymentMethodCode,
		}
	case "FAWRY":
		consumerCollection = &dynamicsDomain.ConsumerCollectionFawryChannel{
			PaymentReferenceId: input.PaymentReferenceId,
			BillingAccount:     input.BillingAccount,
			BookingTime:        bookingTime,
			PaidAmountUnits:    input.PaidAmountUnits,
			PaidAmountCurrency: money.Currency_EGP,
		}
	default:
		errMsg := fmt.Sprintf("unsupported channel: %s", input.Channel)
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
	err = consumerCollection.Validate()
	if err != nil {
		errMsg := fmt.Sprintf("consumer collection validation failed with message: %s", err)
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

	var dynamicsResult *dto.DynamicsRequestResponse

	switch cc := consumerCollection.(type) {
	case *dynamicsDomain.ConsumerCollectionBTechStoreChannel:
		dynamicsResult, err = dynamicsModule.GetUseCase().BookConsumerCollectionMyloTreasuryBTechStoreChannel(ctx, *cc)
	case *dynamicsDomain.ConsumerCollectionFawryChannel:
		dynamicsResult, err = dynamicsModule.GetUseCase().BookConsumerCollectionMyloTreasuryFawryChannel(ctx, *cc)
	default:
		errMsg := "unsupported consumer collection type"
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

	if dynamicsResult != nil {
		outputData := make(map[string]interface{})
		outputData["dynamics_url"] = dynamicsResult.Url
		requestBody, err := utils.JsonBytesToMap(dynamicsResult.RequestBodyJson)
		if err != nil {
			// in case of error, store the request body as string (as best effort)
			outputData["dynamics_request_string"] = string(dynamicsResult.RequestBodyJson)
		} else {
			outputData["dynamics_request"] = requestBody
		}
		responseBody, err := utils.JsonBytesToMap(dynamicsResult.ResponseBodyJson)
		if err != nil {
			// in case of error, store the response body as string (as best effort)
			outputData["dynamics_response_string"] = string(dynamicsResult.ResponseBodyJson)
		} else {
			outputData["dynamics_response"] = responseBody
		}

		tr.OutputData = outputData
	}
	if err != nil {
		errMsg := "error booking consumer collection to mylo treasury"
		logger.Error(fmt.Sprintf("%s: %v", errMsg, err))

		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         errMsg,
		})
		return errors.Join(errors.New(errMsg), err)
	}

	tr.Status = model.CompletedTask

	return nil
}
