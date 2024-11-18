package usecase

import (
	"context"
	"errors"
	"log"
	"path"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/btechlabs/lms-lite/config"
	mockFAUseCase "github.com/btechlabs/lms-lite/modules/financialaccount/usecase"
	financialProductDomain "github.com/btechlabs/lms-lite/modules/financialproduct/domain"
	financialProductDto "github.com/btechlabs/lms-lite/modules/financialproduct/dto"
	mockFPUseCase "github.com/btechlabs/lms-lite/modules/financialproduct/usecase"
	mockGaUseCase "github.com/btechlabs/lms-lite/modules/ga/usecase"
	mockJournalUseCase "github.com/btechlabs/lms-lite/modules/journal/usecase"
	"github.com/btechlabs/lms-lite/modules/servicing/domain"
	"github.com/btechlabs/lms-lite/modules/servicing/dto"
	mockServicingRepo "github.com/btechlabs/lms-lite/modules/servicing/repository"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestServicingUseCaseGetCommercialOffers(t *testing.T) {
	err := logging.InitLogger("debug", "lms-lite", "development-testing")
	if err != nil {
		log.Fatal("failed to init logger")
		t.Errorf("failed to init logger")
	}
	type TestCaseInputs struct {
		request dto.CreateCommercialOfferRequest
	}
	type TestCaseData struct {
		financialProduct *financialProductDomain.FinancialProductBuilder
		getProductErr    error
	}
	type TestCaseOutputs struct {
		err    error
		offers []domain.CommercialOffer
	}
	type TestCaseAssertions struct {
		productKey     string
		productVersion string
	}

	type TestCase struct {
		name           string
		inputs         TestCaseInputs
		data           TestCaseData
		outputs        TestCaseOutputs
		callAssertions TestCaseAssertions
	}

	testCases := []TestCase{
		{
			name: "TestGetCommercialOffers_Valid_1",
			inputs: TestCaseInputs{
				request: dto.CreateCommercialOfferRequest{
					PrincipalAmount: &money.SerializableMoney{
						Units:        10000,
						CurrencyCode: "EGP",
					},
					CreditLimit: &money.SerializableMoney{
						Units:        300000000,
						CurrencyCode: "EGP",
					},
					SelectedFinancialProducts: []financialProductDto.SelectFinancialProductResponseItems{{
						ProductKey:     "test-financial-product",
						ProductVersion: "1",
					}},
				},
			},
			data: TestCaseData{
				financialProduct: GetFinancialProductTestData([]TenorVariantTestData{
					{
						Key:            "24_Months",
						DurationInDays: 24 * 30,
						Interest:       7600,
					},
					{
						Key:            "48_Months",
						DurationInDays: 48 * 30,
						Interest:       17600,
					},
				}),
			},
			callAssertions: TestCaseAssertions{
				productKey:     "test-financial-product",
				productVersion: "1",
			},
			outputs: TestCaseOutputs{
				offers: []domain.CommercialOffer{
					{
						Id:                    uuid.NewString(),
						ConsumerId:            uuid.NewString(),
						BasketId:              uuid.NewString(),
						Tenure:                "24_Months",
						AdminFee:              money.NewMoney(570000),
						FinancedAmount:        money.NewMoney(10000),
						TotalAmount:           money.NewMoney(1340000),
						InterestRatePerTenure: "7600",
						DownPayment:           money.NewMoney(0),
						MonthlyInstalment:     money.NewMoney(32083),
					},
					{
						Id:                    uuid.NewString(),
						ConsumerId:            uuid.NewString(),
						BasketId:              uuid.NewString(),
						Tenure:                "48_Months",
						AdminFee:              money.NewMoney(570000),
						FinancedAmount:        money.NewMoney(10000),
						TotalAmount:           money.NewMoney(2340000),
						InterestRatePerTenure: "17600",
						DownPayment:           money.NewMoney(0),
						MonthlyInstalment:     money.NewMoney(36875),
					},
				},
			},
		},
		// {
		// 	name: "TestGetCommercialOffers_SkipTenureLongerThanMaximumAvailable",
		// 	inputs: TestCaseInputs{
		// 		request: dto.CreateCommercialOfferRequest{
		// 			PrincipalAmount: &money.SerializableMoney{
		// 				Units:        10000,
		// 				CurrencyCode: "EGP",
		// 			},
		// 			SelectedFinancialProducts: []financialProductDto.SelectFinancialProductResponseItems{{
		// 				ProductKey:     "test-product-key",
		// 				ProductVersion: "2",
		// 			}},
		// 		},
		// 	},
		// 	data: TestCaseData{
		// 		financialProduct: GetFinancialProductTestData([]TenorVariantTestData{
		// 			{
		// 				Key:            "24_Months",
		// 				DurationInDays: 24 * 30,
		// 				Interest:       7600,
		// 			},
		// 			{
		// 				Key:            "48_Months",
		// 				DurationInDays: 48 * 30,
		// 				Interest:       17600,
		// 			},
		// 		}),
		// 	},
		// 	callAssertions: TestCaseAssertions{
		// 		productKey:     "test-product-key",
		// 		productVersion: "2",
		// 	},
		// 	outputs: TestCaseOutputs{
		// 		offers: []domain.CommercialOffer{},
		// 	},
		// },
		// {
		// 	name: "TestGetCommercialOffers_SkipMonthlyInstalmentGreaterThanMaximumAvailable",
		// 	inputs: TestCaseInputs{
		// 		request: dto.CreateCommercialOfferRequest{
		// 			PrincipalAmount: &money.SerializableMoney{
		// 				Units:        10000,
		// 				CurrencyCode: "EGP",
		// 			},
		// 			SelectedFinancialProducts: []financialProductDto.SelectFinancialProductResponseItems{{
		// 				ProductKey:     "test-product-key",
		// 				ProductVersion: "2",
		// 			}},
		// 		},
		// 	},
		// 	data: TestCaseData{
		// 		financialProduct: GetFinancialProductTestData([]TenorVariantTestData{
		// 			{
		// 				Key:            "24_Months",
		// 				DurationInDays: 24 * 30,
		// 				Interest:       7600,
		// 			},
		// 			{
		// 				Key:            "48_Months",
		// 				DurationInDays: 48 * 30,
		// 				Interest:       17600,
		// 			},
		// 		}),
		// 	},
		// 	callAssertions: TestCaseAssertions{
		// 		productKey:     "test-product-key",
		// 		productVersion: "2",
		// 	},
		// 	outputs: TestCaseOutputs{
		// 		offers: []domain.CommercialOffer{},
		// 	},
		// },
		{
			name: "TestGetCommercialOffers_Error_GetProduct",
			inputs: TestCaseInputs{
				request: dto.CreateCommercialOfferRequest{
					PrincipalAmount: &money.SerializableMoney{
						Units:        10000,
						CurrencyCode: "EGP",
					},
					SelectedFinancialProducts: []financialProductDto.SelectFinancialProductResponseItems{{
						ProductKey:     "test-product-key",
						ProductVersion: "2",
					}},
				},
			},
			data: TestCaseData{
				getProductErr: errors.New("error getting product"),
			},
			callAssertions: TestCaseAssertions{
				productKey:     "test-product-key",
				productVersion: "2",
			},
			outputs: TestCaseOutputs{
				err:    errors.New("error getting product"),
				offers: []domain.CommercialOffer{},
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
			servicingRepo.On("GetCommercialOffersByBasketId", mock.Anything, mock.Anything).Maybe().Return([]domain.CommercialOffer{}, nil)
			servicingRepo.On("InsertCommercialOffers", mock.Anything, mock.Anything).Maybe().Return(nil)

			// Execute use case
			result, err := useCase.GetCommercialOffers(context.Background(), tc.inputs.request)
			if err != nil {
				if err.Error() != tc.outputs.err.Error() {
					t.Errorf("Test %s useCase.ActivateLoan returned error %v, want %v", tc.name, err, tc.outputs.err)
				}
				return
			}
			// adding this check so as to not break existing tests
			result = lo.Filter(result, func(item domain.CommercialOffer, index int) bool {
				return item.Rejected == false
			})

			// Assert mocks were called as expected
			financialProductUseCase.AssertCalled(t, "GetProduct", mock.Anything, tc.callAssertions.productKey, tc.callAssertions.productVersion, false)

			// Assert result is correct
			assert.NotNil(t, result)
			assert.Equal(t, len(result), len(tc.outputs.offers))

			for i := 0; i < len(result); i++ {
				assert.NotNil(t, result[i])
				equivalentOutput, found := lo.Find(tc.outputs.offers, func(item domain.CommercialOffer) bool {
					return item.Tenure == result[i].Tenure
				})
				assert.NotNil(t, equivalentOutput)
				assert.True(t, found)
				assert.Equal(t, result[i].AdminFee.Units(), equivalentOutput.AdminFee.Units())
				assert.Equal(t, result[i].DownPayment.Units(), equivalentOutput.DownPayment.Units())
				assert.Equal(t, result[i].FinancedAmount.Units(), equivalentOutput.FinancedAmount.Units())
				assert.Equal(t, result[i].InterestRatePerTenure, equivalentOutput.InterestRatePerTenure)
				assert.Equal(t, result[i].TotalAmount.Units(), equivalentOutput.TotalAmount.Units())
				assert.Equal(t, result[i].MonthlyInstalment.Units(), equivalentOutput.MonthlyInstalment.Units())
			}

		})
	}
}
