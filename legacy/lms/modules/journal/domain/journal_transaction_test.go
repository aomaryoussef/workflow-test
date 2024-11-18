package domain

import (
	"testing"
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
)

func TestJournalTransaction_SumAmount(t *testing.T) {
	testCases := []struct {
		name        string
		entries     []JournalEntry
		expextedSum int64
	}{
		{
			name: "TestJournalTransaction_SumAmount_SameDirection",
			entries: []JournalEntry{
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionDebit, money.NewMoney(10)),
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionDebit, money.NewMoney(10)),
			},
			expextedSum: 20,
		},
		{
			name: "TestJournalTransaction_SumAmount_OpposingDirection_Positive",
			entries: []JournalEntry{
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionDebit, money.NewMoney(10)),
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionCredit, money.NewMoney(5)),
			},
			expextedSum: 5,
		},
		{
			name: "TestJournalTransaction_SumAmount_OpposingDirection_Negative",
			entries: []JournalEntry{
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionDebit, money.NewMoney(10)),
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionCredit, money.NewMoney(15)),
			},
			expextedSum: -5,
		},
	}

	for _, tc := range testCases {
		sum := NewJournalTransaction(1, tc.entries, time.Now(), "loan123", "asd").SumAmount()
		if sum != tc.expextedSum {
			t.Errorf("Expected sum amount to be %d, but got %d", tc.expextedSum, sum)
		}
	}
}

func TestJournalTransaction_Verify(t *testing.T) {
	testCases := []struct {
		name       string
		entries    []JournalEntry
		shouldFail bool
	}{
		{
			name: "TestJournalTransaction_Verify_Valid",
			entries: []JournalEntry{
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionDebit, money.NewMoney(10)),
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionCredit, money.NewMoney(10)),
			},
			shouldFail: false,
		},
		{
			name: "TestJournalTransaction_Verify_Invalid",
			entries: []JournalEntry{
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionDebit, money.NewMoney(10)),
				*NewJournalEntry(JournalAccountMurabhaLoanReceivable, JournalEntryTypeLoanActivation, JournalEntryDirectionCredit, money.NewMoney(5)),
			},
			shouldFail: true,
		},
	}

	for _, tc := range testCases {
		tr := NewJournalTransaction(1, tc.entries, time.Now(), "loan123", "asd")
		err := tr.Verify()
		if err != nil && !tc.shouldFail {
			t.Errorf("Expected no error, but got %v", err)
		}
	}
}
