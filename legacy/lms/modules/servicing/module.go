package servicing

import (
	"github.com/btechlabs/lms-lite/config"
	financialAccount "github.com/btechlabs/lms-lite/modules/financialaccount"
	financialProduct "github.com/btechlabs/lms-lite/modules/financialproduct"
	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/journal"
	"github.com/btechlabs/lms-lite/modules/servicing/repository"
	"github.com/btechlabs/lms-lite/modules/servicing/usecase"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/sql"
)

const ServicingModuleName = "servicingModule"

type ServicingModule struct {
	useCase usecase.ServicingUseCase
}

func NewServicingModule(financialProductModule app.Module, financialAccountModule app.Module, journalModule app.Module, gaModule app.Module, pg sql.PgConnectionManager, conf config.EnvConfig) app.Module {
	fpm := financialProductModule.(*financialProduct.FinancialProductModule)
	fam := financialAccountModule.(*financialAccount.FinancialAccountModule)
	jm := journalModule.(*journal.JournalModule)
	ga := gaModule.(*ga.GaModule)
	repo := repository.NewServicingPostgresRepository(pg)

	useCase := usecase.NewServicingUseCase(fpm.GetUseCase(), fam.GetUseCase(), jm.GetUseCase(), ga.GetUseCase(), repo, conf)
	f := &ServicingModule{
		useCase: useCase,
	}
	return f
}

func (m *ServicingModule) GetName() string {
	return ServicingModuleName
}

func (m *ServicingModule) GetUseCase() usecase.ServicingUseCase {
	return m.useCase
}
