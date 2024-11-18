package domain

type JournalEntry struct {
	id              int32
	transactionType string
}

func (j *JournalEntry) ID() int32 {
	return j.id
}

func (j *JournalEntry) TransactionType() string {
	return j.transactionType
}

// BUILDER

type JournalEntryBuilder struct {
	ID              int32
	TransactionType string
}

func NewJournalEntryBuilder() *JournalEntryBuilder {
	return &JournalEntryBuilder{}
}

func (j *JournalEntryBuilder) Build() JournalEntry {
	return JournalEntry{
		id:              j.ID,
		transactionType: j.TransactionType,
	}
}
