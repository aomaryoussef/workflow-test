package storage

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/doug-martin/goqu/v9"
)

func GetReconciliation(ctx context.Context, tx sql_driver.Tx, linkedEntityId string, eventId string) (*GlReconciliation, error) {
	log := logging.WithContext(ctx)

	sql, args, err := sql_driver.GoquPgDialect.
		From("gl_reconciliation").
		Where(goqu.And(goqu.C("linked_entity_id").Eq(linkedEntityId), goqu.C("event_id").Eq(eventId))).
		ToSQL()
	if err != nil {
		return nil, err
	}

	glReconciliationRows, err := tx.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer glReconciliationRows.Close()

	log.Debug("query executed for get reconciliations")
	glReconciliations := make([]GlReconciliation, 0)
	for glReconciliationRows.Next() {
		var glReconciliation GlReconciliation
		err = glReconciliationRows.Scan(&glReconciliation.LinkedEntityId, &glReconciliation.LinkedEventId, &glReconciliation.LinkedEventType, &glReconciliation.TransactionDate, &glReconciliation.ProcessedJobId, &glReconciliation.RawRequest, &glReconciliation.RawResponse)
		if err != nil {
			return nil, err
		}
		glReconciliations = append(glReconciliations, glReconciliation)
	}

	log.Debug(fmt.Sprintf("found %d reconciliations for linkedEntityId: %s and eventId: %s", len(glReconciliations), linkedEntityId, eventId))

	if len(glReconciliations) == 1 {
		return &glReconciliations[0], nil
	} else {
		return nil, nil
	}
}

func SaveReconciliation(ctx context.Context, tx sql_driver.Tx, reconciliation GlReconciliation) error {
	log := logging.WithContext(ctx)

	rawRequestJson, err := json.Marshal(reconciliation.RawRequest)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to marshal raw request: %s", err.Error()))
		return err
	}
	rawResponseJson, err := json.Marshal(reconciliation.RawResponse)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to marshal raw response: %s", err.Error()))
		return err
	}

	record := goqu.Record{
		"linked_entity_id":   reconciliation.LinkedEntityId,
		"linked_entity_type": reconciliation.LinkedEntityType,
		"event_id":           reconciliation.LinkedEventId,
		"event_type":         reconciliation.LinkedEventType,
		"transaction_date":   reconciliation.TransactionDate,
		"processed_job_id":   reconciliation.ProcessedJobId,
		"raw_request":        rawRequestJson,
		"raw_response":       rawResponseJson,
	}

	sql, args, err := sql_driver.GoquPgDialect.
		Insert("gl_reconciliation").
		Rows(record).
		ToSQL()
	if err != nil {
		return err
	}

	if _, execErr := tx.Exec(ctx, sql, args...); execErr != nil {
		log.Warn(fmt.Sprintf("failed to insert gl reconciliation: %v", execErr))
		return execErr
	}
	return nil
}
