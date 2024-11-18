package domain

import "time"

type CommandType string

const (
	CommandTypeActivateLoan CommandType = "activate_loan"
)

type Command struct {
	Id            int32
	Type          CommandType
	ConsumerId    string
	CorrelationId string
	CreatedAt     time.Time
	Entries       []Entry
}

type EntryType string

const (
	EntryTypePrincipal EntryType = "principal"
	EntryTypeInterest  EntryType = "interest"
	EntryTypeLateFee   EntryType = "late_fee"
)

type Entry struct {
	Id        int64
	Type      EntryType
	CommandId int32
	Amount    int64
}
