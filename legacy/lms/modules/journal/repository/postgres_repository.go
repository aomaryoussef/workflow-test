package repository

import (
	"context"
	"time"

	"github.com/btechlabs/lms-lite/modules/journal/domain"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/money"
	libSql "github.com/btechlabs/lms-lite/pkg/sql"
	"github.com/samber/lo"
)

const (
	InsertJournalEntryCommand     = `INSERT INTO public.journal (account, type, direction, amount, booked_at, transaction_id, loan_id, correlation_id, created_at, created_by) VALUES ($1, $2, $3, $4 ,$5 , $6, $7, $8, $9, $10)`
	GetAllForLoanCommand          = `SELECT * FROM public.journal WHERE loan_id = $1`
	GetLatestTransactionIdCommand = `SELECT COALESCE(MAX(transaction_id),0) FROM public.journal WHERE loan_id = $1`
)

var _ JournalRepository = (*JournalPostgresRepository)(nil)

type JournalPostgresRepository struct {
	pg libSql.PgConnectionManager
}

func NewJournalPostgresRepository(pg libSql.PgConnectionManager) *JournalPostgresRepository {
	return &JournalPostgresRepository{
		pg: pg,
	}
}

func (j *JournalPostgresRepository) GetLatestTransactionIdForLoan(ctx context.Context, loanId string) (transactionId int32, err error) {
	tx := j.pg.ExtractTx(ctx)
	err = tx.Get(&transactionId, GetLatestTransactionIdCommand, loanId)
	if err != nil {
		return 0, err
	}

	return transactionId, nil
}

func (j *JournalPostgresRepository) GetAllForLoan(ctx context.Context, loanId string) (transactions []domain.JournalTransaction, err error) {
	tx := j.pg.ExtractTx(ctx)

	var entries []journalEntryRepoEntity
	err = tx.Select(&entries, GetAllForLoanCommand, loanId)
	if err != nil {
		return nil, err
	}
	grouped := lo.GroupBy(entries, func(entry journalEntryRepoEntity) int32 {
		return entry.TransactionId
	})
	for transactionId, entries := range grouped {
		mappedEntries := lo.Map(entries, func(entry journalEntryRepoEntity, _ int) domain.JournalEntry {
			return *domain.NewJournalEntry(domain.JournalAccount(entry.Account), domain.JournalEntryTransactionType(entry.Type), domain.JournalEntryDirection(entry.Direction), money.NewMoney(uint64(entry.Amount)))
		})
		transactions = append(transactions, *domain.NewJournalTransaction(transactionId, mappedEntries, entries[0].BookedAt, entries[0].LoanId, entries[0].CorrelationId))
	}
	return transactions, nil
}

func (j *JournalPostgresRepository) InsertJournalTransaction(ctx context.Context, transaction domain.JournalTransaction) error {
	tx := j.pg.ExtractTx(ctx)
	currentTime := time.Now().UTC()
	currentUserId := logging.ExtractUserId(ctx)

	for _, entry := range transaction.Entries() {
		_, err := tx.Exec(InsertJournalEntryCommand, entry.Account(), entry.Type(), entry.Direction(), entry.Amount().Units(), transaction.BookingDate(), transaction.Id(), transaction.LoanId(), transaction.CorrelationId(), currentTime, currentUserId)
		if err != nil {
			return err
		}
	}
	return nil
}

func (j *JournalPostgresRepository) InsertJournalsTransactions(ctx context.Context, transactions ...domain.JournalTransaction) error {
	logger := logging.LogHandle.WithContext(ctx)
	currentUserId := logging.ExtractUserId(ctx)
	currentTime := time.Now().UTC()
	tx := j.pg.ExtractTx(ctx)

	for _, transaction := range transactions {
		for _, entry := range transaction.Entries() {
			_, err := tx.Exec(
				InsertJournalEntryCommand,
				entry.Account(),
				entry.Type(),
				entry.Direction(),
				uint32(entry.Amount().Units()),
				transaction.BookingDate(),
				transaction.Id(),
				transaction.LoanId(),
				transaction.CorrelationId(),
				currentTime,
				currentUserId,
			)
			if err != nil {
				logger.Errorf("Failed to insert journal entry with error %v", err)
				return err
			}
		}
	}
	logger.Infof("Inserted %d journal entries", len(transactions))
	return nil
}
