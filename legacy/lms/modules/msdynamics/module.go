package msdynamics

import (
	"github.com/btechlabs/lms-lite/config"
	http_client "github.com/btechlabs/lms-lite/internal/clients/http"
	"github.com/btechlabs/lms-lite/modules/msdynamics/repository"
	moduleRepo "github.com/btechlabs/lms-lite/modules/msdynamics/repository"
	"github.com/btechlabs/lms-lite/modules/msdynamics/usecase"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/sql"
)

const MSDynamicsModuleName = "msDynamicsModule"

type MSDynamicsModule struct {
	useCase usecase.MSDynamicsUseCase
}

func NewMSDynamicsModule(pg sql.PgConnectionManager, conf config.EnvConfig) app.Module {
	client := http_client.NewHttpMSDynamicsClient(conf)
	coaMap, err := moduleRepo.LoadChartOfAccountsMap(conf.AssetsPath)
	if err != nil {
		panic(err)
	}
	r := repository.NewMSDynamicsServiceRepository(coaMap, client, pg)
	useCase := usecase.NewMSDynamicsUseCase(r)
	f := &MSDynamicsModule{
		useCase: useCase,
	}
	return f
}

func (m *MSDynamicsModule) GetName() string {
	return MSDynamicsModuleName
}

func (m *MSDynamicsModule) GetUseCase() usecase.MSDynamicsUseCase {
	return m.useCase
}
