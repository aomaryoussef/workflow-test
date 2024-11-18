package usecase

import (
	"context"
	"errors"
	"fmt"
	"path"
	"path/filepath"
	"runtime"
	"strconv"
	"testing"
	
	"github.com/btechlabs/lms-lite/config"
	financialAccountDomain "github.com/btechlabs/lms-lite/modules/financialaccount/domain"
	mockFAUseCase "github.com/btechlabs/lms-lite/modules/financialaccount/usecase"
	financialProductDomain "github.com/btechlabs/lms-lite/modules/financialproduct/domain"
	mockFPUseCase "github.com/btechlabs/lms-lite/modules/financialproduct/usecase"
	mockGaUseCase "github.com/btechlabs/lms-lite/modules/ga/usecase"
	mockJournalUseCase "github.com/btechlabs/lms-lite/modules/journal/usecase"
	"github.com/btechlabs/lms-lite/modules/servicing/domain"
	"github.com/btechlabs/lms-lite/modules/servicing/dto"
	mockServicingRepo "github.com/btechlabs/lms-lite/modules/servicing/repository"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/samber/lo"
	"github.com/stretchr/testify/mock"
)

func GetCommercialOffer(principal uint64, tenorKey string, pKey string, pVersion string) (commercialOffer *domain.CommercialOffer) {
	return &domain.CommercialOffer{
		ConsumerId:              "test-consumer",
		Tenure:                  tenorKey,
		FinancedAmount:          money.NewMoney(principal),
		AdminFee:                money.NewMoney(3008),
		TotalAmount:             money.NewMoney(principal + 3008 + 10000),
		MonthlyInstalment:       money.NewMoney(5000),
		FinancialProductKey:     pKey,
		FinancialProductVersion: pVersion,
	}
}

type TenorVariantTestData struct {
	Key            string
	DurationInDays uint16
	Interest       int
}

func GetFinancialProductTestData(tenorVariants []TenorVariantTestData) (fp *financialProductDomain.FinancialProductBuilder) {
	tenorVariantBuilders := lo.Map(tenorVariants, func(tenorVariant TenorVariantTestData, i int) *financialProductDomain.FinancialProductTenorVariantBuilder {
		return &financialProductDomain.FinancialProductTenorVariantBuilder{
			Key:            tenorVariant.Key,
			DurationInDays: tenorVariant.DurationInDays,
			MinimumDownpayment: &financialProductDomain.FinancialProductDownpaymentBuilder{
				Type:  "FORMULA",
				Value: "0.00% + 0.00",
			},
			MaximumDownpayment: &financialProductDomain.FinancialProductDownpaymentBuilder{
				Type:  "FORMULA",
				Value: "10.00% + 0.00",
			},
			TenorPhaseBuilders: []*financialProductDomain.FinancialProductTenorPhaseBuilder{
				{
					DurationInDays: tenorVariant.DurationInDays,
					InterestBuilder: &financialProductDomain.FinancialProductInterestBuilder{
						Interest:                     strconv.Itoa(tenorVariant.Interest),
						InterestMethodology:          "DECLINING",
						InterestCompoundingFrequency: "MONTHLY",
						InterestType:                 "PERCENT",
					},
					LateFeeBuilder: &financialProductDomain.FinancialProductLateFeeBuilder{
						LateFeeType:  "FIXED",
						LateFeeValue: "5000",
					},
				},
			},
		}
	})
	
	return &financialProductDomain.FinancialProductBuilder{
		Id:                               "AQBPM5420B",
		Description:                      "test-loan-1",
		Key:                              "test-financial-product",
		ActiveSince:                      "2006-01-02T15:04:05Z",
		ActiveUntil:                      "2099-01-02T15:04:05Z",
		GlobalGracePeriodInDays:          7,
		PreviousVersion:                  "0",
		Version:                          "1",
		Name:                             "test-loan-1",
		GlobalMinimumApplicablePrincipal: "10.00",
		GlobalMaximumApplicablePrincipal: "1000000",
		GlobalRepaymentDaysOfMonth:       "8,9",
		GlobalAdminFeeBuilder: &financialProductDomain.FinancialProductAdminFeeBuilder{
			FeeType:  "MONETARY",
			FeeValue: "5000",
		},
		GlobalBadDebtBuilder: &financialProductDomain.FinancialProductBadDebtBuilder{
			BadDebtType:  "PERCENT",
			BadDebtValue: "1670",
		},
		TenorVariantBuilder: tenorVariantBuilders,
	}
}

func TestServicingUseCaseActivateLoan(t *testing.T) {
	err := logging.InitLogger("debug", "lms-lite", "development-testing")
	if err != nil {
		t.Fatal("failed to init logger")
	}
	
	// Test Cases
	
	type TestCaseInputs struct {
		request dto.ActivateLoanRequest
	}
	type TestCaseOutputs struct {
		err error
	}
	type TestCaseData struct {
		commercialOffer          *domain.CommercialOffer
		ammortizationSchedule    *financialProductDomain.AmmortizationSchedule
		ammortizationScheduleErr error
		financialProduct         *financialProductDomain.FinancialProductBuilder
		getProductErr            error
		merchantAccount          *financialAccountDomain.PartyAccount
		findMerchantAccountErr   error
		consumerAccount          *financialAccountDomain.PartyAccount
		findConsumerAccountErr   error
		insertCommandErr         error
		bookActivateLoanErr      error
		createLoanErr            error
	}
	type TestCaseAssertions struct {
		consumerId        string
		merchantId        string
		loanApplicationId string
		productKey        string
		productVersion    string
		commandType       domain.CommandType
		principal         uint64
		interest          uint64
	}
	type TestCase struct {
		name           string
		inputs         TestCaseInputs
		outputs        TestCaseOutputs
		data           TestCaseData
		callAssertions TestCaseAssertions
	}
	
	testCases := []TestCase{
		{
			name: "TestActivateLoan_Valid_1",
			inputs: TestCaseInputs{
				request: dto.ActivateLoanRequest{
					ConsumerId:                 "test-consumer",
					LoanApplicationId:          "test-loan-application",
					LoanApplicationBookingTime: "2023-10-25T09:48:08Z",
					CorrelationId:              "test-correlation-id",
					MerchantId:                 "test-merchant-id",
				},
			},
			outputs: TestCaseOutputs{
				err: nil,
			},
			data: TestCaseData{
				commercialOffer: GetCommercialOffer(1000, "48_Months", "test-financial-product", "1"),
				ammortizationSchedule: &financialProductDomain.AmmortizationSchedule{
					PaymentSchedule: []financialProductDomain.AmortizationScheduleInstalment{},
				},
				financialProduct: GetFinancialProductTestData([]TenorVariantTestData{
					{
						Key:            "48_Months",
						DurationInDays: 48 * 30,
						Interest:       17600,
					},
				}),
				merchantAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-merchant-id",
					Type:              financialAccountDomain.PartyAccountTypeMerchant,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
				consumerAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-consumer",
					Type:              financialAccountDomain.PartyAccountTypeIndividual,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
			},
			callAssertions: TestCaseAssertions{
				consumerId:        "test-consumer",
				merchantId:        "test-merchant-id",
				loanApplicationId: "test-loan-application",
				productKey:        "test-financial-product",
				productVersion:    "1",
				commandType:       domain.CommandTypeActivateLoan,
				principal:         1000,
				interest:          176000,
			},
		},
		{
			name: "TestActivateLoan_Error_MerchantAccountInactive",
			inputs: TestCaseInputs{
				request: dto.ActivateLoanRequest{
					ConsumerId:                 "test-consumer",
					LoanApplicationId:          "test-loan-application",
					LoanApplicationBookingTime: "2023-10-25T09:48:08Z",
					CorrelationId:              "test-correlation-id",
					MerchantId:                 "test-merchant-id",
				},
			},
			outputs: TestCaseOutputs{
				err: fmt.Errorf("servicing_usecase#ActivateLoan - merchant account id: test-merchant-id not active"),
			},
			data: TestCaseData{
				commercialOffer: GetCommercialOffer(1000000, "48_Months", "test-financial-product", "1"),
				merchantAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-merchant-id",
					Type:              financialAccountDomain.PartyAccountTypeMerchant,
					Status:            financialAccountDomain.PartyAccountStatusInactive,
				},
				consumerAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-consumer",
					Type:              financialAccountDomain.PartyAccountTypeIndividual,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
			},
			callAssertions: TestCaseAssertions{
				consumerId:        "test-consumer",
				loanApplicationId: "test-loan-application",
				productKey:        "test-financial-product",
				productVersion:    "1",
				commandType:       domain.CommandTypeActivateLoan,
				principal:         1000000,
				interest:          1760000,
			},
		},
		{
			name: "TestActivateLoan_Error_ConsumerAccountInactive",
			inputs: TestCaseInputs{
				request: dto.ActivateLoanRequest{
					ConsumerId:                 "test-consumer",
					LoanApplicationId:          "test-loan-application",
					LoanApplicationBookingTime: "2023-10-25T09:48:08Z",
					CorrelationId:              "test-correlation-id",
					MerchantId:                 "test-merchant-id",
				},
			},
			outputs: TestCaseOutputs{
				err: fmt.Errorf("servicing_usecase#ActivateLoan - consumer account id: test-consumer is not active"),
			},
			data: TestCaseData{
				commercialOffer: GetCommercialOffer(1000000, "48_Months", "test-financial-product", "1"),
				merchantAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-merchant-id",
					Type:              financialAccountDomain.PartyAccountTypeMerchant,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
				consumerAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-consumer",
					Type:              financialAccountDomain.PartyAccountTypeIndividual,
					Status:            financialAccountDomain.PartyAccountStatusInactive,
				},
			},
			callAssertions: TestCaseAssertions{
				consumerId:        "test-consumer",
				loanApplicationId: "test-loan-application",
				productKey:        "test-financial-product",
				productVersion:    "1",
				commandType:       domain.CommandTypeActivateLoan,
				principal:         1000000,
				interest:          1760000,
			},
		},
		{
			name: "TestActivateLoan_Error_CalculateAmmortizationSchedule",
			inputs: TestCaseInputs{
				request: dto.ActivateLoanRequest{
					ConsumerId:                 "test-consumer",
					LoanApplicationId:          "test-loan-application",
					LoanApplicationBookingTime: "2023-10-25T09:48:08Z",
					CorrelationId:              "test-correlation-id",
					MerchantId:                 "test-merchant-id",
				},
			},
			outputs: TestCaseOutputs{
				err: errors.New("servicing_usecase#ActivateLoan - ammortization schedule failed error: error calculating amortization schedule"),
			},
			data: TestCaseData{
				financialProduct: GetFinancialProductTestData([]TenorVariantTestData{
					{
						Key:            "48_Months",
						DurationInDays: 48 * 30,
						Interest:       17600,
					},
				}),
				commercialOffer:          GetCommercialOffer(1000, "48_Months", "test-financial-product", "1"),
				ammortizationScheduleErr: errors.New("error calculating amortization schedule"),
				merchantAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-merchant-id",
					Type:              financialAccountDomain.PartyAccountTypeMerchant,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
				consumerAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-consumer-id",
					Type:              financialAccountDomain.PartyAccountTypeIndividual,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
			},
			callAssertions: TestCaseAssertions{
				consumerId:        "test-consumer",
				merchantId:        "test-merchant",
				loanApplicationId: "test-loan-application",
				productKey:        "test-financial-product",
				productVersion:    "1",
				commandType:       domain.CommandTypeActivateLoan,
				principal:         1000,
				interest:          176000,
			},
		},
		{
			name: "TestActivateLoan_Error_GetProduct",
			inputs: TestCaseInputs{
				request: dto.ActivateLoanRequest{
					ConsumerId:                 "test-consumer",
					LoanApplicationId:          "test-loan-application",
					LoanApplicationBookingTime: "2023-10-25T09:48:08Z",
					CorrelationId:              "test-correlation-id",
					MerchantId:                 "test-merchant-id",
				},
			},
			outputs: TestCaseOutputs{
				err: errors.New("servicing_usecase#ActivateLoan - error getting product definition for key test-financial-product with version 1: error getting product"),
			},
			data: TestCaseData{
				commercialOffer:       GetCommercialOffer(1000, "48_Months", "test-financial-product", "1"),
				ammortizationSchedule: &financialProductDomain.AmmortizationSchedule{},
				getProductErr:         errors.New("error getting product"),
				merchantAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-merchant-id",
					Type:              financialAccountDomain.PartyAccountTypeMerchant,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
				consumerAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-consumer-id",
					Type:              financialAccountDomain.PartyAccountTypeIndividual,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
			},
			callAssertions: TestCaseAssertions{
				consumerId:        "test-consumer",
				merchantId:        "test-merchant",
				loanApplicationId: "test-loan-application",
				productKey:        "test-financial-product",
				productVersion:    "1",
				commandType:       domain.CommandTypeActivateLoan,
				principal:         1000,
				interest:          176000,
			},
		},
		{
			name: "TestActivateLoan_Error_InsertCommand",
			inputs: TestCaseInputs{
				request: dto.ActivateLoanRequest{
					ConsumerId:                 "test-consumer",
					LoanApplicationId:          "test-loan-application",
					LoanApplicationBookingTime: "2023-10-25T09:48:08Z",
					CorrelationId:              "test-correlation-id",
					MerchantId:                 "test-merchant-id",
				},
			},
			outputs: TestCaseOutputs{
				err: errors.New("error inserting command"),
			},
			data: TestCaseData{
				commercialOffer:       GetCommercialOffer(1000, "48_Months", "test-financial-product", "1"),
				ammortizationSchedule: &financialProductDomain.AmmortizationSchedule{},
				financialProduct: GetFinancialProductTestData([]TenorVariantTestData{
					{
						Key:            "48_Months",
						DurationInDays: 48 * 30,
						Interest:       17600,
					},
				}),
				insertCommandErr: errors.New("error inserting command"),
				merchantAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-merchant-id",
					Type:              financialAccountDomain.PartyAccountTypeMerchant,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
				consumerAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-consumer-id",
					Type:              financialAccountDomain.PartyAccountTypeIndividual,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
			},
			callAssertions: TestCaseAssertions{
				consumerId:        "test-consumer",
				merchantId:        "test-merchant",
				loanApplicationId: "test-loan-application",
				productKey:        "test-financial-product",
				productVersion:    "1",
				commandType:       domain.CommandTypeActivateLoan,
				principal:         1000,
				interest:          176000,
			},
		},
		{
			name: "TestActivateLoan_Error_BookActivateLoan",
			inputs: TestCaseInputs{
				request: dto.ActivateLoanRequest{
					ConsumerId:                 "test-consumer",
					LoanApplicationId:          "test-loan-application",
					LoanApplicationBookingTime: "2023-10-25T09:48:08Z",
					CorrelationId:              "test-correlation-id",
					MerchantId:                 "test-merchant-id",
				},
			},
			outputs: TestCaseOutputs{
				err: errors.New("error booking activate loan"),
			},
			data: TestCaseData{
				commercialOffer:       GetCommercialOffer(1000, "48_Months", "test-financial-product", "1"),
				ammortizationSchedule: &financialProductDomain.AmmortizationSchedule{},
				financialProduct: GetFinancialProductTestData([]TenorVariantTestData{
					{
						Key:            "48_Months",
						DurationInDays: 48 * 30,
						Interest:       17600,
					},
				}),
				bookActivateLoanErr: errors.New("error booking activate loan"),
				merchantAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-merchant-id",
					Type:              financialAccountDomain.PartyAccountTypeMerchant,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
				consumerAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-consumer-id",
					Type:              financialAccountDomain.PartyAccountTypeIndividual,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
			},
			callAssertions: TestCaseAssertions{
				consumerId:        "test-consumer",
				merchantId:        "test-merchant",
				loanApplicationId: "test-loan-application",
				productKey:        "test-financial-product",
				productVersion:    "1",
				commandType:       domain.CommandTypeActivateLoan,
				principal:         1000,
				interest:          176000,
			},
		},
		{
			name: "TestActivateLoan_Error_CreateLoan",
			inputs: TestCaseInputs{
				request: dto.ActivateLoanRequest{
					ConsumerId:                 "test-consumer",
					LoanApplicationId:          "test-loan-application",
					LoanApplicationBookingTime: "2023-10-25T09:48:08Z",
					CorrelationId:              "test-correlation-id",
					MerchantId:                 "test-merchant-id",
				},
			},
			outputs: TestCaseOutputs{
				err: errors.New("error creating loan"),
			},
			data: TestCaseData{
				commercialOffer:       GetCommercialOffer(1000, "48_Months", "test-financial-product", "1"),
				ammortizationSchedule: &financialProductDomain.AmmortizationSchedule{},
				financialProduct: GetFinancialProductTestData([]TenorVariantTestData{
					{
						Key:            "48_Months",
						DurationInDays: 48 * 30,
						Interest:       17600,
					},
				}),
				createLoanErr: errors.New("error creating loan"),
				merchantAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-merchant-id",
					Type:              financialAccountDomain.PartyAccountTypeMerchant,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
				consumerAccount: &financialAccountDomain.PartyAccount{
					GlobalReferenceId: "test-consumer-id",
					Type:              financialAccountDomain.PartyAccountTypeIndividual,
					Status:            financialAccountDomain.PartyAccountStatusActive,
				},
			},
			callAssertions: TestCaseAssertions{
				consumerId:        "test-consumer",
				merchantId:        "test-merchant",
				loanApplicationId: "test-loan-application",
				productKey:        "test-financial-product",
				productVersion:    "1",
				commandType:       domain.CommandTypeActivateLoan,
				principal:         1000,
				interest:          176000,
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
			
			// Build test data
			var fp *financialProductDomain.FinancialProduct
			if tc.data.financialProduct != nil {
				fp, err = tc.data.financialProduct.Build()
				if err != nil {
					t.Fatal(err)
				}
			}
			
			// Set up mocks returning test-case data
			
			financialProductUseCase.On("GetProduct", mock.Anything, mock.Anything, mock.Anything, mock.Anything).Maybe().Return(fp, tc.data.getProductErr)
			financialProductUseCase.On("CalculateAmmortizationSchedule", mock.Anything, mock.Anything).Maybe().Return(tc.data.ammortizationSchedule, tc.data.ammortizationScheduleErr)
			financialAccountUseCase.On("FindMerchantAccount", mock.Anything, mock.Anything).Maybe().Return(tc.data.merchantAccount, tc.data.findMerchantAccountErr)
			financialAccountUseCase.On("FindConsumerAccount", mock.Anything, mock.Anything).Maybe().Return(tc.data.consumerAccount, tc.data.findConsumerAccountErr)
			journalUseCase.On("BookActivateLoan", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).Maybe().Return(tc.data.bookActivateLoanErr)
			servicingRepo.On("InsertCommand", mock.Anything, mock.Anything).Maybe().Return(tc.data.insertCommandErr)
			servicingRepo.On("CreateLoan", mock.Anything, mock.Anything).Maybe().Return(tc.data.createLoanErr)
			servicingRepo.On("GetCommercialOfferById", mock.Anything, mock.Anything).Maybe().Return(tc.data.commercialOffer, nil)
			offerArray := []domain.CommercialOffer{}
			offerArray = append(offerArray, *tc.data.commercialOffer)
			servicingRepo.On("GetCommercialOffersByBasketId", mock.Anything, mock.Anything).Maybe().Return(offerArray, nil)
			gaUseCase.On("BookLoanTransactionSlip", mock.Anything, mock.Anything).Maybe().Return(nil)
			
			// Execute use case
			
			ctx := context.WithValue(context.Background(), logging.CorrelationIdContextKey, "test-correlation-id")
			
			_, err = useCase.ActivateLoan(ctx, tc.inputs.request)
			if err != nil {
				if err.Error() != tc.outputs.err.Error() {
					t.Errorf("Test %s useCase.ActivateLoan returned error %v, want %v", tc.name, err, tc.outputs.err)
				}
				return
			}
			
			// Assert mocks were called as expected
			financialProductUseCase.AssertCalled(t, "GetProduct", mock.Anything, tc.callAssertions.productKey, tc.callAssertions.productVersion, false)
			financialProductUseCase.AssertCalled(t, "CalculateAmmortizationSchedule", mock.Anything, mock.Anything)
			journalUseCase.AssertCalled(t, "BookActivateLoan", mock.Anything, mock.Anything, mock.Anything, tc.callAssertions.principal, tc.callAssertions.interest, mock.Anything, mock.Anything)
			servicingRepo.AssertCalled(t, "InsertCommand", mock.Anything, mock.MatchedBy(func(cmd domain.Command) bool {
				return cmd.Type == tc.callAssertions.commandType && cmd.ConsumerId == tc.callAssertions.consumerId
			}))
			servicingRepo.AssertCalled(t, "CreateLoan", mock.Anything, mock.MatchedBy(
				func(loan domain.Loan) bool {
					return loan.ConsumerId() == tc.callAssertions.consumerId
				},
			))
			
		})
	}
	
}
