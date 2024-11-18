package workers

import (
	"context"
	"fmt"
	"log"
	"os"
	"path"
	"testing"
	
	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/integrationtest"
	"github.com/btechlabs/lms-lite/modules"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/suite"
)

type WorkersIntegrationTestSuite struct {
	suite.Suite
	EnvConfig   *config.EnvConfig
	pgContainer *integrationtest.PostgresContainer
	ctx         context.Context
	coreApp     app.Application
	dbConn      *sqlx.DB
}

func (suite *WorkersIntegrationTestSuite) SetupSuite() {
	t := suite.T()
	rootDir := os.Getenv("ROOT_DIR")
	if rootDir == "" {
		t.Fatal("no ROOT_DIR passed via env")
	}
	
	suite.ctx = context.Background()
	
	// 1. Initialise PostgreSQL test container
	pgContainer, err := integrationtest.NewPostgresContainer(suite.ctx)
	if err != nil {
		t.Fatal(err.Error())
	}
	suite.pgContainer = pgContainer
	
	// 2. Set PG_PORT in env
	err = os.Setenv("LMS_PG_PORT", pgContainer.MappedPort.Port())
	if err != nil {
		t.Fatal(err.Error())
	}
	
	// 3. Run migrations
	err = pgContainer.RunMigration(suite.ctx, path.Join(rootDir, "migrations", "db"))
	if err != nil {
		t.Fatal(err.Error())
	}
	log.Print("db migrations run")
	
	// 3. Load config
	env := loadEnvConfig(t, rootDir)
	suite.EnvConfig = env
	err = logging.InitLogger(env.DebugLevel, env.AppName, env.Environment)
	if err != nil {
		t.Fatal("failed to init logger")
	}
	log.Print("logger initialized")
	
	// 4. Load core application
	coreApp := modules.NewApplication(*env)
	suite.coreApp = coreApp
	
	// 5. Create a DB Connection to bypass repository layer for asserts
	dbConn, err := sqlx.Connect(
		"postgres",
		fmt.Sprintf("host=localhost port=%s user=%s password=%s dbname=%s sslmode=disable", pgContainer.MappedPort.Port(), pgContainer.User, pgContainer.Passwd, pgContainer.DBName),
	)
	if err != nil {
		t.Fatal(err.Error())
	}
	suite.dbConn = dbConn
	log.Print("db connection set")
}

func (suite *WorkersIntegrationTestSuite) TearDownSuite() {
	if err := suite.dbConn.Close(); err != nil {
		log.Fatalf("error closing database connection: %s", err)
	}
	if err := suite.pgContainer.Terminate(suite.ctx); err != nil {
		log.Fatalf("error terminating postgres container: %s", err)
	}
}

func TestIntegrationSuite(t *testing.T) {
	suite.Run(t, new(WorkersIntegrationTestSuite))
}

func loadEnvConfig(t *testing.T, rootDir string) *config.EnvConfig {
	envConfig, err := config.LoadEnvConfig(path.Join(rootDir, "assets"))
	if err != nil {
		t.Fatal(err.Error())
	}
	
	return envConfig
}
