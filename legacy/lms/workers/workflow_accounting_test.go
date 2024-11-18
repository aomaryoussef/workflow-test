package workers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/btechlabs/lms-lite/internal/http/domain"
	"github.com/btechlabs/lms-lite/internal/http/rest"
	financialProductDto "github.com/btechlabs/lms-lite/modules/financialproduct/dto"
	gaDto "github.com/btechlabs/lms-lite/modules/ga/dto"
	jr "github.com/btechlabs/lms-lite/modules/journal/repository"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/btechlabs/lms-lite/pkg/stringconv"
	libWorker "github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/btechlabs/lms-lite/workers/checkout"
	"github.com/btechlabs/lms-lite/workers/disbursement"
	"github.com/btechlabs/lms-lite/workers/endofday"
	"github.com/btechlabs/lms-lite/workers/onboarding"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/mitchellh/mapstructure"
	"github.com/stretchr/testify/assert"
)

func (suite *WorkersIntegrationTestSuite) TestAccountingValues() {
	t := suite.T()
	openConsumerAccountTask := libWorker.NewDecoratorTaskWorker(onboarding.NewOpenConsumerAccountTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	openConsumerAccountTaskFn := openConsumerAccountTask.GetTaskFunction()

	openMerchantAccountTask := libWorker.NewDecoratorTaskWorker(onboarding.NewOpenMerchantAccountTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	openMerchantAccountTaskFn := openMerchantAccountTask.GetTaskFunction()

	updateConsumerAccountStatusTask := libWorker.NewDecoratorTaskWorker(onboarding.NewUpdateConsumerAccountStatusTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	updateConsumerAccountStatusFn := updateConsumerAccountStatusTask.GetTaskFunction()

	updateMerchantAccountStatusTask := libWorker.NewDecoratorTaskWorker(onboarding.NewUpdateMerchantAccountStatusTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	updateMerchantAccountStatusFn := updateMerchantAccountStatusTask.GetTaskFunction()

	getCommercialOfferTask := libWorker.NewDecoratorTaskWorker(checkout.NewCommercialOfferTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	getCommercialOfferTaskFn := getCommercialOfferTask.GetTaskFunction()

	// TODO: add filterCommercialOfferTask

	loanActivationTask := libWorker.NewDecoratorTaskWorker(checkout.NewActivateLoanTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	activateLoanTaskFn := loanActivationTask.GetTaskFunction()

	endOfDayAggregatesTask := libWorker.NewDecoratorTaskWorker(endofday.NewEndOfDayAggregatesTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	endOfDayAggregatesTaskFn := endOfDayAggregatesTask.GetTaskFunction()

	bookMerchantInvoicesTask := libWorker.NewDecoratorTaskWorker(disbursement.NewBookMerchantInvoicesTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	bookMerchantInvoicesTaskFn := bookMerchantInvoicesTask.GetTaskFunction()

	getAllLoansForConsumerRestCall := rest.GetAllLoansForConsumer(suite.coreApp)
	getAllLoansForMerchantRestCall := rest.GetAllLoansForMerchant(suite.coreApp)
	getTransactionDetailsRestCall := rest.GetTransactionDetails(suite.coreApp)

	journalRepository := jr.NewJournalPostgresRepository(suite.coreApp.GetConnectionManager())

	type TestCaseLoanInputs struct {
		basketValue             uint64
		tenorVariantKey         string
		bookingTime             string
		monthlyAvailablePayment uint64
		maximumAvailableTenor   uint
	}
	type TestCaseCommercialOffer struct {
		tenorKey                 string
		adminFee                 uint64
		financedAmount           uint64
		totalAmount              uint64
		downpayment              uint64
		monthlyInstalment        uint64
		annualPercentageRate     uint64
		flatEffectiveRate        uint64
		annualInterestPercentage uint64
	}
	type TestCaseJournalEntry struct {
		account         string
		direction       string
		amount          uint64
		transactionType string
	}
	type TestCaseTransaction struct {
		entries []TestCaseJournalEntry
	}
	type TestCaseLoanOutputs struct {
		expectedError             error
		expectedCommercialOffers  []TestCaseCommercialOffer
		expectedTransactions      []TestCaseTransaction
		expectedNumberOfSchedules int
	}

	type TestCaseLoan struct {
		inputs  TestCaseLoanInputs
		outputs TestCaseLoanOutputs
	}
	type TestCase struct {
		name           string
		productKey     string
		productVersion string
		merchantId     string
		consumerId     string
		loans          []TestCaseLoan
	}

	testProduct01_2000EGP_Basket_CommercialOffers := []TestCaseCommercialOffer{
		{
			tenorKey:                 "12_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              200000,
			downpayment:              0,
			monthlyInstalment:        16667,
			annualPercentageRate:     0,
			annualInterestPercentage: 0,
			flatEffectiveRate:        0,
		},
		{
			tenorKey:                 "24_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              200000,
			downpayment:              0,
			monthlyInstalment:        8333,
			annualPercentageRate:     0,
			annualInterestPercentage: 0,
			flatEffectiveRate:        0,
		},
		{
			tenorKey:                 "36_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              200000,
			downpayment:              0,
			monthlyInstalment:        5556,
			annualPercentageRate:     0,
			annualInterestPercentage: 0,
			flatEffectiveRate:        0,
		},
		{
			tenorKey:                 "48_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              200000,
			downpayment:              0,
			monthlyInstalment:        4167,
			annualPercentageRate:     0,
			annualInterestPercentage: 0,
			flatEffectiveRate:        0,
		},
		{
			tenorKey:                 "60_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              200000,
			downpayment:              0,
			monthlyInstalment:        3333,
			annualPercentageRate:     0,
			annualInterestPercentage: 0,
			flatEffectiveRate:        0,
		},
	}
	testProduct01_2000EGP_Basket_JournalEntries := []TestCaseTransaction{
		{
			entries: []TestCaseJournalEntry{
				{
					account:         "MurabhaPurchase",
					amount:          200000,
					direction:       "DEBIT",
					transactionType: "PURCHASING_FROM_MERCHANT",
				},
				{
					account:         "MerchantDue",
					amount:          200000,
					direction:       "CREDIT",
					transactionType: "PURCHASING_FROM_MERCHANT",
				},
			},
		},
		{
			entries: []TestCaseJournalEntry{
				{
					account:         "MurabhaPrincipalReceivable",
					amount:          200000,
					direction:       "DEBIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MurabhaInterestReceivable",
					amount:          0,
					direction:       "DEBIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MurabhaPurchase",
					amount:          200000,
					direction:       "CREDIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MurabhaUnearnedRevenue",
					amount:          0,
					direction:       "CREDIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MerchantDue",
					amount:          0,
					direction:       "DEBIT",
					transactionType: "ADMIN_FEE",
				},
				{
					account:         "AdminFeeReceivable",
					amount:          0,
					direction:       "CREDIT",
					transactionType: "ADMIN_FEE",
				},
				{
					account:         "TaxDue",
					amount:          0,
					direction:       "CREDIT",
					transactionType: "ADMIN_FEE",
				},
			},
		},
		{
			entries: []TestCaseJournalEntry{
				{
					account:         "Doubtful",
					amount:          2000,
					direction:       "DEBIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "DoubtfulReceivable",
					amount:          2000,
					direction:       "CREDIT",
					transactionType: "LOAN_ACTIVATION",
				},
			},
		},
	}

	testProduct01_Rounded_2000EGP_Basket_CommercialOffers := []TestCaseCommercialOffer{
		{
			tenorKey:                 "12_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              200400,
			downpayment:              0,
			monthlyInstalment:        16700,
			annualPercentageRate:     20,
			annualInterestPercentage: 0,
			flatEffectiveRate:        20,
		},
		{
			tenorKey:                 "24_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              201600,
			downpayment:              0,
			monthlyInstalment:        8400,
			annualPercentageRate:     41,
			annualInterestPercentage: 0,
			flatEffectiveRate:        80,
		},
		{
			tenorKey:                 "36_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              201600,
			downpayment:              0,
			monthlyInstalment:        5600,
			annualPercentageRate:     27,
			annualInterestPercentage: 0,
			flatEffectiveRate:        80,
		},
		{
			tenorKey:                 "48_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              201600,
			downpayment:              0,
			monthlyInstalment:        4200,
			annualPercentageRate:     20,
			annualInterestPercentage: 0,
			flatEffectiveRate:        80,
		},
		{
			tenorKey:                 "60_Months",
			adminFee:                 0,
			financedAmount:           200000,
			totalAmount:              204000,
			downpayment:              0,
			monthlyInstalment:        3400,
			annualPercentageRate:     41,
			annualInterestPercentage: 0,
			flatEffectiveRate:        200,
		},
	}

	testProduct02_2000EGP_Basket_CommercialOffers := []TestCaseCommercialOffer{
		{
			tenorKey:                 "12_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              559980,
			downpayment:              0,
			monthlyInstalment:        46000,
			annualPercentageRate:     18249,
			annualInterestPercentage: 17600,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "24_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              559980,
			downpayment:              0,
			monthlyInstalment:        23000,
			annualPercentageRate:     9124,
			annualInterestPercentage: 8800,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "36_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              559980,
			downpayment:              0,
			monthlyInstalment:        15333,
			annualPercentageRate:     6083,
			annualInterestPercentage: 5867,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "48_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              559980,
			downpayment:              0,
			monthlyInstalment:        11500,
			annualPercentageRate:     4562,
			annualInterestPercentage: 4400,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "60_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              559980,
			downpayment:              0,
			monthlyInstalment:        9200,
			annualPercentageRate:     3650,
			annualInterestPercentage: 3520,
			flatEffectiveRate:        17600,
		},
	}
	testProduct02_2000EGP_Basket_JournalEntries := []TestCaseTransaction{
		{
			entries: []TestCaseJournalEntry{
				{
					account:         "MurabhaPurchase",
					amount:          200000,
					direction:       "DEBIT",
					transactionType: "PURCHASING_FROM_MERCHANT",
				},
				{
					account:         "MerchantDue",
					amount:          200000,
					direction:       "CREDIT",
					transactionType: "PURCHASING_FROM_MERCHANT",
				},
			},
		},
		{
			entries: []TestCaseJournalEntry{
				{
					account:         "MurabhaPrincipalReceivable",
					amount:          200000,
					direction:       "DEBIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MurabhaInterestReceivable",
					amount:          352000,
					direction:       "DEBIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MurabhaPurchase",
					amount:          200000,
					direction:       "CREDIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MurabhaUnearnedRevenue",
					amount:          352000,
					direction:       "CREDIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MerchantDue",
					amount:          7980,
					direction:       "DEBIT",
					transactionType: "ADMIN_FEE",
				},
				{
					account:         "AdminFeeReceivable",
					amount:          7000,
					direction:       "CREDIT",
					transactionType: "ADMIN_FEE",
				},
				{
					account:         "TaxDue",
					amount:          980,
					direction:       "CREDIT",
					transactionType: "ADMIN_FEE",
				},
			},
		},
		{
			entries: []TestCaseJournalEntry{
				{
					account:         "Doubtful",
					amount:          2000,
					direction:       "DEBIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "DoubtfulReceivable",
					amount:          2000,
					direction:       "CREDIT",
					transactionType: "LOAN_ACTIVATION",
				},
			},
		},
	}

	testProduct02_Rounded_2000EGP_Basket_CommercialOffers := []TestCaseCommercialOffer{
		{
			tenorKey:                 "12_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              559980,
			downpayment:              0,
			monthlyInstalment:        46000,
			annualPercentageRate:     18249,
			annualInterestPercentage: 17600,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "24_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              559980,
			downpayment:              0,
			monthlyInstalment:        23000,
			annualPercentageRate:     9124,
			annualInterestPercentage: 8800,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "36_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              562380,
			downpayment:              0,
			monthlyInstalment:        15400,
			annualPercentageRate:     6124,
			annualInterestPercentage: 5867,
			flatEffectiveRate:        17720,
		},
		{
			tenorKey:                 "48_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              559980,
			downpayment:              0,
			monthlyInstalment:        11500,
			annualPercentageRate:     4562,
			annualInterestPercentage: 4400,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "60_Months",
			adminFee:                 7980,
			financedAmount:           200000,
			totalAmount:              559980,
			downpayment:              0,
			monthlyInstalment:        9200,
			annualPercentageRate:     3650,
			annualInterestPercentage: 3520,
			flatEffectiveRate:        17600,
		},
	}

	testProduct03_2000EGP_Basket_CommercialOffers := []TestCaseCommercialOffer{
		{
			tenorKey:                 "12_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              554280,
			downpayment:              0,
			monthlyInstalment:        46000,
			annualPercentageRate:     17960,
			annualInterestPercentage: 17600,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "24_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              554280,
			downpayment:              0,
			monthlyInstalment:        23000,
			annualPercentageRate:     8980,
			annualInterestPercentage: 8800,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "36_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              554280,
			downpayment:              0,
			monthlyInstalment:        15333,
			annualPercentageRate:     5987,
			annualInterestPercentage: 5867,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "48_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              554280,
			downpayment:              0,
			monthlyInstalment:        11500,
			annualPercentageRate:     4490,
			annualInterestPercentage: 4400,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "60_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              554280,
			downpayment:              0,
			monthlyInstalment:        9200,
			annualPercentageRate:     3592,
			annualInterestPercentage: 3520,
			flatEffectiveRate:        17600,
		},
	}
	testProduct03_2000EGP_Basket_JournalEntries := []TestCaseTransaction{
		{
			entries: []TestCaseJournalEntry{
				{
					account:         "MurabhaPurchase",
					amount:          200000,
					direction:       "DEBIT",
					transactionType: "PURCHASING_FROM_MERCHANT",
				},
				{
					account:         "MerchantDue",
					amount:          200000,
					direction:       "CREDIT",
					transactionType: "PURCHASING_FROM_MERCHANT",
				},
			},
		},
		{
			entries: []TestCaseJournalEntry{
				{
					account:         "MurabhaPrincipalReceivable",
					amount:          200000,
					direction:       "DEBIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MurabhaInterestReceivable",
					amount:          352000,
					direction:       "DEBIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MurabhaPurchase",
					amount:          200000,
					direction:       "CREDIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MurabhaUnearnedRevenue",
					amount:          352000,
					direction:       "CREDIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "MerchantDue",
					amount:          2280,
					direction:       "DEBIT",
					transactionType: "ADMIN_FEE",
				},
				{
					account:         "AdminFeeReceivable",
					amount:          2000,
					direction:       "CREDIT",
					transactionType: "ADMIN_FEE",
				},
				{
					account:         "TaxDue",
					amount:          280,
					direction:       "CREDIT",
					transactionType: "ADMIN_FEE",
				},
			},
		},
		{
			entries: []TestCaseJournalEntry{
				{
					account:         "Doubtful",
					amount:          2000,
					direction:       "DEBIT",
					transactionType: "LOAN_ACTIVATION",
				},
				{
					account:         "DoubtfulReceivable",
					amount:          2000,
					direction:       "CREDIT",
					transactionType: "LOAN_ACTIVATION",
				},
			},
		},
	}

	testProduct03_Rounded_2000EGP_Basket_CommercialOffers := []TestCaseCommercialOffer{
		{
			tenorKey:                 "12_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              554280,
			downpayment:              0,
			monthlyInstalment:        46000,
			annualPercentageRate:     17960,
			annualInterestPercentage: 17600,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "24_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              554280,
			downpayment:              0,
			monthlyInstalment:        23000,
			annualPercentageRate:     8980,
			annualInterestPercentage: 8800,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "36_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              556680,
			downpayment:              0,
			monthlyInstalment:        15400,
			annualPercentageRate:     6027,
			annualInterestPercentage: 5867,
			flatEffectiveRate:        17720,
		},
		{
			tenorKey:                 "48_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              554280,
			downpayment:              0,
			monthlyInstalment:        11500,
			annualPercentageRate:     4490,
			annualInterestPercentage: 4400,
			flatEffectiveRate:        17600,
		},
		{
			tenorKey:                 "60_Months",
			adminFee:                 2280,
			financedAmount:           200000,
			totalAmount:              554280,
			downpayment:              0,
			monthlyInstalment:        9200,
			annualPercentageRate:     3592,
			annualInterestPercentage: 3520,
			flatEffectiveRate:        17600,
		},
	}

	testCases := []TestCase{
		{
			name:           "TestCheckouts_Integration_OneLoan_SuccessfulActivation_001",
			productKey:     "test-product-01",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-01-03T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct01_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct01_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 12,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "24_Months",
						bookingTime:             "2069-01-04T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct01_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct01_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 24,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "36_Months",
						bookingTime:             "2069-01-05T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct01_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct01_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 36,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "48_Months",
						bookingTime:             "2069-01-06T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct01_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct01_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 48,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "60_Months",
						bookingTime:             "2069-01-07T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct01_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct01_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 60,
					},
				},
			},
		},
		{
			name:           "TestCheckouts_Integration_OneLoan_SuccessfulActivation_002",
			productKey:     "test-product-01-rounded",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-02-03T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:            nil,
						expectedCommercialOffers: testProduct01_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions: []TestCaseTransaction{
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
									{
										account:         "MerchantDue",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPrincipalReceivable",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaInterestReceivable",
										amount:          400,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaUnearnedRevenue",
										amount:          400,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MerchantDue",
										amount:          0,
										direction:       "DEBIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "AdminFeeReceivable",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "TaxDue",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "Doubtful",
										amount:          2000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "DoubtfulReceivable",
										amount:          2000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
								},
							},
						},
						expectedNumberOfSchedules: 12,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "24_Months",
						bookingTime:             "2069-02-04T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:            nil,
						expectedCommercialOffers: testProduct01_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions: []TestCaseTransaction{
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
									{
										account:         "MerchantDue",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPrincipalReceivable",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaInterestReceivable",
										amount:          1600,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaUnearnedRevenue",
										amount:          1600,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MerchantDue",
										amount:          0,
										direction:       "DEBIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "AdminFeeReceivable",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "TaxDue",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "Doubtful",
										amount:          2000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "DoubtfulReceivable",
										amount:          2000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
								},
							},
						},
						expectedNumberOfSchedules: 24,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "36_Months",
						bookingTime:             "2069-02-05T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:            nil,
						expectedCommercialOffers: testProduct01_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions: []TestCaseTransaction{
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
									{
										account:         "MerchantDue",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPrincipalReceivable",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaInterestReceivable",
										amount:          1600,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaUnearnedRevenue",
										amount:          1600,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MerchantDue",
										amount:          0,
										direction:       "DEBIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "AdminFeeReceivable",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "TaxDue",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "Doubtful",
										amount:          2000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "DoubtfulReceivable",
										amount:          2000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
								},
							},
						},
						expectedNumberOfSchedules: 36,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "48_Months",
						bookingTime:             "2069-02-06T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:            nil,
						expectedCommercialOffers: testProduct01_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions: []TestCaseTransaction{
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
									{
										account:         "MerchantDue",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPrincipalReceivable",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaInterestReceivable",
										amount:          1600,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaUnearnedRevenue",
										amount:          1600,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MerchantDue",
										amount:          0,
										direction:       "DEBIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "AdminFeeReceivable",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "TaxDue",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "Doubtful",
										amount:          2000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "DoubtfulReceivable",
										amount:          2000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
								},
							},
						},
						expectedNumberOfSchedules: 48,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "60_Months",
						bookingTime:             "2069-02-07T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:            nil,
						expectedCommercialOffers: testProduct01_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions: []TestCaseTransaction{
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
									{
										account:         "MerchantDue",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPrincipalReceivable",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaInterestReceivable",
										amount:          4000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaUnearnedRevenue",
										amount:          4000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MerchantDue",
										amount:          0,
										direction:       "DEBIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "AdminFeeReceivable",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "TaxDue",
										amount:          0,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "Doubtful",
										amount:          2000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "DoubtfulReceivable",
										amount:          2000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
								},
							},
						},
						expectedNumberOfSchedules: 60,
					},
				},
			},
		},
		{
			name:           "TestCheckouts_Integration_OneLoan_SuccessfulActivation_003",
			productKey:     "test-product-02",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-01-08T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct02_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct02_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 12,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "24_Months",
						bookingTime:             "2069-01-08T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct02_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct02_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 24,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "36_Months",
						bookingTime:             "2069-01-09T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct02_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct02_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 36,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "48_Months",
						bookingTime:             "2069-01-09T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct02_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct02_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 48,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "60_Months",
						bookingTime:             "2069-01-10T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct02_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct02_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 60,
					},
				},
			},
		},
		{
			name:           "TestCheckouts_Integration_OneLoan_SuccessfulActivation_004",
			productKey:     "test-product-02-rounded",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-02-08T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct02_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct02_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 12,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "24_Months",
						bookingTime:             "2069-02-08T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct02_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct02_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 24,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "36_Months",
						bookingTime:             "2069-02-09T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:            nil,
						expectedCommercialOffers: testProduct02_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions: []TestCaseTransaction{
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
									{
										account:         "MerchantDue",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPrincipalReceivable",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaInterestReceivable",
										amount:          354400,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaUnearnedRevenue",
										amount:          354400,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MerchantDue",
										amount:          7980,
										direction:       "DEBIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "AdminFeeReceivable",
										amount:          7000,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "TaxDue",
										amount:          980,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "Doubtful",
										amount:          2000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "DoubtfulReceivable",
										amount:          2000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
								},
							},
						},
						expectedNumberOfSchedules: 36,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "48_Months",
						bookingTime:             "2069-02-09T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct02_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct02_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 48,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "60_Months",
						bookingTime:             "2069-02-10T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct02_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct02_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 60,
					},
				},
			},
		},
		{
			name:           "TestCheckouts_Integration_OneLoan_SuccessfulActivation_005",
			productKey:     "test-product-03",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-01-10T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct03_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct03_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 12,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "24_Months",
						bookingTime:             "2069-01-11T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct03_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct03_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 24,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "36_Months",
						bookingTime:             "2069-01-11T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct03_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct03_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 36,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "48_Months",
						bookingTime:             "2069-01-11T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct03_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct03_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 48,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "60_Months",
						bookingTime:             "2069-01-12T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct03_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct03_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 60,
					},
				},
			},
		},
		{
			name:           "TestCheckouts_Integration_OneLoan_SuccessfulActivation_006",
			productKey:     "test-product-03-rounded",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-02-10T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct03_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct03_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 12,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "24_Months",
						bookingTime:             "2069-02-11T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct03_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct03_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 24,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "36_Months",
						bookingTime:             "2069-02-11T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:            nil,
						expectedCommercialOffers: testProduct03_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions: []TestCaseTransaction{
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
									{
										account:         "MerchantDue",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "PURCHASING_FROM_MERCHANT",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "MurabhaPrincipalReceivable",
										amount:          200000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaInterestReceivable",
										amount:          354400,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaPurchase",
										amount:          200000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MurabhaUnearnedRevenue",
										amount:          354400,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "MerchantDue",
										amount:          2280,
										direction:       "DEBIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "AdminFeeReceivable",
										amount:          2000,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
									{
										account:         "TaxDue",
										amount:          280,
										direction:       "CREDIT",
										transactionType: "ADMIN_FEE",
									},
								},
							},
							{
								entries: []TestCaseJournalEntry{
									{
										account:         "Doubtful",
										amount:          2000,
										direction:       "DEBIT",
										transactionType: "LOAN_ACTIVATION",
									},
									{
										account:         "DoubtfulReceivable",
										amount:          2000,
										direction:       "CREDIT",
										transactionType: "LOAN_ACTIVATION",
									},
								},
							},
						},
						expectedNumberOfSchedules: 36,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "48_Months",
						bookingTime:             "2069-02-11T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct03_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct03_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 48,
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             200000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "60_Months",
						bookingTime:             "2069-02-12T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError:             nil,
						expectedCommercialOffers:  testProduct03_Rounded_2000EGP_Basket_CommercialOffers,
						expectedTransactions:      testProduct03_2000EGP_Basket_JournalEntries,
						expectedNumberOfSchedules: 60,
					},
				},
			},
		},
		{
			name:           "TestCheckouts_Integration_OneLoan_Rejected_TooLowBasket",
			productKey:     "test-product-03",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             49900,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-01-12T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError: fmt.Errorf("No offers generated for basket, see logs for reasons"),
					},
				},
				{
					inputs: TestCaseLoanInputs{
						basketValue:             49900,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "24_Months",
						bookingTime:             "2069-01-12T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError: fmt.Errorf("No offers generated for basket, see logs for reasons"),
					},
				},
			},
		},
		{
			name:           "TestCheckouts_Integration_OneLoan_Rejected_TooLowBasket_Rounded",
			productKey:     "test-product-03-rounded",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             49900,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-02-12T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError: fmt.Errorf("No offers generated for basket, see logs for reasons"),
					},
				},
			},
		},
		{
			name:           "TestCheckouts_Integration_OneLoan_Rejected_TooLowBasket_WithDownpayment",
			productKey:     "test-product-04",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             50000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-01-11T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError: fmt.Errorf("No offers generated for basket, see logs for reasons"),
					},
				},
			},
		},
		{
			name:           "TestCheckouts_Integration_OneLoan_Rejected_TooLowBasket_WithDownpayment_Rounded",
			productKey:     "test-product-04-rounded",
			productVersion: "1",
			merchantId:     "test_merchant_id_for_accounting",
			consumerId:     "test_consumer_id_for_accounting",
			loans: []TestCaseLoan{
				{
					inputs: TestCaseLoanInputs{
						basketValue:             50000,
						monthlyAvailablePayment: 170000,
						maximumAvailableTenor:   1800,
						tenorVariantKey:         "12_Months",
						bookingTime:             "2069-01-11T09:48:08Z",
					},
					outputs: TestCaseLoanOutputs{
						expectedError: fmt.Errorf("No offers generated for basket, see logs for reasons"),
					},
				},
			},
		},
	}

	for _, tc := range testCases {
		for _, tcl := range tc.loans {
			t.Run(tc.name+"/"+tcl.inputs.tenorVariantKey, func(t *testing.T) {
				if tc.consumerId != "" {
					openConsumerAccountTaskRes, err := openConsumerAccountTaskFn(&model.Task{
						TaskId:      openConsumerAccountTask.GetName(),
						TaskDefName: "open_consumer_account",
						TaskDefinition: &model.TaskDef{
							Name: "open_consumer_account",
						},
						WorkflowTask: &model.WorkflowTask{
							Name: "open_consumer_account",
						},
						InputData: map[string]interface{}{
							"consumer_id": tc.consumerId,
						},
					})

					if err == nil || err.Error() != fmt.Errorf("Account %s already exists", tc.consumerId).Error() { // optional check
						assert.Nil(t, err)
						assert.NotNil(t, openConsumerAccountTaskRes)

						updateConsumerAccountStatusTaskRes, err := updateConsumerAccountStatusFn(&model.Task{
							WorkerId:           "worker-id-001",
							WorkflowInstanceId: "workflow-instance-id-001",
							TaskId:             updateConsumerAccountStatusTask.GetName(),
							TaskDefName:        "update_consumer_account_status",
							TaskDefinition: &model.TaskDef{
								Name: "update_consumer_account_status",
							},
							WorkflowTask: &model.WorkflowTask{
								Name: "update_consumer_account_status",
							},
							InputData: map[string]interface{}{
								"consumer_id": tc.consumerId,
								"status":      "ACTIVE",
							},
						})

						assert.Nil(t, err)
						assert.NotNil(t, updateConsumerAccountStatusTaskRes)
					}
				}

				if tc.merchantId != "" {
					openMerchantAccountTaskRes, err := openMerchantAccountTaskFn(&model.Task{
						WorkerId:           "worker-id-001",
						WorkflowInstanceId: "workflow-instance-id-001",
						TaskId:             openMerchantAccountTask.GetName(),
						TaskDefName:        "open_merchant_account",
						TaskDefinition: &model.TaskDef{
							Name: "open_merchant_account",
						},
						WorkflowTask: &model.WorkflowTask{
							Name: "open_merchant_account",
						},
						InputData: map[string]interface{}{
							"merchant_id": tc.merchantId,
						},
					})

					if err == nil || err.Error() != fmt.Errorf("Account %s already exists", tc.merchantId).Error() { // optional check
						assert.Nil(t, err)
						assert.NotNil(t, openMerchantAccountTaskRes)

						updateMerchantAccountStatusTaskRes, err := updateMerchantAccountStatusFn(&model.Task{
							WorkerId:           "worker-id-001",
							WorkflowInstanceId: "workflow-instance-id-001",
							TaskId:             updateMerchantAccountStatusTask.GetName(),
							TaskDefName:        "update_merchant_account_status",
							TaskDefinition: &model.TaskDef{
								Name: "update_merchant_account_status",
							},
							WorkflowTask: &model.WorkflowTask{
								Name: "update_merchant_account_status",
							},
							InputData: map[string]interface{}{
								"merchant_id": tc.merchantId,
								"status":      "ACTIVE",
							},
						})

						assert.Nil(t, err)
						assert.NotNil(t, updateMerchantAccountStatusTaskRes)
					}
				}

				getCommercialOfferTaskRes, err := getCommercialOfferTaskFn(&model.Task{
					WorkerId:           "worker-id-001",
					WorkflowInstanceId: "workflow-instance-id-001",
					TaskId:             getCommercialOfferTask.GetName(),
					TaskDefName:        "get_commercial_offer",
					TaskDefinition: &model.TaskDef{
						Name: "get_commercial_offer",
					},
					WorkflowTask: &model.WorkflowTask{
						Name: "get_commercial_offer",
					},
					InputData: map[string]interface{}{
						"selected_financial_products": []financialProductDto.SelectFinancialProductResponseItems{
							{
								ProductKey:     tc.productKey,
								ProductVersion: tc.productVersion,
							},
						},
						"consumer_id": tc.consumerId,
						"credit_limit": &money.SerializableMoney{
							Units:        100000000,
							CurrencyCode: "EGP",
						},
						"basket_id": uuid.New().String(),
						"principal_amount": &money.SerializableMoney{
							Units:        tcl.inputs.basketValue,
							CurrencyCode: "EGP",
						},
					},
				})

				if tcl.outputs.expectedError != nil {
					assert.Equal(t, tcl.outputs.expectedError, err)
				} else {
					assert.Nil(t, err)
					assert.NotNil(t, getCommercialOfferTaskRes)

					commercialOfferOutputData := getCommercialOfferTaskRes.(*model.TaskResult).OutputData
					assert.NotNil(t, commercialOfferOutputData)
					offerDetailsOutputData := commercialOfferOutputData["offer_details"].([]interface{})
					assert.NotNil(t, offerDetailsOutputData)
					var selectedOffer *map[string]interface{}
					for _, o := range offerDetailsOutputData {
						om := o.(map[string]interface{})
						if om["tenure"] == tcl.inputs.tenorVariantKey {
							selectedOffer = &om
						}
						var expectedOffer *TestCaseCommercialOffer
						for _, expected := range tcl.outputs.expectedCommercialOffers {
							if expected.tenorKey == om["tenure"] {
								expectedOffer = &expected
								break
							}
						}
						assert.NotNil(t, expectedOffer, "Tenor %s was not expected to be returned", om["tenure"])
						if expectedOffer != nil {
							// decode serializable money values and assert
							assert.Equal(t, expectedOffer.adminFee, getUnits(om["admin_fee"]),
								"Tenor %s expected %d admin fee, but got %d", om["tenure"], expectedOffer.adminFee, getUnits(om["admin_fee"]))
							assert.Equal(t, expectedOffer.downpayment, getUnits(om["down_payment"]),
								"Tenor %s expected %d downpayment, but got %d", om["tenure"], expectedOffer.downpayment, getUnits(om["down_payment"]))
							assert.Equal(t, expectedOffer.financedAmount, getUnits(om["financed_amount"]),
								"Tenor %s expected %d financed amount, but got %d", om["tenure"], expectedOffer.financedAmount, getUnits(om["financed_amount"]))
							assert.Equal(t, expectedOffer.monthlyInstalment, getUnits(om["monthly_instalment"]),
								"Tenor %s expected %d monthly instalment, but got %d", om["tenure"], expectedOffer.monthlyInstalment, getUnits(om["monthly_instalment"]))
							assert.Equal(t, expectedOffer.totalAmount, getUnits(om["total_amount"]),
								"Tenor %s expected %d total amount, but got %d", om["tenure"], expectedOffer.totalAmount, getUnits(om["total_amount"]))

							AIP := getPercentage(t, om["annual_interest_percentage"])
							ARP := getPercentage(t, om["annual_percentage_rate"])
							FER := getPercentage(t, om["flat_effective_rate"])
							assert.Equal(t, expectedOffer.annualInterestPercentage, AIP,
								"Tenor %s expected %d annual interest percentage, but got %d from %s original value",
								om["tenure"], expectedOffer.annualInterestPercentage, AIP, om["annual_interest_percentage"])
							assert.Equal(t, expectedOffer.annualPercentageRate, ARP,
								"Tenor %s expected %d annual percentage rate, but got %d from %s original value",
								om["tenure"], expectedOffer.annualPercentageRate, ARP, om["annual_percentage_rate"])
							assert.Equal(t, expectedOffer.flatEffectiveRate, FER,
								"Tenor %s expected %d flat effective rate, but got %d from %s original value",
								om["tenure"], expectedOffer.flatEffectiveRate, FER, om["flat_effective_rate"])
						}
					}
					assert.NotNil(t, selectedOffer, "Could not find expected tenor variant %s in commercial offers", tcl.inputs.tenorVariantKey)

					offer := *selectedOffer
					activateLoanTaskRes, err := activateLoanTaskFn(&model.Task{
						WorkerId:           "worker-id-001",
						WorkflowInstanceId: "workflow-instance-id-001",
						TaskId:             loanActivationTask.GetName(),
						TaskDefName:        "activate_loan",
						TaskDefinition: &model.TaskDef{
							Name: "activate_loan",
						},
						WorkflowTask: &model.WorkflowTask{
							Name: "activate_loan",
						},
						InputData: map[string]interface{}{
							"merchant_id":       tc.merchantId,
							"selected_offer_id": offer["id"],
							"consumer_id":       tc.consumerId,
							"booking_time":      tcl.inputs.bookingTime,
						},
					})

					assert.Nil(t, err)
					assert.NotNil(t, activateLoanTaskRes)

					activateLoanTaskOutputData := activateLoanTaskRes.(*model.TaskResult).OutputData
					activatedLoanDetails := activateLoanTaskOutputData["activated_loan"].(map[string]interface{})
					loanId := activatedLoanDetails["loan_id"].(string)
					assert.NotNil(t, loanId)

					// query journal entries from db and compare to expected array
					cm := suite.coreApp.GetConnectionManager()
					// tx := cm.GetTransaction()
					// err = tx.Begin(suite.ctx)
					ctx, err := cm.InjectTx(suite.ctx)
					assert.Nil(t, err)

					journalTransactions, err := journalRepository.GetAllForLoan(ctx, loanId)
					assert.Nil(t, err)
					fmt.Printf("%+v\n", journalTransactions)
					assert.Equal(t, len(tcl.outputs.expectedTransactions), len(journalTransactions), "Unexpected number of transactions recorded on journal, expected %d, got %d", len(tcl.outputs.expectedTransactions), len(journalTransactions))

					for i := 0; i < len(journalTransactions); i++ {
						ejt := tcl.outputs.expectedTransactions[journalTransactions[i].Id()-1]
						journalEntries := journalTransactions[i].Entries()

						if len(ejt.entries) != len(journalEntries) {
							assert.Fail(t, "Expected entries length does not equal to returned entries length")
							break
						}

						for j := 0; j < len(journalEntries); j++ {
							foundAccountName := false
							for k := 0; k < len(ejt.entries); k++ {
								if ejt.entries[k].account == string(journalEntries[j].Account()) {
									foundAccountName = true
									assert.Equal(t, ejt.entries[k].amount, journalEntries[j].Amount().Units(), "Account %s expected to be %d but got %d", ejt.entries[k].account, ejt.entries[k].amount, journalEntries[j].Amount().Units())
									assert.Equal(t, ejt.entries[k].direction, string(journalEntries[j].Direction()))
									assert.Equal(t, ejt.entries[k].transactionType, string(journalEntries[j].Type()))
								}
							}
							assert.True(t, foundAccountName, "Account %s not found in transaction %d", journalEntries[j].Account(), i)
						}
					}

					// getting loans for consumer
					resp := httptest.NewRecorder()
					req, err := http.NewRequest("GET",
						"/api/loans/consumer/{consumer_id}",
						nil)
					assert.Nil(t, err)
					rctx := chi.NewRouteContext()
					rctx.URLParams.Add("consumer_id", tc.consumerId)
					req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))

					getAllLoansForConsumerRestCall(resp, req)

					assert.Equal(t, http.StatusOK, resp.Code, "Request to get all loans for consumer failed with code %d", resp.Code)

					var lmsResponse *domain.LmsResponse
					err = json.Unmarshal(resp.Body.Bytes(), &lmsResponse)
					assert.Nil(t, err, "Failed to unmarshal response from get all loans for consumer REST call")
					assert.True(t, lmsResponse.Success)
					assert.NotNil(t, lmsResponse.Data)
					loanList := lmsResponse.Data.(map[string]interface{})["loans"].([]interface{})
					var coid interface{}
					var soadmin float64
					for _, l := range loanList {
						lmap := l.(map[string]interface{})
						if lmap["loan_id"] == loanId {

							paymentScheduleLines := lmap["payment_schedule"].([]interface{})
							assert.Equal(t, tcl.outputs.expectedNumberOfSchedules, len(paymentScheduleLines))

							sototal := (*selectedOffer)["total_amount"].(map[string]interface{})["units"].(float64)
							soadmin = (*selectedOffer)["admin_fee"].(map[string]interface{})["units"].(float64)
							sodownp := (*selectedOffer)["down_payment"].(map[string]interface{})["units"].(float64)

							sum := float64(0)
							for _, l := range paymentScheduleLines {
								llmap := l.(map[string]interface{})
								sum += llmap["principal_due"].(map[string]interface{})["amount"].(float64)
								sum += llmap["interest_due"].(map[string]interface{})["amount"].(float64)
							}

							// checking difference is less then 1 EGP, few cents diff arise from rounding algorithm diffs
							// and limiting to 2 decimals for storage (compared to Excel)
							assert.Less(t, sum-(sototal-soadmin-sodownp), float64(100))

							coid = (*selectedOffer)["id"]
							assert.Equal(t, coid, lmap["commercial_offer_id"])

							ladmin := lmap["admin_fee"].(map[string]interface{})["amount"]
							assert.Equal(t, soadmin, ladmin)
						}
					}
					assert.NotEqual(t, "", coid)

					// getting loans for merchant
					resp = httptest.NewRecorder()
					req, err = http.NewRequest("GET",
						"/api/loans/merchant/{merchant_id}",
						nil)
					assert.Nil(t, err)
					rctx = chi.NewRouteContext()
					rctx.URLParams.Add("merchant_id", tc.merchantId)
					req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))

					getAllLoansForMerchantRestCall(resp, req)

					assert.Equal(t, http.StatusOK, resp.Code, "Request to get all loans for merchant failed with code %d", resp.Code)

					err = json.Unmarshal(resp.Body.Bytes(), &lmsResponse)
					assert.Nil(t, err, "Failed to unmarshal response from get all loans for merchant REST call")
					assert.True(t, lmsResponse.Success)
					assert.NotNil(t, lmsResponse.Data)
					loanList = lmsResponse.Data.(map[string]interface{})["loans"].([]interface{})
					transactionId := ""
					for _, l := range loanList {
						lmap := l.(map[string]interface{})
						if lmap["loan_id"] == loanId {
							assert.Equal(t, coid, lmap["commercial_offer_id"])
							ladmin := lmap["admin_fee"].(map[string]interface{})["amount"]
							assert.Equal(t, soadmin, ladmin)

							transactionId = lmap["transaction_id"].(string)
							assert.NotNil(t, transactionId)
						}
					}
					assert.NotEqual(t, "", transactionId)

					resp = httptest.NewRecorder()
					req, err = http.NewRequest("GET",
						"/api/loans/merchant/transaction/{transaction_id}",
						nil)
					assert.Nil(t, err)
					rctx = chi.NewRouteContext()
					rctx.URLParams.Add("transaction_id", transactionId)
					req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))

					getTransactionDetailsRestCall(resp, req)

					assert.Equal(t, http.StatusOK, resp.Code, "Request to get transaction details failed with code %d", resp.Code)

					err = json.Unmarshal(resp.Body.Bytes(), &lmsResponse)
					assert.Nil(t, err, "Failed to unmarshal response from get transaction details REST call")
					assert.True(t, lmsResponse.Success)
					assert.NotNil(t, lmsResponse.Data)
				}
			})
		}
	}

	type TestCaseDates struct {
		name                     string
		dateStart                string
		dateEnd                  string
		totalPrincipalReceivable int64
		totalInterestReceivable  int64
		totalPurchase            int64
		totalDoubtfulAllowance   int64
		totalGrossAdminFee       int64
		totalTaxDue              int64
		totalMerchantPaid        int64
	}

	testDates := []TestCaseDates{
		{
			name:                     "2069-01-03",
			dateStart:                "2069-01-03T00:00:00Z",
			dateEnd:                  "2069-01-04T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  0,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-02-03_Rounded",
			dateStart:                "2069-02-03T00:00:00Z",
			dateEnd:                  "2069-02-04T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  400,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-01-04",
			dateStart:                "2069-01-04T00:00:00Z",
			dateEnd:                  "2069-01-05T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  0,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-02-04_Rounded",
			dateStart:                "2069-02-04T00:00:00Z",
			dateEnd:                  "2069-02-05T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  1600,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-01-05",
			dateStart:                "2069-01-05T00:00:00Z",
			dateEnd:                  "2069-01-06T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  0,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-02-05_Rounded",
			dateStart:                "2069-02-05T00:00:00Z",
			dateEnd:                  "2069-02-06T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  1600,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-01-06",
			dateStart:                "2069-01-06T00:00:00Z",
			dateEnd:                  "2069-01-07T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  0,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-02-06_Rounded",
			dateStart:                "2069-02-06T00:00:00Z",
			dateEnd:                  "2069-02-07T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  1600,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-01-07",
			dateStart:                "2069-01-07T00:00:00Z",
			dateEnd:                  "2069-01-08T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  0,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-02-07_Rounded",
			dateStart:                "2069-02-07T00:00:00Z",
			dateEnd:                  "2069-02-08T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  4000,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        200000,
		},
		{
			name:                     "2069-01-08",
			dateStart:                "2069-01-08T00:00:00Z",
			dateEnd:                  "2069-01-09T00:00:00Z",
			totalPrincipalReceivable: 400000,
			totalInterestReceivable:  704000,
			totalPurchase:            400000,
			totalDoubtfulAllowance:   4000,
			totalGrossAdminFee:       15960,
			totalTaxDue:              1960,
			totalMerchantPaid:        384040,
		},
		{
			name:                     "2069-02-08_Rounded",
			dateStart:                "2069-02-08T00:00:00Z",
			dateEnd:                  "2069-02-09T00:00:00Z",
			totalPrincipalReceivable: 400000,
			totalInterestReceivable:  704000,
			totalPurchase:            400000,
			totalDoubtfulAllowance:   4000,
			totalGrossAdminFee:       15960,
			totalTaxDue:              1960,
			totalMerchantPaid:        384040,
		},
		{
			name:                     "2069-01-09",
			dateStart:                "2069-01-09T00:00:00Z",
			dateEnd:                  "2069-01-10T00:00:00Z",
			totalPrincipalReceivable: 400000,
			totalInterestReceivable:  704000,
			totalPurchase:            400000,
			totalDoubtfulAllowance:   4000,
			totalGrossAdminFee:       15960,
			totalTaxDue:              1960,
			totalMerchantPaid:        384040,
		},
		{
			name:                     "2069-02-09_Rounded",
			dateStart:                "2069-02-09T00:00:00Z",
			dateEnd:                  "2069-02-10T00:00:00Z",
			totalPrincipalReceivable: 400000,
			totalInterestReceivable:  706400,
			totalPurchase:            400000,
			totalDoubtfulAllowance:   4000,
			totalGrossAdminFee:       15960,
			totalTaxDue:              1960,
			totalMerchantPaid:        384040,
		},
		{
			name:                     "2069-01-10",
			dateStart:                "2069-01-10T00:00:00Z",
			dateEnd:                  "2069-01-11T00:00:00Z",
			totalPrincipalReceivable: 400000,
			totalInterestReceivable:  704000,
			totalPurchase:            400000,
			totalDoubtfulAllowance:   4000,
			totalGrossAdminFee:       10260,
			totalTaxDue:              1260,
			totalMerchantPaid:        389740,
		},
		{
			name:                     "2069-02-10_Rounded",
			dateStart:                "2069-02-10T00:00:00Z",
			dateEnd:                  "2069-02-11T00:00:00Z",
			totalPrincipalReceivable: 400000,
			totalInterestReceivable:  704000,
			totalPurchase:            400000,
			totalDoubtfulAllowance:   4000,
			totalGrossAdminFee:       10260,
			totalTaxDue:              1260,
			totalMerchantPaid:        389740,
		},
		{
			name:                     "2069-01-11",
			dateStart:                "2069-01-11T00:00:00Z",
			dateEnd:                  "2069-01-12T00:00:00Z",
			totalPrincipalReceivable: 600000,
			totalInterestReceivable:  1056000,
			totalPurchase:            600000,
			totalDoubtfulAllowance:   6000,
			totalGrossAdminFee:       6840,
			totalTaxDue:              840,
			totalMerchantPaid:        593160,
		},
		{
			name:                     "2069-02-11_Rounded",
			dateStart:                "2069-02-11T00:00:00Z",
			dateEnd:                  "2069-02-12T00:00:00Z",
			totalPrincipalReceivable: 600000,
			totalInterestReceivable:  1058400,
			totalPurchase:            600000,
			totalDoubtfulAllowance:   6000,
			totalGrossAdminFee:       6840,
			totalTaxDue:              840,
			totalMerchantPaid:        593160,
		},
		{
			name:                     "2069-01-12",
			dateStart:                "2069-01-12T00:00:00Z",
			dateEnd:                  "2069-01-13T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  352000,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       2280,
			totalTaxDue:              280,
			totalMerchantPaid:        197720,
		},
		{
			name:                     "2069-02-12_Rounded",
			dateStart:                "2069-02-12T00:00:00Z",
			dateEnd:                  "2069-02-13T00:00:00Z",
			totalPrincipalReceivable: 200000,
			totalInterestReceivable:  352000,
			totalPurchase:            200000,
			totalDoubtfulAllowance:   2000,
			totalGrossAdminFee:       2280,
			totalTaxDue:              280,
			totalMerchantPaid:        197720,
		},
		{
			name:                     "2069-01-13",
			dateStart:                "2069-01-13T00:00:00Z",
			dateEnd:                  "2069-01-14T00:00:00Z",
			totalPrincipalReceivable: 0,
			totalInterestReceivable:  0,
			totalPurchase:            0,
			totalDoubtfulAllowance:   0,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        0,
		},
		{
			name:                     "2069-02-13_Rounded",
			dateStart:                "2069-02-13T00:00:00Z",
			dateEnd:                  "2069-02-14T00:00:00Z",
			totalPrincipalReceivable: 0,
			totalInterestReceivable:  0,
			totalPurchase:            0,
			totalDoubtfulAllowance:   0,
			totalGrossAdminFee:       0,
			totalTaxDue:              0,
			totalMerchantPaid:        0,
		},
	}

	// This relies on previously created loans with their dates so must follow in same test file and function to keep order!
	for _, tc := range testDates {
		t.Run("TestCheckouts_Integration_EndOfDay_"+tc.name, func(t *testing.T) {
			endOfDayAggregatesTaskRes, err := endOfDayAggregatesTaskFn(&model.Task{
				WorkerId: "worker-id-001",
				TaskId:   endOfDayAggregatesTask.GetName(),
				TaskDefinition: &model.TaskDef{
					Name: "eod_aggregates",
				},
				TaskDefName:  "eod_aggregates",
				WorkflowType: "somename",
				WorkflowTask: &model.WorkflowTask{
					Name: "eod_aggregates",
				},
				InputData: map[string]interface{}{
					"date_range_start": tc.dateStart,
					"date_range_end":   tc.dateEnd,
				},
			})

			assert.Nil(t, err)
			assert.NotNil(t, endOfDayAggregatesTaskRes)
			endOfDayAggregatesOutputData := endOfDayAggregatesTaskRes.(*model.TaskResult).OutputData
			assert.NotNil(t, endOfDayAggregatesOutputData)
			assert.NotNil(t, endOfDayAggregatesOutputData["transaction_types"])
			endOfDayAggregatesResponse := endOfDayAggregatesOutputData["transaction_types"].([]interface{})
			assert.NotNil(t, endOfDayAggregatesResponse)
			actual := &[]gaDto.TransactionTypeLine{}
			err = mapstructure.Decode(endOfDayAggregatesResponse, actual)
			assert.Nil(t, err)

			if tc.totalPrincipalReceivable != 0 {
				assert.LessOrEqual(t, len(*actual), 4)
				assert.GreaterOrEqual(t, len(*actual), 3)
			}

			for _, a := range *actual {
				if a.Type == "PURCHASING_FROM_MERCHANT" {

					assert.Equal(t, 2, len(a.Changes))
					for _, ac := range a.Changes {
						switch ac.AccountName {
						case "MurabhaPurchase":
							assert.Equal(t, tc.totalPurchase, ac.BalanceChange)
						case "MerchantDue":
							assert.Equal(t, -tc.totalPurchase, ac.BalanceChange)
						}
					}
				} else if a.Type == "LOAN_ACTIVATION" {
					assert.Equal(t, 6, len(a.Changes))
					for _, ac := range a.Changes {
						switch ac.AccountName {
						case "Doubtful":
							assert.Equal(t, tc.totalDoubtfulAllowance, ac.BalanceChange)
						case "DoubtfulReceivable":
							assert.Equal(t, -tc.totalDoubtfulAllowance, ac.BalanceChange)
						case "MurabhaUnearnedRevenue":
							assert.Equal(t, -tc.totalInterestReceivable, ac.BalanceChange)
						case "MurabhaInterestReceivable":
							assert.Equal(t, tc.totalInterestReceivable, ac.BalanceChange)
						case "MurabhaPurchase":
							assert.Equal(t, -tc.totalPrincipalReceivable, ac.BalanceChange)
						case "MurabhaPrincipalReceivable":
							assert.Equal(t, tc.totalPrincipalReceivable, ac.BalanceChange)
						}
					}
				} else if a.Type == "ADMIN_FEE" {
					assert.Equal(t, 3, len(a.Changes))
					for _, ac := range a.Changes {
						switch ac.AccountName {
						case "MerchantDue":
							assert.Equal(t, tc.totalGrossAdminFee, ac.BalanceChange)
						case "AdminFeeReceivable":
							assert.Equal(t, -tc.totalGrossAdminFee+tc.totalTaxDue, ac.BalanceChange)
						case "TaxDue":
							assert.Equal(t, -tc.totalTaxDue, ac.BalanceChange)
						}
					}
				} else if a.Type == "INTEREST_EARNED" {
					// do nothing in this test case but don't fail if there are any of these values returned!
				} else {
					assert.Fail(t, "Unknown journal voucher type returned from end of day aggregates: %s", a.Type)
				}
			}

			if tc.totalPrincipalReceivable == 0 {
				// this means no activation expected on given day so
				// export should be devoid of activation records
				for _, a := range *actual {
					assert.NotEqual(t, "PURCHASING_FROM_MERCHANT", a.Type)
					assert.NotEqual(t, "LOAN_ACTIVATION", a.Type)
					assert.NotEqual(t, "ADMIN_FEE", a.Type)
				}
			}

			// generate merchant invoice for date and match with tc.totalMerchantPaid
			bookMerchantInvoicesTaskRes, err := bookMerchantInvoicesTaskFn(&model.Task{
				WorkerId:           "worker-id-001",
				WorkflowInstanceId: "workflow-instance-id-001",
				TaskId:             bookMerchantInvoicesTask.GetName(),
				TaskDefinition: &model.TaskDef{
					Name: "book_merchant_invoice",
				},
				TaskDefName: "book_merchant_invoice",
				WorkflowTask: &model.WorkflowTask{
					Name: "book_merchant_invoice",
				},
				InputData: map[string]interface{}{
					"date_range_start": tc.dateStart,
					"date_range_end":   tc.dateEnd,
				},
			})

			assert.Nil(t, err)
			assert.NotNil(t, bookMerchantInvoicesTaskRes)

			bookMerchantInvoicesOutputData := bookMerchantInvoicesTaskRes.(*model.TaskResult).OutputData
			assert.NotNil(t, bookMerchantInvoicesOutputData)
			bookInvoicesResponse := bookMerchantInvoicesOutputData["merchant_disbursements"].([]interface{})
			assert.NotNil(t, bookInvoicesResponse)
			disbursementsResult := &[]gaDto.BookInvoicesResponseItem{}
			err = mapstructure.Decode(bookInvoicesResponse, disbursementsResult)
			assert.Nil(t, err)

			if tc.totalPrincipalReceivable != 0 {
				assert.Equal(t, 1, len(*disbursementsResult))
				disbursement := (*disbursementsResult)[0]
				assert.Equal(t, tc.totalMerchantPaid, disbursement.Amount)
			} else {
				assert.Equal(t, 0, len(*disbursementsResult))
			}
		})
	}
}

func getUnits(moneyField interface{}) uint64 {
	money := moneyField.(map[string]interface{})
	units := uint64(money["units"].(float64))
	return units
}

func getPercentage(t *testing.T, fieldValue interface{}) uint64 {
	text := fieldValue.(string)
	basisPoints, err := stringconv.ParseStringToBasisPoints(text, 2)
	assert.Nil(t, err)
	return basisPoints
}
