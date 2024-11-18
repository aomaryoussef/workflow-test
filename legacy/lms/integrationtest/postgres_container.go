package integrationtest

import (
	"context"
	"fmt"
	"io"
	"log"
	"time"
	
	"github.com/docker/go-connections/nat"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
	
	_ "github.com/lib/pq"
)

// PostgresContainer is a docker test container (see: https://testcontainers.com/)
// for running integration tests.
type PostgresContainer struct {
	*postgres.PostgresContainer
	MappedPort nat.Port
	MappedHost string
	User       string
	Passwd     string
	DBName     string
}

func NewPostgresContainer(ctx context.Context) (*PostgresContainer, error) {
	
	containerImage := "postgres:15.3-alpine"
	database := "lms"
	user := "postgres"
	passwd := "admin"
	
	pgContainer, err := postgres.RunContainer(ctx,
		testcontainers.WithImage(containerImage),
		postgres.WithDatabase(database),
		postgres.WithUsername(user),
		postgres.WithPassword(passwd),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).WithStartupTimeout(5*time.Second)),
	)
	if err != nil {
		return nil, err
	}
	
	mappedPort, err := pgContainer.MappedPort(ctx, "5432/tcp")
	if err != nil {
		return nil, err
	}
	
	mappedHost, err := pgContainer.ContainerIP(ctx)
	if err != nil {
		return nil, err
	}
	
	pg := &PostgresContainer{
		PostgresContainer: pgContainer,
		MappedPort:        mappedPort,
		MappedHost:        mappedHost,
		DBName:            database,
		User:              user,
		Passwd:            passwd,
	}
	
	return pg, nil
}

func (pg *PostgresContainer) targetDbUri() string {
	return fmt.Sprintf("db:pg://%s:%s@%s:5432/lms", pg.User, pg.Passwd, pg.MappedHost)
}

func (pg *PostgresContainer) RunMigration(ctx context.Context, migrationsDir string) error {
	cr := testcontainers.ContainerRequest{
		Image: "sqitch/sqitch:v1.4.0",
		Mounts: testcontainers.ContainerMounts{
			testcontainers.ContainerMount{
				Source: testcontainers.GenericBindMountSource{
					HostPath: migrationsDir,
				},
				Target: "/repo",
			},
		},
		Env: map[string]string{
			"SQITCH_TARGET": pg.targetDbUri(),
		},
		Cmd: []string{"deploy"},
	}
	
	// We will run:
	// docker run -it --rm \
	//	--mount "type=bind,src=$(pwd),dst=/repo" \
	//	-e SQITCH_TARGET=db:pg://postgres:admin@host.docker.internal:5432/lms \
	//	sqitch/sqitch deploy
	// using GenericContainers from test containers package here.
	gc, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: cr,
		Started:          false,
	})
	if err != nil {
		log.Fatalf("failed to create generic container for sqitch, error: %s", err)
		return err
	}
	
	err = gc.Start(ctx)
	if err != nil {
		log.Fatalf("failed to start generic container for sqitch, error: %s", err)
		return err
	}
	
	// MUST WAIT FOR SQITCH TO RUN INSIDE THE CONTAINER
	time.Sleep(8 * time.Second)
	
	logs, err := gc.Logs(ctx)
	if err != nil {
		log.Fatalf("could not get logs from sqitch container, error: %s", err)
		return err
	}
	
	all, err := io.ReadAll(logs)
	if err != nil {
		log.Fatalf("could not read logs from sqitch container, error: %s", err)
		return err
	}
	
	log.Printf("sqitch-gc logs: %s", all)
	
	return nil
}
