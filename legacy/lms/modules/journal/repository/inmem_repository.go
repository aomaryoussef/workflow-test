package repository

import (
	"context"

	"github.com/btechlabs/lms-lite/modules/journal/domain"
	"github.com/samber/lo"
)

type JournalInMemoryRepository struct {
	entries []domain.JournalTransaction
}

var _ JournalRepository = (*JournalInMemoryRepository)(nil)

func NewJournalInMemoryRepository() *JournalInMemoryRepository {
	return &JournalInMemoryRepository{}
}

func (jr *JournalInMemoryRepository) GetAllForLoan(ctx context.Context, loanId string) ([]domain.JournalTransaction, error) {
	filtered := lo.Filter(jr.entries, func(entry domain.JournalTransaction, _ int) bool {
		return entry.LoanId() == loanId
	})
	return filtered, nil
}

func (jr *JournalInMemoryRepository) InsertJournalTransaction(ctx context.Context, transaction domain.JournalTransaction) error {
	jr.entries = append(jr.entries, transaction)
	return nil
}

func (jr *JournalInMemoryRepository) InsertJournalsTransactions(ctx context.Context, transactions ...domain.JournalTransaction) error {
	jr.entries = append(jr.entries, transactions...)
	return nil
}

func (jr *JournalInMemoryRepository) GetLatestTransactionIdForLoan(ctx context.Context, loanId string) (transactionId int32, err error) {
	max := lo.MaxBy(jr.entries, func(a domain.JournalTransaction, b domain.JournalTransaction) bool {
		if b.LoanId() != loanId {
			return false
		}
		return a.Id() > b.Id()
	})
	return max.Id(), nil
}
