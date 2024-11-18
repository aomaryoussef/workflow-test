package job

import (
	"errors"
	"fmt"
	"github.com/btechlabs/lms/config"
	dynamicsgen "github.com/btechlabs/lms/gen/dynamics"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/pkg/client/dynamics"
	. "github.com/samber/lo"
	"time"
)

const (
	EmptyString                        = ""
	JournalPrefixLoanActivation        = "ACT"
	JournalPrefixReverseLoanActivation = "RACT"
	JournalPrefixFees                  = "AD"
	JournalPrefixReverseFees           = "RAD"
	JournalPrefixPurchase              = "PR"
	JournalPrefixReversePurchase       = "RPR"
	JournalPrefixInterestRevenue       = "INT"
	JournalPrefixPaymentsReceived      = "Coll"
)

type GeneralLedgerERPJobHandler struct {
	client              *dynamics.DynamicsClient
	db                  *sql_driver.SqlDriver
	integrationDisabled bool
}

func NewGeneralLedgerERPJobHandler(client *dynamics.DynamicsClient, driver *sql_driver.SqlDriver, integrationDisabled bool) *GeneralLedgerERPJobHandler {
	return &GeneralLedgerERPJobHandler{client: client, db: driver, integrationDisabled: integrationDisabled}
}

func ledgerNameFromLenderSource(lenderSource string) (*string, error) {
	s, ok := config.LenderSourceLedgerNameMap[lenderSource]
	if !ok {
		return nil, errors.New("gl ledger name not found for the given lender source name")
	}
	return &s, nil
}

func extractLast2DigitsFromYear(t time.Time) string {
	return t.Format("2006")[2:]
}

func transformToDynamicsDateFmt(t time.Time) string {
	return fmt.Sprintf("/Date(%d)/", t.UnixMilli())
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

func newJournalLine(dir dynamicsgen.PostingDirection, amount uint64, glAccount string, comment string) dynamicsgen.JournalLine {
	return dynamicsgen.JournalLine{
		Type:                    dir,
		Amount:                  amount,
		AccountType:             EmptyString,
		Account:                 glAccount,
		Description:             EmptyString,
		Comment:                 comment,
		PaymentMethod:           EmptyString,
		CardNumber:              EmptyString,
		LineResponseDescription: EmptyString,
		LineResponseStatus:      EmptyString,
		StoreId:                 EmptyString,
	}
}

func filterJournalLinesWithNoAmount(postingRequest *dynamicsgen.PostingRequest) {
	for i, gjl := range postingRequest.Request.GeneralJournalList {
		gjl.JournalLines = Filter(gjl.JournalLines, func(item dynamicsgen.JournalLine, _ int) bool {
			return item.Amount > 0
		})
		postingRequest.Request.GeneralJournalList[i] = gjl
	}
}
