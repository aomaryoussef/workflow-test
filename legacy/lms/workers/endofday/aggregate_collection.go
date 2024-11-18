package endofday

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
	"time"
)

type AggregateCollectionAccountsTask struct {
	app app.Application
}

const (
	TaskNameAggregateCollection         = "aggregate_collection_accounts"
	TaskBatchSizeAggregateCollection    = 1
	TaskPollIntervalAggregateCollection = 5 * time.Second
)

func NewAggregateCollectionAccountsTask(app app.Application) worker.TaskWorker {
	return &AggregateCollectionAccountsTask{app: app}
}

func (d *AggregateCollectionAccountsTask) GetName() string {
	return TaskNameAggregateCollection
}

func (d *AggregateCollectionAccountsTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *AggregateCollectionAccountsTask) GetBatchSize() int {
	return TaskBatchSizeAggregateCollection
}
func (d *AggregateCollectionAccountsTask) GetPollInterval() time.Duration {
	return TaskPollIntervalAggregateCollection
}

func (d *AggregateCollectionAccountsTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	module, err := d.app.GetModule(ga.GaModuleName)
	if err != nil {
		errMsg := "ga module not loaded in the application"
		logger.Error(errMsg)
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         fmt.Sprintf("%s, ask development team to ensure code check on application if GA module is being unregistered", errMsg),
		})
		return errors.New(errMsg)
	}
	gaModule := module.(*ga.GaModule)

	var input dto.EndOfDayAggregatesRequest
	err = mapstructure.Decode(t.InputData, &input)
	if err != nil {
		errMsg := fmt.Sprintf("aggregate_collection#taskFunction - error decoding task input: %v", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = errMsg
		return errors.New(errMsg)
	}

	aggregate, err := gaModule.GetUseCase().EndOfDayAggregatesCollection(ctx, input)
	if err != nil {
		errMsg := err.Error()
		tr.ReasonForIncompletion = errMsg
		tr.Status = model.FailedWithTerminalErrorTask
		tr.Logs = append(tr.Logs, model.TaskExecLog{
			TaskId:      t.TaskId,
			CreatedTime: time.Now().UTC().Unix(),
			Log:         errMsg,
		})
		return errors.New(errMsg)
	}

	responseMap := map[string]interface{}{
		"request": map[string]interface{}{
			"start_time_utc":   aggregate.StartTime.Format(time.RFC3339),
			"end_time_utc":     aggregate.EndTime.Format(time.RFC3339),
			"start_time_given": input.DateRangeStart,
			"end_time_given":   input.DateRangeStart,
		},
		"response": map[string]interface{}{
			"regular_collection": map[string]interface{}{
				"debit_customer_collections":  aggregate.RegularCollections.DebitCustomerCollection.UnitsOrZero(),
				"credit_principal_receivable": aggregate.RegularCollections.CreditMurabahaPrincipalReceivables.UnitsOrZero(),
				"credit_interest_receivable":  aggregate.RegularCollections.CreditMurabahaInterestReceivables.UnitsOrZero(),
			},
			"early_settlement_collection": map[string]interface{}{
				"debit_customer_collections":  aggregate.EarlySettlementCollections.DebitCustomerCollection.UnitsOrZero(),
				"debit_settlement_allowance":  aggregate.EarlySettlementCollections.DebitMurabahaSettlementAllowance.UnitsOrZero(),
				"credit_principal_receivable": aggregate.EarlySettlementCollections.CreditMurabahaPrincipalReceivables.UnitsOrZero(),
				"credit_interest_receivable":  aggregate.EarlySettlementCollections.CreditMurabahaInterestReceivables.UnitsOrZero(),
			},
			"early_settlement_revenue_loss": map[string]interface{}{
				"debit_unearned_revenue":      aggregate.EarlySettlementRevenueLoss.DebitUnearnedRevenue.UnitsOrZero(),
				"credit_settlement_allowance": aggregate.EarlySettlementRevenueLoss.CreditMurabahaSettlementAllowance.UnitsOrZero(),
				"credit_interest_revenue":     aggregate.EarlySettlementRevenueLoss.CreditInterestRevenue.UnitsOrZero(),
			},
		},
		"reference_id": t.WorkflowInstanceId,
	}

	tr.OutputData = map[string]interface{}{
		"aggregate_collection_accounts_result": responseMap,
	}
	tr.Status = model.CompletedTask

	return nil
}
