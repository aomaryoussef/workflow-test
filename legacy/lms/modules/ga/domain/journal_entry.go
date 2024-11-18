package domain

type JournalEntryForRead struct {
	id              int32
	transactionType string
}

func NewJournalEntryForRead(id int32, transactionType string) JournalEntryForRead {
	return JournalEntryForRead{
		id:              id,
		transactionType: transactionType,
	}
}

func (j *JournalEntryForRead) ID() int32 {
	return j.id
}

func (j *JournalEntryForRead) TransactionType() string {
	return j.transactionType
}

// BUILDER

type JournalEntryForReadBuilder struct {
	ID              int32  `db:"id"`
	TransactionType string `db:"type"`
}

func NewJournalEntryForReadBuilder() *JournalEntryForReadBuilder {
	return &JournalEntryForReadBuilder{}
}

func (j *JournalEntryForReadBuilder) Build() JournalEntryForRead {
	return JournalEntryForRead{
		id:              j.ID,
		transactionType: j.TransactionType,
	}
}
