package usecase

import (
	context "context"
	"errors"
	"log"
	"path"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/btechlabs/lms-lite/config"
	mockFAUseCase "github.com/btechlabs/lms-lite/modules/financialaccount/usecase"
	mockFPUseCase "github.com/btechlabs/lms-lite/modules/financialproduct/usecase"
	mockGaUseCase "github.com/btechlabs/lms-lite/modules/ga/usecase"
	mockJournalUseCase "github.com/btechlabs/lms-lite/modules/journal/usecase"
	domain "github.com/btechlabs/lms-lite/modules/servicing/domain"
	mockServicingRepo "github.com/btechlabs/lms-lite/modules/servicing/repository"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/stretchr/testify/assert"
	mock "github.com/stretchr/testify/mock"
)

type testLoan struct {
	id         string
	merchantId string
}

func buildTestLoans(t *testing.T, l []testLoan) []*domain.MerchantLoan {
	t.Helper()
	loans := []*domain.MerchantLoan{}
	for _, val := range l {
		loan := domain.MerchantLoan{
			Loan: &domain.Loan{},
		}
		domain.SetLoanId(loan.Loan, val.id)
		domain.SetLoanMerchantGlobalId(loan.Loan, val.merchantId)
		loans = append(loans, &loan)
	}
	return loans
}

func TestServicingUseCaseGetAllLoansForMerchant(t *testing.T) {
	err := logging.InitLogger("debug", "lms-lite", "development-testing")
	if err != nil {
		log.Fatal("failed to init logger")
		t.Errorf("failed to init logger")
	}
	type TestCaseInputs struct {
		merchantId string
		loanIds    []string
	}
	type TestCaseOutputs struct {
		loans []*domain.MerchantLoan
		err   error
	}
	type TestCaseAssertions struct {
		loans []testLoan
		err   error
	}
	type TestCase struct {
		name           string
		inputs         TestCaseInputs
		outputs        TestCaseOutputs
		callAssertions TestCaseAssertions
	}
	testCases := []TestCase{
		{
			name: "TestGetAllLoansForMerchant_Valid_0",
			inputs: TestCaseInputs{
				merchantId: "test-merchant-id",
				loanIds: []string{
					"test-loan-id",
				},
			},
			callAssertions: TestCaseAssertions{},
			outputs: TestCaseOutputs{
				loans: []*domain.MerchantLoan{},
				err:   nil,
			},
		},
		{
			name: "TestGetAllLoansForMerchant_Valid_1",
			inputs: TestCaseInputs{
				merchantId: "test-merchant-id",
				loanIds: []string{
					"test-loan-id",
				},
			},
			callAssertions: TestCaseAssertions{
				loans: []testLoan{
					{
						id:         "test-loan-id",
						merchantId: "test-merchant-id",
					},
				},
			},
			outputs: TestCaseOutputs{
				loans: buildTestLoans(t, []testLoan{
					{
						id:         "test-loan-id",
						merchantId: "test-merchant-id",
					},
				}),
				err: nil,
			},
		},
		{
			name: "TestGetAllLoansForMerchant_Valid_2",
			inputs: TestCaseInputs{
				merchantId: "test-merchant-id",
				loanIds: []string{
					"test-loan-id",
				},
			},
			callAssertions: TestCaseAssertions{
				loans: []testLoan{
					{
						id:         "test-loan-id-1",
						merchantId: "test-merchant-id-1",
					},
					{
						id:         "test-loan-id-2",
						merchantId: "test-merchant-id-2",
					},
				},
			},
			outputs: TestCaseOutputs{
				loans: buildTestLoans(t, []testLoan{
					{
						id:         "test-loan-id-1",
						merchantId: "test-merchant-id-1",
					},
					{
						id:         "test-loan-id-2",
						merchantId: "test-merchant-id-2",
					},
				}),
				err: nil,
			},
		},
		{
			name: "TestGetAllLoansForMerchant_Error",
			inputs: TestCaseInputs{
				merchantId: "test-merchant-id",
				loanIds: []string{
					"test-loan-id",
				},
			},
			callAssertions: TestCaseAssertions{
				err: errors.New("error getting loan"),
			},
			outputs: TestCaseOutputs{
				loans: []*domain.MerchantLoan{},
				err:   errors.New("error getting product"),
			},
		},
	}
	// Test running
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Dependencies
			servicingRepo := mockServicingRepo.NewMockServicingRepository(t)
			financialProductUseCase := mockFPUseCase.NewMockFinancialProductUseCase(t)
			financialAccountUseCase := mockFAUseCase.NewMockFinancialAccountUseCase(t)
			journalUseCase := mockJournalUseCase.NewMockJournalUseCase(t)
			gaUseCase := mockGaUseCase.NewMockGaUseCase(t)

			_, b, _, _ := runtime.Caller(0)
			basePath := filepath.Dir(b)
			conf, err := config.LoadEnvConfig(path.Join(basePath, "../../../", "assets"))
			if err != nil {
				t.Fatal(err)
			}

			useCase := NewServicingUseCase(financialProductUseCase, financialAccountUseCase, journalUseCase, gaUseCase, servicingRepo, *conf)

			// Set up mocks returning test-case data
			servicingRepo.On("GetAllLoansForMerchant", mock.Anything, mock.AnythingOfType("string"), mock.Anything).Maybe().Return(tc.outputs.loans, tc.outputs.err)

			// Execute use case
			result, err := useCase.GetAllLoansForMerchant(context.Background(), tc.inputs.merchantId, tc.inputs.loanIds)
			if err != nil {
				assert.Equal(t, err, tc.outputs.err)
				return
			}

			// Assert result is correct
			assert.NotNil(t, result)
			assert.Equal(t, len(result), len(tc.outputs.loans))

			for i := 0; i < len(result); i++ {
				assert.NotNil(t, result[i])
				assert.Equal(t, result[i].Loan.Id(), tc.callAssertions.loans[i].id)
				assert.Equal(t, result[i].Loan.MerchantId(), tc.callAssertions.loans[i].merchantId)
			}

		})
	}
}
