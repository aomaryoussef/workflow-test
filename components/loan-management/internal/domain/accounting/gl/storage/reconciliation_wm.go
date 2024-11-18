package storage

import "github.com/btechlabs/lms/gen/dynamics"

type GlReconciliation struct {
	LinkedEntityId   string                   `db:"linked_entity_id"`
	LinkedEntityType string                   `db:"linked_entity_type"`
	LinkedEventId    string                   `db:"event_id"`
	LinkedEventType  string                   `db:"event_type"`
	TransactionDate  int64                    `db:"transaction_date"`
	ProcessedJobId   uint64                   `db:"processed_job_id"`
	RawRequest       dynamics.PostingRequest  `db:"raw_request"`
	RawResponse      dynamics.PostingResponse `db:"raw_response"`
}
