package ga

import (
	financialAccount "github.com/btechlabs/lms-lite/modules/financialaccount"
	"github.com/btechlabs/lms-lite/modules/ga/repository"
	"github.com/btechlabs/lms-lite/modules/ga/usecase"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/sql"
)

const GaModuleName = "gaModule"

type GaModule struct {
	useCase usecase.GaUseCase
}

func NewGaModule(pg sql.PgConnectionManager, financialAccountModule app.Module) app.Module {
	fam := financialAccountModule.(*financialAccount.FinancialAccountModule)

	r := repository.NewGaPostgresRepository(pg)
	useCase := usecase.NewGaUseCase(fam.GetUseCase(), r)
	f := &GaModule{
		useCase: useCase,
	}
	return f
}

func (m *GaModule) GetName() string {
	return GaModuleName
}

func (m *GaModule) GetUseCase() usecase.GaUseCase {
	return m.useCase
}
