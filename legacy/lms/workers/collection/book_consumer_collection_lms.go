// Books & Processes the payment received from any channel into LMS Loan Schedule and Journal
package collection

import (
	"context"
	"errors"
	"fmt"
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

type BookConsumerCollectionLmsTask struct {
	app app.Application
}

const (
	TaskNameBookConsumerCollectionLms         = "process_collection_lms"
	TaskBatchSizeBookConsumerCollectionLms    = 1
	TaskPollIntervalBookConsumerCollectionLms = 5 * time.Second
)

func NewBookConsumerCollectionLmsTask(app app.Application) worker.TaskWorker {
	return &BookConsumerCollectionLmsTask{app: app}
}

func (d *BookConsumerCollectionLmsTask) GetName() string {
	return TaskNameBookConsumerCollectionLms
}

func (d *BookConsumerCollectionLmsTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *BookConsumerCollectionLmsTask) GetBatchSize() int {
	return TaskBatchSizeBookConsumerCollectionLms
}
func (d *BookConsumerCollectionLmsTask) GetPollInterval() time.Duration {
	return TaskPollIntervalBookConsumerCollectionLms
}

func (d *BookConsumerCollectionLmsTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
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

	repayLoanRequest := servicingDto.RepayLoanRequest{
		PaymentReferenceId:         input.PaymentReferenceId,
		BillingAccount:             input.BillingAccount,
		BillingAccountScheduleId:   input.BillingAccountScheduleId,
		CollectedAsEarlySettlement: input.CollectedAsEarlySettlement,
		BookingTime:                bookingTime,
		PaidAmountUnits:            *money.NewMoney(input.PaidAmountUnits),
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

	responseMap := map[string]interface{}{
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
		responseMap["schedule_id"] = *repayLoanResponse.ScheduleId

	}
	if repayLoanResponse.ScheduleNumberInLoan != -1 {
		responseMap["schedule_number_in_loan"] = repayLoanResponse.ScheduleNumberInLoan
	}

	tr.OutputData = map[string]interface{}{
		"process_collection_lms_response": responseMap,
	}
	tr.Status = model.CompletedTask

	return nil
}
