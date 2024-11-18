package financialaccount

import (
	"github.com/btechlabs/lms-lite/modules/financialaccount/repository"
	"github.com/btechlabs/lms-lite/modules/financialaccount/usecase"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/sql"
)

const FinancialAccountModuleName = "financialAccountModule"

type FinancialAccountModule struct {
	useCase usecase.FinancialAccountUseCase
}

func NewFinancialAccountModule(pg sql.PgConnectionManager) app.Module {
	repo := repository.NewPartyAccountPostgresRepository(pg)

	useCase := usecase.NewFinancialAccountUseCase(repo)
	f := &FinancialAccountModule{
		useCase: useCase,
	}
	return f
}

func (m *FinancialAccountModule) GetName() string {
	return FinancialAccountModuleName
}

func (m *FinancialAccountModule) GetUseCase() usecase.FinancialAccountUseCase {
	return m.useCase
}
