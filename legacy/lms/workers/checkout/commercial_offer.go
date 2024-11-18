package checkout

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms-lite/modules/servicing/domain"
	"github.com/samber/lo"
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

type CommercialOfferTask struct {
	app app.Application
}

func NewCommercialOfferTask(app app.Application) worker.TaskWorker {
	t := &CommercialOfferTask{app: app}
	return t
}

func (t *CommercialOfferTask) GetName() string {
	return "lms_create_commercial_offers"
}

func (t *CommercialOfferTask) GetTaskFunction() worker.TaskFunction {
	return t.taskFunction
}
func (t *CommercialOfferTask) GetBatchSize() int {
	return 1
}
func (t *CommercialOfferTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (t *CommercialOfferTask) taskFunction(ctx context.Context, task *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("Start creating commercial allOffers")

	var input dto.CreateCommercialOfferRequest
	logger.Debugf("Create commercial offer input: %s", task.InputData)
	err := mapstructure.Decode(task.InputData, &input)
	//TODO add input validation
	if err != nil {
		logger.Errorf("Error decoding task input", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	module, err := t.app.GetModule(servicing.ServicingModuleName)
	if err != nil {
		logger.Errorf("Error getting module", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	servicingModule := module.(*servicing.ServicingModule)
	useCase := servicingModule.GetUseCase()
	allOffers, err := useCase.GetCommercialOffers(ctx, input)
	if err != nil {
		logger.Errorf("Error getting commercial offer", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	acceptedOffers := lo.Filter(allOffers, func(item domain.CommercialOffer, index int) bool {
		return item.Rejected == false
	})

	response, err := dto.MapFromDomain(acceptedOffers)
	if err != nil {
		logger.Errorf("Error decoding commercial offer", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}

	responseMap, err := utils.StructToMap(response)
	if err != nil {
		logger.Errorf("Error mapping commercial offer", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	tr.OutputData = responseMap
	logger.Debugf("Commercial offer output: %s", tr.OutputData)

	appendConductorLogs(task, tr, allOffers)

	logger.Info("Finished successful creating commercial allOffers")
	return nil
}

func appendConductorLogs(task *model.Task, tr *model.TaskResult, allOffers []domain.CommercialOffer) {
	tr.Logs = append(tr.Logs, model.TaskExecLog{
		TaskId:      task.TaskId,
		Log:         "If you have clicked here, I am so sorry for your life choices. Let this guy help you with debugging. With love, Sid ;)\n\n",
		CreatedTime: time.Now().Unix(),
	})
	for _, offer := range allOffers {
		if offer.Rejected {
			tr.Logs = append(tr.Logs, model.TaskExecLog{
				TaskId:      task.TaskId,
				Log:         fmt.Sprintf("-> For financial product: %s and tenor: %s rejected: %v with reason: %s", offer.FinancialProductKey, offer.FinancialProductVersion, offer.Rejected, offer.RejectionReason),
				CreatedTime: time.Now().Unix(),
			})
		}
	}
}
