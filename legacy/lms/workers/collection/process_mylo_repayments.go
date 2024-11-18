// Description: This file contains the worker task for booking consumer collection.
package collection

import (
	"context"
	"errors"
	"fmt"
	"reflect"
	"time"

	"github.com/btechlabs/lms-lite/modules/servicing"
	servicingDomain "github.com/btechlabs/lms-lite/modules/servicing/domain"
	servicingDto "github.com/btechlabs/lms-lite/modules/servicing/dto"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/mitchellh/mapstructure"

	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
)

type ProcessMyloRepaymentsTask struct {
	app app.Application
}

const (
	TaskNameProcessMyloRepayments         = "process_mylo_repayments"
	TaskBatchSizeProcessMyloRepayments    = 1
	TaskPollIntervalProcessMyloRepayments = 5 * time.Second
)

func NewProcessMyloRepaymentsTask(app app.Application) worker.TaskWorker {
	return &ProcessMyloRepaymentsTask{app: app}
}

func (d *ProcessMyloRepaymentsTask) GetName() string {
	return TaskNameProcessMyloRepayments
}

func (d *ProcessMyloRepaymentsTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *ProcessMyloRepaymentsTask) GetBatchSize() int {
	return TaskBatchSizeProcessMyloRepayments
}
func (d *ProcessMyloRepaymentsTask) GetPollInterval() time.Duration {
	return TaskPollIntervalProcessMyloRepayments
}

func isValidCollectionMethod(s string) bool {
	for _, m := range servicingDto.CollectionMethods {
		if m == servicingDto.CollectionMethod(s) {
			return true
		}
	}
	return false
}

func validateMyloRepaymentsInput(input map[string]interface{}) error {
	requiredStrings := []string{"payment_id", "booking_time"}
	for _, key := range requiredStrings {
		if _, ok := input[key]; !ok {
			return fmt.Errorf("missing required field: %s", key)
		}
		if _, ok := input[key].(string); !ok {
			return fmt.Errorf("field %s must be a string", key)
		}
	}

	// validate "payment_channel" is one of the supported values in CollectionMethod
	paymentChannel, ok := input["payment_channel"].(string)
	if !ok {
		return errors.New(`"payment_channel" must be a string`)
	}
	if !isValidCollectionMethod(paymentChannel) {
		return errors.New(`"payment_channel" must be one of "BTECH_STORE_CASH" or "FAWRY" or "BTECH_STORE_POS"`)
	}

	repayments := input["mylo_repayments"]
	// Check if "mylo_repayments" is an array
	repaymentsArray, ok := repayments.([]interface{})
	if !ok {
		return errors.New(`"mylo_repayments" must be an array`)
	}

	// Iterate over each object in the array
	for _, item := range repaymentsArray {
		repayment, ok := item.(map[string]interface{})
		if !ok {
			return errors.New(`each item in "mylo_repayments" must be an object`)
		}

		// Validate "loan_id"
		loanID, ok := repayment["loan_id"].(string)
		if !ok || loanID == "" {
			return errors.New(`"loan_id" must be a non-empty string`)
		}

		// Validate "amount"
		amount, _ := repayment["amount"].(float64)
		if int(amount) <= 0 {
			return errors.New("field amount must be a positive integer")
		}

		// Validate "collected_as_early_settlement"
		collectedAsEarlySettlement, ok := repayment["collected_as_early_settlement"].(bool)
		if !ok {
			return errors.New(`"collected_as_early_settlement" must be a boolean`)
		}

		// Validate "loan_schedule_id" based on "collected_as_early_settlement"
		if !collectedAsEarlySettlement {
			if loanScheduleID, ok := repayment["loan_schedule_id"]; !ok || reflect.TypeOf(loanScheduleID).Kind() != reflect.Float64 || loanScheduleID.(float64) <= 0 {
				return errors.New(`"loan_schedule_id" must be a positive integer when "collected_as_early_settlement" is false`)
			}
		} else {
			if loanScheduleID, ok := repayment["loan_schedule_id"]; !ok || loanScheduleID.(float64) != -1 {
				return errors.New(`"loan_schedule_id" must be -1 when "collected_as_early_settlement" is true`)
			}
		}
	}

	return nil
}

func (d *ProcessMyloRepaymentsTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	module, err := d.app.GetModule(servicing.ServicingModuleName)
	if err != nil {
		errMsg := "servicing module not loaded in the application"
		logger.Error(errMsg)
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         fmt.Sprintf("%s, ask development team to ensure code check on application if servicing module is being unregistered", errMsg),
		})
		return errors.New(errMsg)
	}
	servicingModule := module.(*servicing.ServicingModule)

	err = validateMyloRepaymentsInput(t.InputData)
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

	// loop over the myloRepayments, check if the property "collected_as_early_settlement" is set to true, then delete the property "loan_schedule_id"
	// if the property "collected_as_early_settlement" is set to true, then the property "loan_schedule_id" should not be present
	if myloRepayments, ok := t.InputData["mylo_repayments"].([]interface{}); ok {
		for _, myloRepayment := range myloRepayments {
			if repayment, ok := myloRepayment.(map[string]interface{}); ok {
				if collectedAsEarlySettlement, ok := repayment["collected_as_early_settlement"].(bool); ok && collectedAsEarlySettlement {
					delete(repayment, "loan_schedule_id")
				}
			}
		}
	}

	var input ProcessMyloRepaymentsTaskRequest
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

	// create an array of repayLoanRequests from the myloRepayments
	var repayLoanRequests []servicingDto.RepayLoanRequest
	for _, myloRepayment := range input.MyloRepayments {
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
		repayLoanRequest := servicingDto.RepayLoanRequest{
			PaymentReferenceId:         input.PaymentId,
			BillingAccount:             myloRepayment.LoanId,
			BillingAccountScheduleId:   myloRepayment.LoanScheduleId,
			CollectedAsEarlySettlement: myloRepayment.CollectedAsEarlySettlement,
			BookingTime:                bookingTime,
			PaidAmountUnits:            *money.NewMoney(myloRepayment.Amount),
			CollectionMethod:           servicingDto.CollectionMethod(input.PaymentChannel),
		}

		err = repayLoanRequest.Validate()
		if err != nil {
			errMsg := fmt.Sprintf("repay loan request validation failed with message: %s", err)
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
		repayLoanRequests = append(repayLoanRequests, repayLoanRequest)
	}

	// create a responseMap that is an array of singleResponseMap and add it to the outputData
	var responseMap []map[string]interface{}
	var totalPrincipalPaid uint64 = 0
	// a for loop to loop over the repayLoanRequests and call the repayLoan function
	for _, repayLoanRequest := range repayLoanRequests {
		repayLoanResponse, err := servicingModule.GetUseCase().RepayLoan(ctx, repayLoanRequest)
		if err != nil {
			errMsg := err.Error()
			tr.ReasonForIncompletion = errMsg
			tr.Logs = append(tr.Logs, model.TaskExecLog{
				TaskId:      t.TaskId,
				CreatedTime: time.Now().UTC().Unix(),
				Log:         errMsg,
			})

			switch {
			case errors.Is(err, servicingDomain.ErrInvalidPaymentScheduleId),
				errors.Is(err, servicingDomain.ErrPaidAmountIsNotSameAsDueAmount),
				errors.Is(err, servicingDomain.ErrRecurringPaymentRequestWithDifferentRefId):
				tr.Status = model.FailedWithTerminalErrorTask // no point of retrying
			default:
				tr.Status = model.FailedTask // this will retry
			}

			return err
		}

		singleResponseMap := map[string]interface{}{
			"loan_id":                       repayLoanResponse.LoanId,
			"collected_as_early_settlement": repayLoanResponse.CollectedAsEarlySettlement,
			"payment_reference_id":          repayLoanResponse.PaymentReferenceId,
			"booked_at":                     repayLoanResponse.BookedAt.String(),
			"total_amount_paid":             repayLoanResponse.TotalAmountPaid,
			"total_late_fee_paid":           repayLoanResponse.TotalLateFeePaid,
			"total_interest_paid":           repayLoanResponse.TotalInterestPaid,
			"total_principal_paid":          repayLoanResponse.TotalPrincipalPaid,
			"total_late_fee_due":            repayLoanResponse.TotalLateFeeDue,
			"total_interest_due":            repayLoanResponse.TotalInterestDue,
			"total_principal_due":           repayLoanResponse.TotalPrincipalDue,
		}
		if repayLoanResponse.ScheduleId != nil {
			singleResponseMap["schedule_id"] = *repayLoanResponse.ScheduleId

		}
		if repayLoanResponse.ScheduleNumberInLoan != -1 {
			singleResponseMap["schedule_number_in_loan"] = repayLoanResponse.ScheduleNumberInLoan
		}
		totalPrincipalPaid += repayLoanResponse.TotalPrincipalPaid
		responseMap = append(responseMap, singleResponseMap)
	}

	tr.OutputData = map[string]interface{}{
		"processed_mylo_repayments": responseMap,
		"total_principal_paid":      totalPrincipalPaid,
	}
	tr.Status = model.CompletedTask

	return nil
}
