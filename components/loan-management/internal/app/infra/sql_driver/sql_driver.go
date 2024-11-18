package sql_driver

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/logging"
	_ "github.com/doug-martin/goqu/v9/dialect/postgres"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib"
	"hash/fnv"
	"sync"
)

type SqlDriver struct {
	_pgxPool         *pgxpool.Pool
	debugLogSqlQuery bool
	tracingEnabled   bool
}

var (
	sqlDb  *SqlDriver
	pgOnce sync.Once
)

// Connect creates a new database connection pool and returns a SqlDriver object.
//
// If the connection pool cannot be created or the subsequent PING is not
// successful, this method panics. The panic is intended by design to prevent
// the application from continuing to run in an inconsistent state.
func Connect(ctx context.Context, config config.Config) (*SqlDriver, error) {
	log := logging.WithContext(ctx)
	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?application_name=%s&search_path=%s", config.PgConfig.User, config.PgConfig.Password, config.PgConfig.Host, config.PgConfig.Port, config.PgConfig.Database, config.AppConfig.Name, config.PgConfig.Schema)
	if config.PgConfig.SslDisable {
		dbUrl += "&sslmode=disable"
	}

	pgOnce.Do(func() {
		conf, err := pgxpool.ParseConfig(dbUrl)
		if err != nil {
			panic(fmt.Errorf("error parsing database dsn: %w", err))
		}
		pool, err := pgxpool.NewWithConfig(ctx, conf)
		if err != nil {
			panic(fmt.Errorf("error creating database pool: %w", err))
		}

		if err = pool.Ping(ctx); err != nil {
			panic(fmt.Sprintf("error ping/connecting to database: %v", err))
		}

		log.Info("database ping successful")

		sqlDb = &SqlDriver{
			_pgxPool:         pool,
			debugLogSqlQuery: true,
			tracingEnabled:   config.TelemetryConfig.Enabled,
		}
	})

	return sqlDb, nil
}

func (d *SqlDriver) Close() {
	d._pgxPool.Close()
}

func (d *SqlDriver) CreateTransaction(ctx context.Context) (Tx, error) {
	tx, err := d._pgxPool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return nil, err
	}

	//d.schemaSet(ctx, tx)
	return NewPgTx(tx, d.debugLogSqlQuery, d.tracingEnabled), nil
}

// CreateLockedTransaction creates a new transaction and locks it with a
// pg_advisory_lock. The lock is released when the transaction is committed or
// rolled back.
// The key and action are hashed to a 64-bit uint64 to be used as the lock
// identifier.
// If the lock cannot be obtained, the transaction is not created and an error
// is returned.
//
// Caution: Use this method with care. It is not recommended to use this method
// in a high-throughput environment as it can lead to deadlocks.
// Also ensure that wherever this method is used, the transaction is committed
// or rolled back to release the lock, otherwise sooner or later, you will end
// up not unlocking it, and then you will be blocked forever. Ensure to catch all
// the panics and release the lock in the defer block.
//
// Example:
//
// ```
//
//	tx, err := sql_driver.CreateLockedTransaction(ctx, "key", "action")
//	if err != nil {
//	    return err
//	}
//	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)
//	// Do your work here
//
// ```
func (d *SqlDriver) CreateLockedTransaction(ctx context.Context, key string, action string) (Tx, error) {
	tx, err := d._pgxPool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return nil, err
	}

	hash, err := keyAndActionAsHash64(key, action)
	if err != nil {
		return nil, err
	}

	lockedTx := NewPgLockedTx(NewPgTx(tx, d.debugLogSqlQuery, d.tracingEnabled), hash)
	if !lockedTx.tryLock(ctx) {
		return nil, fmt.Errorf("failed to lock transaction with key: %s and action: %s", key, action)
	}
	//d.schemaSet(ctx, tx)
	return lockedTx, nil
}

func (d *SqlDriver) CreateTransactionReadOnly(ctx context.Context) (Tx, error) {
	tx, err := d._pgxPool.BeginTx(ctx, pgx.TxOptions{AccessMode: pgx.ReadOnly, IsoLevel: pgx.ReadCommitted})
	if err != nil {
		return nil, err
	}

	//d.schemaSet(ctx, tx)
	return NewPgTx(tx, d.debugLogSqlQuery, d.tracingEnabled), nil
}

func (d *SqlDriver) Stats() *pgxpool.Stat {
	return d._pgxPool.Stat()
}

// `pg_try_advisory_lock` takes a bigint rather than any kind of human-readable
// name. Just so we don't have to choose a random integer, hash a provided name
// to a bigint-compatible 64-bit uint64 and use that.
func keyAndActionAsHash64(key string, action string) (uint64, error) {
	hash := fnv.New32()
	_, err := hash.Write([]byte(fmt.Sprintf("%s:%s", key, action)))
	if err != nil {
		return 0, err
	}
	return uint64(hash.Sum32()), nil
}
