package checkout

import (
	"context"
	"time"

	"github.com/btechlabs/lms-lite/modules/financialproduct"
	"github.com/btechlabs/lms-lite/modules/financialproduct/dto"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/mitchellh/mapstructure"
)

type LoadFinancialProductTask struct {
	app app.Application
}

func NewLoadFinancialProductTask(app app.Application) worker.TaskWorker {
	t := &LoadFinancialProductTask{app: app}
	return t
}

func (d *LoadFinancialProductTask) GetName() string {
	return "lms_load_financial_product"
}

func (d *LoadFinancialProductTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start loading financial products")

	var input dto.LoadFinancialProductRequest
	logger.Debugf("Load financial product input: %s", t.InputData)
	err := mapstructure.Decode(t.InputData, &input)
	if err != nil {
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	m, err := d.app.GetModule(financialproduct.FinancialProductModuleName)
	if err != nil {
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}
	servicingModule := m.(*financialproduct.FinancialProductModule)
	useCase := servicingModule.GetUseCase()
	var response dto.LoadFinancialProductResponse
	for _, product := range input.SelectedFinancialProducts {
		logger.Infof("Loading product %s version %s", product.ProductKey, product.ProductVersion)
		fp, err := useCase.GetProduct(ctx, product.ProductKey, product.ProductVersion, true)
		if err != nil {
			logger.Errorf("Error loading financial product with message: ", err)
			tr.Status = model.FailedWithTerminalErrorTask
			return err
		}
		logger.Debugf("Financial product loaded content %s", fp)
		responseItem, err := dto.MapFromDomain(fp)
		if err != nil {
			logger.Errorf("Error mapping financial product response with message: ", err)
			tr.Status = model.FailedWithTerminalErrorTask
			return err
		}
		logger.Debugf("Financial product response content %s", response)
		response.FinancialProducts = append(response.FinancialProducts, responseItem)
	}

	resMap, err := utils.StructToMap(response)
	if err != nil {
		logger.Errorf("Error mapping financial product with message: ", err)
		tr.Status = model.FailedWithTerminalErrorTask
		return err
	}

	logger.Debugf("Financial product mapped content %v", resMap)
	tr.OutputData = resMap

	logger.Info("Finished successful loading financial product")
	return nil
}

func (d *LoadFinancialProductTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *LoadFinancialProductTask) GetBatchSize() int {
	return 1
}
func (d *LoadFinancialProductTask) GetPollInterval() time.Duration {
	return time.Millisecond
}
