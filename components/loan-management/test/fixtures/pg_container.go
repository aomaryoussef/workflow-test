package fixtures

import (
	"context"
	"fmt"
	"github.com/docker/go-connections/nat"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
	"time"
)

const (
	pgContainerImage = "docker.io/postgres:15.3-alpine"
	pgDatabase       = "mylo"
	pgUser           = "postgres"
	pgPasswd         = "admin"
)

// PostgresContainer is a docker test container (see: https://testcontainers.com/)
// for running component tests.
type PostgresContainer struct {
	_pg  *postgres.PostgresContainer
	opts []testcontainers.ContainerCustomizer
}

func NewPostgresContainer(ctx context.Context) *PostgresContainer {
	return &PostgresContainer{
		opts: []testcontainers.ContainerCustomizer{
			postgres.WithDatabase(pgDatabase),
			postgres.WithUsername(pgUser),
			postgres.WithPassword(pgPasswd),
			testcontainers.WithWaitStrategy(
				wait.ForLog("database system is ready to accept connections").
					WithOccurrence(2).
					WithStartupTimeout(5 * time.Second)),
		},
	}
}

func (pg *PostgresContainer) Close(ctx context.Context) error {
	return pg._pg.Terminate(ctx)
}

func (pg *PostgresContainer) RunContainer(ctx context.Context) error {
	container, err := postgres.Run(ctx, pgContainerImage, pg.opts...)
	if err != nil {
		return err
	}
	pg._pg = container
	return nil
}

func (pg *PostgresContainer) MappedPort(ctx context.Context) nat.Port {
	port, err := pg._pg.MappedPort(ctx, "tcp/5432")
	if err != nil {
		panic(err)
	}
	return port
}

func (pg *PostgresContainer) Host(ctx context.Context) string {
	host, err := pg._pg.Host(ctx)
	if err != nil {
		panic(err)
	}
	return host
}

func (pg *PostgresContainer) Password() string {
	return pgPasswd
}

func (pg *PostgresContainer) Database() string {
	return pgDatabase
}

func (pg *PostgresContainer) User() string {
	return pgUser
}

func (pg *PostgresContainer) DSNWithPrefix(ctx context.Context, prefix string) string {
	return fmt.Sprintf("%s//%s:%s@%s:%s/%s", prefix, pg.User(), pg.Password(), pg.Host(ctx), pg.MappedPort(ctx).Port(), pg.Database())
}
