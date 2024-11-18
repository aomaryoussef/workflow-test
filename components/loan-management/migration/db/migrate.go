package db

import (
	"context"
	"database/sql"
	"embed"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/logging"
	gomigrate "github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "github.com/jackc/pgx/v5/stdlib"
)

//go:embed sql/*.sql
var migrationsFS embed.FS

type MigrateDirection string

const (
	MigrateUp   MigrateDirection = "MigrateUp"
	MigrateDown MigrateDirection = "MigrateDown"
)

func Migrate(ctx context.Context, c config.Config, dir MigrateDirection) error {
	log := logging.WithContext(ctx)
	connString := fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?search_path=%s",
		c.PgConfig.User, c.PgConfig.Password,
		c.PgConfig.Host, c.PgConfig.Port, c.PgConfig.Database,
		c.PgConfig.Schema,
	)
	log.Info(fmt.Sprintf(
		"postgres://%s:%d/%s?search_path=%s",
		c.PgConfig.Host, c.PgConfig.Port, c.PgConfig.Database,
		c.PgConfig.Schema,
	))

	db, err := sql.Open("pgx", connString)
	if err != nil {
		log.Warn(fmt.Sprintf("unable to connect to database: %v", err))
		return err
	}
	defer func(db *sql.DB) {
		closeErr := db.Close()
		if closeErr != nil {
			log.Warn(fmt.Sprintf("unable to close database connection: %v", err))
		}
	}(db)

	driver, err := postgres.WithInstance(db, &postgres.Config{
		SchemaName: "public",
	})
	if err != nil {
		log.Warn(fmt.Sprintf("unable to create driver: %v", err))
		return err
	}
	d, err := iofs.New(migrationsFS, "sql")
	if err != nil {
		log.Warn(fmt.Sprintf("unable to create source driver: %v", err))
		return err
	}
	m, err := gomigrate.NewWithInstance("iofs", d, "postgres", driver)
	if err != nil {
		log.Warn(fmt.Sprintf("unable to create migration instance: %v", err))
		return err
	}

	// Apply migrations
	switch dir {
	case MigrateUp:
		err = m.Up()
	case MigrateDown:
		err = m.Down()
	}
	if err != nil && !errors.Is(err, gomigrate.ErrNoChange) {
		log.Warn(fmt.Sprintf("unable to apply migrations: %v", err))
		return err
	}

	log.Info("migrations applied successfully")

	return nil
}
