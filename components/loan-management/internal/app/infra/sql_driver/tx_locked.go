package sql_driver

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/pkg/logging"
)

var _ Tx = (*PgLockedTx)(nil)

type PgLockedTx struct {
	*PgTx
	hash uint64
}

func NewPgLockedTx(tx *PgTx, hash uint64) *PgLockedTx {
	return &PgLockedTx{
		PgTx: tx,
		hash: hash,
	}
}

func (tx *PgLockedTx) tryLock(ctx context.Context) bool {
	log := logging.WithContext(ctx)
	var lockObtained bool
	err := tx.Tx.
		QueryRow(ctx, fmt.Sprintf(`SELECT pg_try_advisory_lock(%d)`, tx.hash)).
		Scan(&lockObtained)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to lock transaction hash: %d with error: %s", tx.hash, err.Error()))
		return false
	}

	return lockObtained
}

func (tx *PgLockedTx) releaseLock(ctx context.Context) error {
	_, err := tx.Tx.Exec(ctx, fmt.Sprintf("SELECT pg_advisory_unlock(%d)", tx.hash))
	return err
}

//func (tx *PgLockedTx) Unwrap() pgx.Tx {
//	return tx.Tx
//}

func (tx *PgLockedTx) Commit(ctx context.Context) error {
	_ = tx.releaseLock(ctx)
	return tx.Tx.Commit(ctx)
}

func (tx *PgLockedTx) Rollback(ctx context.Context) error {
	_ = tx.releaseLock(ctx)
	return tx.Tx.Rollback(ctx)
}
