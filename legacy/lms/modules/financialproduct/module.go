package financialproduct

import (
	"log"

	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/modules/financialproduct/repository"
	"github.com/btechlabs/lms-lite/modules/financialproduct/usecase"
	"github.com/btechlabs/lms-lite/pkg/app"
)

const FinancialProductModuleName = "financialProductModule"

type FinancialProductModule struct {
	useCase usecase.FinancialProductUseCase
}

func NewFinancialProductModule(config config.EnvConfig) app.Module {
	r, err := repository.NewInMemRepository(config)
	if err != nil {
		log.Fatal(err)
	}
	useCase := usecase.NewFinancialProductUseCase(r)
	f := &FinancialProductModule{
		useCase: useCase,
	}
	return f
}

func (m *FinancialProductModule) GetName() string {
	return FinancialProductModuleName
}

func (m *FinancialProductModule) GetUseCase() usecase.FinancialProductUseCase {
	return m.useCase
}
