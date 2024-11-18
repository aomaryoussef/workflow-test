package domain

import (
	"errors"
	"time"
	
	"github.com/samber/lo"
)

var (
	ErrTransactionSumAmountMismatch = errors.New("transaction sum amount mismatch")
)

type JournalTransaction struct {
	id            int32
	correlationId string
	entries       []JournalEntry
	bookingDate   time.Time
	loanId        string
}

func NewJournalTransaction(id int32, entries []JournalEntry, bookingDate time.Time, loanId string, correlationId string) *JournalTransaction {
	return &JournalTransaction{
		id:            id,
		entries:       entries,
		bookingDate:   bookingDate,
		loanId:        loanId,
		correlationId: correlationId,
	}
}

func (j *JournalTransaction) Id() int32 {
	return j.id
}

func (j *JournalTransaction) CorrelationId() string {
	return j.correlationId
}

func (j *JournalTransaction) Entries() []JournalEntry {
	return j.entries
}

func (j *JournalTransaction) BookingDate() time.Time {
	return j.bookingDate
}

func (j *JournalTransaction) LoanId() string {
	return j.loanId
}

func (j *JournalTransaction) AddEntry(je JournalEntry) {
	j.entries = append(j.entries, je)
}

// TODO Make this uint64.
// TODO Please confirm @mate if this sum can be negative (don't think so)
func (j *JournalTransaction) SumAmount() int64 {
	sum := lo.Reduce(j.entries, func(agg int64, entry JournalEntry, _ int) int64 {
		if entry.Direction() == JournalEntryDirectionDebit {
			return agg + int64(entry.Amount().Units())
		}
		if entry.Direction() == JournalEntryDirectionCredit {
			return agg - int64(entry.Amount().Units())
		}
		return agg
	}, int64(0))
	return sum
}

func (j *JournalTransaction) Verify() error {
	sum := j.SumAmount()
	if sum != 0 {
		return ErrTransactionSumAmountMismatch
	}
	return nil
}
