package repository

import (
	"context"
	"time"

	"github.com/btechlabs/lms-lite/modules/journal/domain"
)

type journalEntryRepoEntity struct {
	Id            int32     `db:"id"`
	Account       string    `db:"account"`
	Type          string    `db:"type"`
	Direction     string    `db:"direction"`
	Amount        int64     `db:"amount"`
	BookedAt      time.Time `db:"booked_at"`
	TransactionId int32     `db:"transaction_id"`
	LoanId        string    `db:"loan_id"`
	CorrelationId string    `db:"correlation_id"`
	CreatedAt     time.Time `db:"created_at"`
	CreatedBy     string    `db:"created_by"`
}

type JournalRepository interface {
	InsertJournalTransaction(ctx context.Context, transaction domain.JournalTransaction) error
	InsertJournalsTransactions(ctx context.Context, transactions ...domain.JournalTransaction) error
	GetLatestTransactionIdForLoan(ctx context.Context, loanId string) (transactionId int32, err error)
	GetAllForLoan(ctx context.Context, loanId string) ([]domain.JournalTransaction, error)
}
