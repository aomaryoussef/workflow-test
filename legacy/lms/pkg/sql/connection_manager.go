package sql

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type sqlTxContextKeyType string

const (
	postgres = "postgres"
)
const (
	SqlTxCtxKey sqlTxContextKeyType = "_sqlTxCtxKey"
)

type PgConnectionManager struct {
	db *sqlx.DB
}

func NewPgConnectionManager(config config.EnvConfig) (*PgConnectionManager, error) {

	sslMode := "require"
	if config.Pg.SslModeDisable {
		sslMode = "disable"
	}

	// Construct the database connection string using values from EnvConfig
	connectionString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		config.Pg.Host,
		config.Pg.Port,
		config.Pg.User,
		config.Pg.Password,
		config.Pg.Database,
		sslMode,
	)
	// Open a connection to the database
	db, err := sqlx.Open(postgres, connectionString)
	if err != nil {
		logging.LogHandle.WithContext(context.Background()).Errorf("failed to open connection: %v", err)
		return nil, err
	}

	// Ping the database to verify the connection
	if err := db.Ping(); err != nil {
		logging.LogHandle.WithContext(context.Background()).Errorf("failed to ping: %v", err)
		db.Close()
		return nil, err
	}

	return &PgConnectionManager{
		db: db,
	}, nil
}

func (cm *PgConnectionManager) Close() error {
	return cm.db.Close()
}

// InjectTx injects a transaction pointer into the context.
// In case of err, the caller needs to handle how to proceed.
func (cm *PgConnectionManager) InjectTx(ctx context.Context) (context.Context, error) {
	tx, err := cm.db.BeginTxx(ctx, &sql.TxOptions{})
	if err != nil {
		return nil, err
	}
	return context.WithValue(ctx, SqlTxCtxKey, tx), nil
}

// ExtractTx extracts the injected transaction from the context.
// A conscious decision is made to panic(..) if there is no transaction
// in the context.
func (cm *PgConnectionManager) ExtractTx(ctx context.Context) *sqlx.Tx {
	tx := ctx.Value(SqlTxCtxKey).(*sqlx.Tx)
	if tx == nil {
		// This is a conscious decision to panic if no tx is found
		panic("no tx to extract in context")
	}
	return tx
}

// CommitTx commits the injected transaction from the context.
// A conscious decision is made to panic(..) if there is no transaction
// in the context.
func (cm *PgConnectionManager) CommitTx(ctx context.Context) error {
	tx := ctx.Value(SqlTxCtxKey).(*sqlx.Tx)
	if tx == nil {
		// This is a conscious decision to panic if no tx is found
		// We do not want to commit or do anything crazy if no tx is set
		// On panic we will know soon with alerts if something goes wrong
		panic("no tx to commit in context")
	}
	// TODO: Remove the tx from the context once it is rollback
	return tx.Commit()
}

// RollbackTx rollbacks the injected transaction from the context.
// A conscious decision is made to panic(..) if there is no transaction
// in the context.
func (cm *PgConnectionManager) RollbackTx(ctx context.Context) error {
	tx := ctx.Value(SqlTxCtxKey).(*sqlx.Tx)
	if tx == nil {
		// This is a conscious decision to panic if no tx is found
		// We do not want to rollback or do anything crazy if no tx is set
		// On panic we will know soon with alerts if something goes wrong
		panic("no tx to commit in context")
	}
	// TODO: Remove the tx from the context once it is rollback
	return tx.Rollback()
}

func (cm *PgConnectionManager) Rebind(query string) string {
	return cm.db.Rebind(query)
}

// CheckDatabaseHealth checks the health of the database connection.
//
// It returns an error if the database connection is not initialized or if there
// is an error in pinging the database.
func (cm *PgConnectionManager) CheckDatabaseHealth() error {
	if cm.db == nil {
		return fmt.Errorf("database connection is not initialized")
	}

	ctx := context.Background()
	if err := cm.db.PingContext(ctx); err != nil {
		return err
	}

	return nil
}

func (cm *PgConnectionManager) GetQuery() *SingleInstruction {
	return NewSingleInstruction(cm.db)
}
func (cm *PgConnectionManager) GetTransaction() *MultiInstruction {
	return NewMultiInstruction(cm.db)
}
