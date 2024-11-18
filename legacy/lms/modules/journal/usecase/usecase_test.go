package usecase

import (
	"context"
	"path"
	"path/filepath"
	"runtime"
	"testing"
	"time"

	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/modules/journal/domain"
	"github.com/btechlabs/lms-lite/modules/journal/repository"
	"github.com/stretchr/testify/assert"
)

func TestActivateLoan(t *testing.T) {

	journalRepo := repository.NewJournalInMemoryRepository()

	_, b, _, _ := runtime.Caller(0)
	basePath := filepath.Dir(b)
	conf, err := config.LoadEnvConfig(path.Join(basePath, "../../../", "assets"))
	assert.Nil(t, err)

	useCase := NewJournalUseCase(journalRepo, *conf)

	testCases := []struct {
		name                      string
		loanId                    string
		principalAmount           uint64
		interestAmount            uint64
		bookingDate               time.Time
		adminFee                  uint64
		expectedAdminFeeIncome    uint64
		expectedPurchaseValue     uint64
		expectedDoubtfulAllowance uint64
		shouldErr                 bool
	}{
		{
			name:                      "TestActivateLoan_Valid_1",
			loanId:                    "test-loan-1",
			principalAmount:           100,
			interestAmount:            10,
			adminFee:                  10,
			expectedAdminFeeIncome:    9,
			expectedPurchaseValue:     100,
			expectedDoubtfulAllowance: 1,
			bookingDate:               time.Now(),
			shouldErr:                 false,
		},
		{
			name:                      "TestActivateLoan_Valid_2",
			loanId:                    "test-loan-2",
			principalAmount:           12341230921,
			interestAmount:            43523,
			adminFee:                  10,
			expectedAdminFeeIncome:    9,
			expectedPurchaseValue:     12341230921,
			expectedDoubtfulAllowance: 123412309,
			bookingDate:               time.Now(),
			shouldErr:                 false,
		},
		{
			name:                      "TestActivateLoan_Valid_3",
			loanId:                    "test-loan-3",
			principalAmount:           222,
			interestAmount:            22,
			adminFee:                  10,
			expectedAdminFeeIncome:    9,
			expectedPurchaseValue:     222,
			expectedDoubtfulAllowance: 2,
			bookingDate:               time.Now(),
			shouldErr:                 false,
		},
	}

	for _, tc := range testCases {
		err := useCase.BookActivateLoan(context.Background(), tc.loanId, "asd", tc.principalAmount, tc.interestAmount, tc.bookingDate, tc.adminFee)
		if tc.shouldErr && err == nil {
			t.Errorf("Test %s should have returned error and did not", tc.name)
		}
		if !tc.shouldErr {
			if err != nil {
				t.Errorf("Test %s useCase.BookkeepActivateLoan returned error", tc.name)
			}

			transactions, err := useCase.GetAllJournalTransactionsForLoan(context.Background(), tc.loanId)
			if err != nil {
				t.Errorf("Test %s service.GetAllTransactionsForLoan returned error", tc.name)
			}

			if len(transactions) != 3 { // new purchase and doubtful allowance transactions
				t.Errorf("Test %s length of transactions is not 3", tc.name)
				continue
			}

			transaction := transactions[0]

			if len(transaction.Entries()) != 2 {
				t.Errorf("Test %s length of purchase entries is not 2", tc.name)
			}

			err = transaction.Verify()

			if err != nil {
				t.Errorf("Test %s resulted purchase transaction is not a valid transaction", tc.name)
			}

			for _, entry := range transaction.Entries() {
				switch entry.Account() {
				case domain.JournalAccountMerchantAccountsPayable:
					if entry.Amount().Units() != tc.expectedPurchaseValue {
						t.Errorf("Test %s result journal entry amount is incorrect %s", tc.name, entry.Account())
					}
				case domain.JournalMerchantDue:
					if entry.Amount().Units() != tc.expectedPurchaseValue {
						t.Errorf("Test %s result journal entry amount is incorrect %s", tc.name, entry.Account())
					}
				}
			}

			transaction = transactions[1]

			if len(transaction.Entries()) != 7 {
				t.Errorf("Test %s length of activate loan entries is not 7", tc.name)
			}

			err = transaction.Verify()

			if err != nil {
				t.Errorf("Test %s resulted loan activation transaction is not a valid transaction", tc.name)
			}

			for _, entry := range transaction.Entries() {
				switch entry.Account() {
				case domain.JournalAccountMurabhaInterestReceivable:
					if entry.Amount().Units() != tc.interestAmount {
						t.Errorf("Test %s result journal entry amount is incorrect %s", tc.name, entry.Account())
					}
				case domain.JournalAccountMurabhaLoanReceivable:
					if entry.Amount().Units() != tc.principalAmount {
						t.Errorf("Test %s result journal entry amount is incorrect %s", tc.name, entry.Account())
					}
				case domain.JournalAccountMurabhaUnearnedRevenue:
					if entry.Amount().Units() != tc.interestAmount {
						t.Errorf("Test %s result journal entry amount is incorrect %s", tc.name, entry.Account())
					}
				case domain.JournalAccountMerchantAccountsPayable:
					if entry.Amount().Units() != tc.principalAmount {
						t.Errorf("Test %s result journal entry amount is incorrect %s", tc.name, entry.Account())
					}
				case domain.JournalMerchantDue:
					if entry.Amount().Units() != tc.adminFee {
						t.Errorf("Test %s result journal entry amount is incorrect %s, expected %d, got %d",
							tc.name, entry.Account(), tc.adminFee, entry.Amount().Units())
					}
				case domain.JournalAccountAdminFeeReceivable:
					if entry.Amount().Units() != tc.expectedAdminFeeIncome {
						t.Errorf("Test %s result journal entry amount is incorrect %s, expected %d, got %d",
							tc.name, entry.Account(), tc.expectedAdminFeeIncome, entry.Amount().Units())
					}
				case domain.JournalAccountTaxDue:
					if entry.Amount().Units() != tc.adminFee-tc.expectedAdminFeeIncome {
						t.Errorf("Test %s result journal entry amount is incorrect %s, expected %d, got %d",
							tc.name, entry.Account(), tc.adminFee-tc.expectedAdminFeeIncome, entry.Amount().Units())
					}
				}
			}

			transaction = transactions[2]

			if len(transaction.Entries()) != 2 {
				t.Errorf("Test %s length of doubtful allowance entries is not 2", tc.name)
			}

			err = transaction.Verify()

			if err != nil {
				t.Errorf("Test %s resulted doubtful allowance transaction is not a valid transaction", tc.name)
			}

			for _, entry := range transaction.Entries() {
				switch entry.Account() {
				case domain.JournalAllowanceDoubtful:
					if entry.Amount().Units() != tc.expectedDoubtfulAllowance {
						t.Errorf("Test %s result journal entry amount is incorrect %s", tc.name, entry.Account())
					}
				case domain.JournalAllowanceDoubtfulReceivable:
					if entry.Amount().Units() != tc.expectedDoubtfulAllowance {
						t.Errorf("Test %s result journal entry amount is incorrect %s", tc.name, entry.Account())
					}
				}
			}
		}
	}
}
