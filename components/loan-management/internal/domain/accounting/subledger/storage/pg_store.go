package storage

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/accounting/subledger/model"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/doug-martin/goqu/v9"
	"strings"
)

func JournalEntriesExists(ctx context.Context, tx sql_driver.Tx, loanId string, eventId string) (bool, error) {
	log := logging.WithContext(ctx)

	sql, args, err := sql_driver.GoquPgDialect.
		Select(goqu.COUNT("*").As("journal_record_count")).
		From("journal").
		Where(goqu.And(goqu.C("linked_entity_id").Eq(loanId), goqu.C("event_id").Eq(eventId))).
		ToSQL()
	if err != nil {
		return true, err
	}

	var journalRecordCount int
	slReconciliationRow := tx.QueryRow(ctx, sql, args...)
	err = slReconciliationRow.Scan(&journalRecordCount)
	if err != nil {
		return true, err
	}

	log.Debug("query executed for get count of journal entries")

	if journalRecordCount > 0 {
		return true, nil
	} else {
		return false, nil
	}
}

func SaveJournal(ctx context.Context, tx sql_driver.Tx, posting model.JournalPosting) error {
	log := logging.WithContext(ctx)

	records := make([]goqu.Record, 0)
	for _, group := range posting.TransactionGroups {
		for _, transaction := range group.Transactions {
			record := goqu.Record{
				"linked_entity_id":   posting.LinkedEntityId,
				"linked_entity_type": posting.LinkedEntityType,
				"lender_source":      posting.LenderSource,
				"event_id":           posting.EventId,
				"event_type":         posting.EventType,
				"transaction_group":  group.TransactionGroup,
				"cost_center":        transaction.CostCenter,
				"account":            transaction.Account,
				"sub_account":        transaction.SubAccount,
				"direction":          strings.ToUpper(string(transaction.Direction)),
				"amount":             transaction.Amount,
				"booked_at":          posting.BookedAt,
			}
			records = append(records, record)
		}
	}

	sql, args, err := sql_driver.GoquPgDialect.
		Insert("journal").
		Rows(records).
		ToSQL()
	if err != nil {
		return err
	}

	if _, execErr := tx.Exec(ctx, sql, args...); execErr != nil {
		log.Warn(fmt.Sprintf("failed to insert journal records: %v", execErr))
		return execErr
	}
	return nil
}
