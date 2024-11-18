package checkout

import (
	"context"
	"github.com/btechlabs/lms-lite/modules/servicing"
	"github.com/btechlabs/lms-lite/modules/servicing/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
	"time"
)

type FilterCommercialOfferTask struct {
	app app.Application
}

func NewFilterCommercialOfferTask(app app.Application) worker.TaskWorker {
	t := &FilterCommercialOfferTask{app: app}
	return t
}

func (t *FilterCommercialOfferTask) GetName() string {
	return "lms_filter_commercial_offers"
}

func (t *FilterCommercialOfferTask) GetTaskFunction() worker.TaskFunction {
	return t.taskFunction
}
func (t *FilterCommercialOfferTask) GetBatchSize() int {
	return 1
}
func (t *FilterCommercialOfferTask) GetPollInterval() time.Duration {
	return time.Millisecond
}
func (t *FilterCommercialOfferTask) taskFunction(ctx context.Context, task *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("Start filtering commercial offers")
	var input dto.FilterCommercialOfferRequest
	
	err := mapstructure.Decode(task.InputData, &input)
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
	config := t.app.EnvConfig()
	servicingModule := module.(*servicing.ServicingModule)
	useCase := servicingModule.GetUseCase()
	filterResponse, err := useCase.FilterCommercialOffers(ctx, &input, config.CreditRisk.BaseUrl, config.CreditRisk.AuthToken)
	if err != nil {
		logger.Errorf("Error getting filtered commercial offer", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	if filterResponse == nil {
		logger.Errorf("Error getting filtered commercial offer from client")
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = "Error getting filtered commercial offer from client"
		return err
	}
	
	if filterResponse == nil {
		logger.Errorf("Error getting filtered commercial offer from client")
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = "Error getting filtered commercial offer from client"
		return err
	}
	
	if filterResponse.OffersDetails == nil {
		logger.Errorf("user has no acceptable commercial offers status %s, rejection reason: %s", filterResponse.Status, filterResponse.RejectionReason)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = filterResponse.RejectionReason
		return err
	}
	
	response, err := dto.MapDomainToWorkerOutput(filterResponse)
	if err != nil {
		logger.Errorf("Error decoding commercial offer", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	
	responseMap, err := utils.StructToMap(response)
	if err != nil {
		logger.Errorf("Error mapping filtered commercial offer", err)
		tr.Status = model.FailedWithTerminalErrorTask
		tr.ReasonForIncompletion = err.Error()
		return err
	}
	tr.OutputData = responseMap
	logger.Debugf("filtered commercial offer output: %s", tr.OutputData)
	
	logger.Info("Finished successful filtering commercial offers")
	return nil
}
