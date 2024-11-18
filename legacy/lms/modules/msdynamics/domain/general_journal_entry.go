package domain

type GeneralJournal struct {
	journalName      string
	journalReference string
	transactionType  string
	transactionDate  string
	entries          []GeneralJournalEntry
}

func (j *GeneralJournal) JournalName() string {
	return j.journalName
}
func (j *GeneralJournal) JournalReference() string {
	return j.journalReference
}
func (j *GeneralJournal) TransactionType() string {
	return j.transactionType
}
func (j *GeneralJournal) TransactionDate() string {
	return j.transactionDate
}
func (j *GeneralJournal) Entries() []GeneralJournalEntry {
	return j.entries
}

type GeneralJournalEntry struct {
	account     string
	direction   string // Debit or Credit
	amount      int64
	description string
}

func (e *GeneralJournalEntry) Account() string {
	return e.account
}
func (e *GeneralJournalEntry) Direction() string {
	return e.direction
}
func (e *GeneralJournalEntry) Amount() int64 {
	return e.amount
}
func (e *GeneralJournalEntry) Description() string {
	return e.description
}

// example:
// {
// 	"_request": {
// 			"DataAreaId": "BTTD",
// 			"MyloRequestNumber": "MYLO-REQ-0001",
// 			"GeneralJournalList": [
// 					{
// 							"JournalName": "CCN22",
// 							"MyloJournalReference":"TR-98678-0001",
// 							"MyloTransType":"Loan Activation",
// 							"TransDate":"21-11-2023",
// 							"JournalLines": [
// 									{
// 											"Account": "110201001",
// 											"Type": "Debit",
// 											"Amount": 20000,
// 											"Description": "Total Loan"
// 									},
// 									{
// 											"Account": "110101001",
// 											"Type": "Debit",
// 											"Amount": 10000,
// 											"Description": "Total Interest"
// 									},
// 									{
// 											"Account": "230201001|CON-LO-EXP-ALMEN0-01|Contractor",
// 											"Type": "Credit",
// 											"Amount": 10000,
// 											"Description": "Merchant Due 1"
// 									},
// 									{
// 											"Account": "230201001|CON-LO-EXP-ARCEN0-01|Contractor",
// 											"Type": "Credit",
// 											"Amount": 10000,
// 											"Description": "Merchant Due 2"
// 									},
// 									{
// 											"Account": "450101001",
// 											"Type": "Credit",
// 											"Amount": 10000,
// 											"Description": "Unearned Revenue"
// 									}
// 							]
// 					},
// 					{
// 							"JournalName": "CC22",
// 							"MyloJournalReference":"TR-98678-0002",
// 							"MyloTransType":"Admin Fees",
// 							"TransDate":"21-11-2023",
// 							"JournalLines": [
// 									{
// 											"Account": "430101004",
// 											"Type": "Credit",
// 											"Amount": 1000,
// 											"Description": "Total Loan"
// 									},
// 									{
// 											"Account": "230201001|CON-LO-EXP-ALMEN0-01|Contractor",
// 											"Type": "Debit",
// 											"Amount": 500,
// 											"Description": "Merchant Due 1"
// 									},
// 									{
// 											"Account": "230201001|CON-LO-EXP-ARCEN0-01|Contractor",
// 											"Type": "Debit",
// 											"Amount": 500,
// 											"Description": "Merchant Due 2"
// 									}
// 							]
// 					}
// 			]
// 	}
// }

// BUILDER

type GeneralJournalBuilder struct {
	JournalName      string
	JournalReference string
	TransactionType  string
	TransactionDate  string
	Entries          []GeneralJournalEntryBuilder
}

func NewGeneralJournalBuilder() *GeneralJournalBuilder {
	return &GeneralJournalBuilder{}
}

func (j *GeneralJournalBuilder) Build() GeneralJournal {
	gj := GeneralJournal{
		journalName:      j.JournalName,
		journalReference: j.JournalReference,
		transactionType:  j.TransactionType,
		transactionDate:  j.TransactionDate,
	}
	
	for _, e := range j.Entries {
		gj.entries = append(gj.entries, e.Build())
	}
	
	return gj
}

type GeneralJournalEntryBuilder struct {
	Account     string
	Direction   string // Debit or Credit
	Amount      int64
	Description string
}

func NewGeneralJournalEntryBuilder() *GeneralJournalEntryBuilder {
	return &GeneralJournalEntryBuilder{}
}

func (e *GeneralJournalEntryBuilder) Build() GeneralJournalEntry {
	return GeneralJournalEntry{
		account:     e.Account,
		direction:   e.Direction,
		amount:      e.Amount,
		description: e.Description,
	}
}
