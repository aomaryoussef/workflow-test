// Description: This file contains the worker task for booking consumer collection to mylo treasury
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

type BookConsumerCollectionToTreasuryTask struct {
	app app.Application
}

const (
	TaskNameBookConsumerCollectionToTreasury         = "book_collection_to_treasury"
	TaskBatchSizeBookConsumerCollectionToTreasury    = 1
	TaskPollIntervalBookConsumerCollectionToTreasury = 5 * time.Second
)

func NewBookConsumerCollectionToTreasuryTask(app app.Application) worker.TaskWorker {
	t := &BookConsumerCollectionToTreasuryTask{app: app}
	return t
}

func (d *BookConsumerCollectionToTreasuryTask) GetName() string {
	return TaskNameBookConsumerCollectionToTreasury
}

func (d *BookConsumerCollectionToTreasuryTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *BookConsumerCollectionToTreasuryTask) GetBatchSize() int {
	return TaskBatchSizeBookConsumerCollectionToTreasury
}
func (d *BookConsumerCollectionToTreasuryTask) GetPollInterval() time.Duration {
	return TaskPollIntervalBookConsumerCollectionToTreasury
}

func validateConsumerCollectionInput(input map[string]interface{}) error {
	requiredStrings := []string{"payment_id", "booking_time", "payment_channel"}
	for _, key := range requiredStrings {
		if _, ok := input[key]; !ok {
			return fmt.Errorf("missing required field: %s", key)
		}
		if _, ok := input[key].(string); !ok {
			return fmt.Errorf("field %s must be a string", key)
		}
	}

	// validate treasury type to be one of the supported types
	treasuryType, ok := input["treasury_type"]
	if !ok {
		return errors.New("missing required field: treasury_type")
	}
	if treasuryType != string(MYLO) && treasuryType != string(BTECH) {
		return errors.New(`"treasuryType" must be one of "BTECH" or "MYLO"`)
	}

	amount, ok := input["amount"]
	if !ok {
		return errors.New("missing required field: amount")
	}
	if amountFloat, ok := amount.(float64); !ok || int(amountFloat) <= 0 {
		return errors.New("field amount must be a positive integer")
	}

	metadata, ok := input["metadata"]
	if !ok {
		return errors.New("missing required field: metadata")
	}
	if _, ok := metadata.(map[string]interface{}); !ok {
		return errors.New("field metadata must be a dictionary")
	}

	return nil
}

func (d *BookConsumerCollectionToTreasuryTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
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

	err = validateConsumerCollectionInput(t.InputData)
	if err != nil {
		logger.Error(err.Error())
		tr.ReasonForIncompletion = err.Error()
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         err.Error(),
		})
		return errors.New(err.Error())
	}

	var input ConsumerCollectionTaskRequest
	err = mapstructure.Decode(t.InputData, &input)
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

	consumerCollection := dynamicsDomain.ConsumerCollectionToTreasury{
		PaymentReferenceId: input.PaymentReferenceId,
		BookingTime:        bookingTime,
		PaidAmountUnits:    input.Amount,
		PaidAmountCurrency: money.Currency_EGP,
		CollectionMethod:   dynamicsDomain.CollectionMethod(input.PaymentChannel),
		Metadata:           input.MetaData,
	}
	consumerCollection.SetBookingTime(bookingTime)

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
	// based on the treasury type, book the collection to the respective treasury
	switch input.TreasuryType {
	case MYLO:
		dynamicsResult, err = dynamicsModule.GetUseCase().BookCollectionMyloTreasury(ctx, consumerCollection)
	case BTECH:
		dynamicsResult, err = dynamicsModule.GetUseCase().BookCollectionBtechTreasury(ctx, consumerCollection)
	default:
		errMsg := fmt.Sprintf("unsupported treasury type: %s", input.TreasuryType)
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
		errMsg := "error booking consumer collection to treasury"
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
