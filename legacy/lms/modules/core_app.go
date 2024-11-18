package modules

import (
	"log"

	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/modules/financialaccount"
	financialProduct "github.com/btechlabs/lms-lite/modules/financialproduct"
	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/journal"
	"github.com/btechlabs/lms-lite/modules/msdynamics"
	"github.com/btechlabs/lms-lite/modules/servicing"
	"github.com/btechlabs/lms-lite/pkg/app"
	libSql "github.com/btechlabs/lms-lite/pkg/sql"
)

func NewApplication(envConfig config.EnvConfig) (a app.Application) {
	pg := sqlConnectionManager(envConfig)
	
	financialProductModule := financialProduct.NewFinancialProductModule(envConfig)
	financialAccountModule := financialaccount.NewFinancialAccountModule(pg)
	journalModule := journal.NewJournalModule(pg, envConfig)
	gaModule := ga.NewGaModule(pg, financialAccountModule)
	servicingModule := servicing.NewServicingModule(financialProductModule, financialAccountModule, journalModule, gaModule, pg, envConfig)
	msDynamicsModule := msdynamics.NewMSDynamicsModule(pg, envConfig)
	
	a = app.NewApplication(
		app.WithEnvConfig(envConfig),
		app.WithPgConnectionManager(pg),
		app.WithModule(financialProductModule),
		app.WithModule(financialAccountModule),
		app.WithModule(servicingModule),
		app.WithModule(journalModule),
		app.WithModule(gaModule),
		app.WithModule(msDynamicsModule),
	)
	return
}

func sqlConnectionManager(envConfig config.EnvConfig) libSql.PgConnectionManager {
	connectionManager, err := libSql.NewPgConnectionManager(envConfig)
	if err != nil {
		log.Fatal(err)
	}
	return *connectionManager
}
