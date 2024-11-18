package job

import (
	dynamicsgen "github.com/btechlabs/lms/gen/dynamics"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
)

type SubledgerJobHandler struct {
	db *sql_driver.SqlDriver
}

func NewSubledgerJobHandler(driver *sql_driver.SqlDriver) *SubledgerJobHandler {
	return &SubledgerJobHandler{db: driver}
}

// ensureJournalLinesBalanced checks if the journal lines in the given GeneralJournal
// are balanced. It calculates the total debit and credit amounts and ensures they are equal.
//
// Parameters:
// - journalPosting: A dynamicsgen.GeneralJournal instance containing the journal lines to be checked.
//
// Returns:
// - true if the total debit amount equals the total credit amount, indicating the journal lines are balanced.
// - false if the total debit amount does not equal the total credit amount.
func ensureJournalLinesBalanced(journalPosting dynamicsgen.GeneralJournal) bool {
	var debitTotal, creditTotal uint64
	for _, line := range journalPosting.JournalLines {
		if line.Type == dynamicsgen.Debit {
			debitTotal += line.Amount
		} else {
			creditTotal += line.Amount
		}
	}

	if debitTotal != creditTotal {
		return false
	}

	return true
}
