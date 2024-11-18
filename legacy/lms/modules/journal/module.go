package journal

import (
	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/modules/journal/repository"
	"github.com/btechlabs/lms-lite/modules/journal/usecase"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/sql"
)

const JournalModuleName = "journalModule"

type JournalModule struct {
	useCase usecase.JournalUseCase
}

func NewJournalModule(pg sql.PgConnectionManager, conf config.EnvConfig) app.Module {
	repo := repository.NewJournalPostgresRepository(pg)
	useCase := usecase.NewJournalUseCase(repo, conf)
	j := &JournalModule{
		useCase: useCase,
	}
	return j
}

func (j *JournalModule) GetName() string {
	return JournalModuleName
}

func (j *JournalModule) GetUseCase() usecase.JournalUseCase {
	return j.useCase
}
