package workers

import (
	"fmt"
	"testing"

	financialProductDto "github.com/btechlabs/lms-lite/modules/financialproduct/dto"
	gaDto "github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/pkg/money"
	libWorker "github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/btechlabs/lms-lite/workers/checkout"
	"github.com/btechlabs/lms-lite/workers/disbursement"
	"github.com/btechlabs/lms-lite/workers/onboarding"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/google/uuid"
	"github.com/mitchellh/mapstructure"
	"github.com/stretchr/testify/assert"
)

func (suite *WorkersIntegrationTestSuite) TestMerchantDisbursementWorkflow() {
	t := suite.T()
	assert.True(t, true)

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

	loanActivationTask := libWorker.NewDecoratorTaskWorker(checkout.NewActivateLoanTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	activateLoanTaskFn := loanActivationTask.GetTaskFunction()

	bookMerchantInvoicesTask := libWorker.NewDecoratorTaskWorker(disbursement.NewBookMerchantInvoicesTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	bookMerchantInvoicesTaskFn := bookMerchantInvoicesTask.GetTaskFunction()

	updateDisbursementStatusTask := libWorker.NewDecoratorTaskWorker(disbursement.NewUpdateDisbursementTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	updateDisbursementStatusTaskFn := updateDisbursementStatusTask.GetTaskFunction()

	type TestCaseLoan struct {
		productKey      string
		productVersion  string
		basketValue     uint64
		tenorVariantKey string
		bookingTime     string
		merchantId      string
		consumerId      string
	}
	type TestCaseInputs struct {
		loans                      []TestCaseLoan
		merchantDisbursementStart  string
		merchantDisbursementEnd    string
		merchantDisbursementPaidAt string
	}

	type TestCaseDisbursementItem struct {
		merchantId string
		amount     int64
	}
	type TestCaseOutputs struct {
		expectedDisbursements []TestCaseDisbursementItem
	}

	type TestCase struct {
		name    string
		inputs  TestCaseInputs
		outputs TestCaseOutputs
	}

	testCases := []TestCase{
		{
			name: "TestDisbursements_Integration_OneLoanOneMerchant_OneDisbursementLine",
			inputs: TestCaseInputs{
				loans: []TestCaseLoan{
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-01-01T09:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id",
					},
				},
				merchantDisbursementStart:  "2023-01-01T00:00:00Z",
				merchantDisbursementEnd:    "2023-01-02T00:00:00Z",
				merchantDisbursementPaidAt: "2023-01-03T00:00:00Z",
			},
			outputs: TestCaseOutputs{
				expectedDisbursements: []TestCaseDisbursementItem{
					{
						merchantId: "test_merchant_id",
						amount:     190880, // minus downpayment and minus gross admin fee
					},
				},
			},
		},
		{
			name: "TestDisbursements_Integration_LoanActivatedBeforeRange_NoDisbursement",
			inputs: TestCaseInputs{
				loans: []TestCaseLoan{
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-01-02T09:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id",
					},
				},
				merchantDisbursementStart: "2023-01-03T00:00:00Z",
				merchantDisbursementEnd:   "2023-01-04T00:00:00Z",
			},
			outputs: TestCaseOutputs{
				expectedDisbursements: []TestCaseDisbursementItem{
					{
						merchantId: "test_merchant_id",
						amount:     0, // loan activated before date range
					},
				},
			},
		},
		{
			name: "TestDisbursements_Integration_LoanActivatedAfterRange_NoDisbursement",
			inputs: TestCaseInputs{
				loans: []TestCaseLoan{
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-01-05T09:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id",
					},
				},
				merchantDisbursementStart: "2023-01-03T00:00:00Z",
				merchantDisbursementEnd:   "2023-01-04T00:00:00Z",
			},
			outputs: TestCaseOutputs{
				expectedDisbursements: []TestCaseDisbursementItem{
					{
						merchantId: "test_merchant_id",
						amount:     0, // loan activated before date range
					},
				},
			},
		},
		{
			name: "TestDisbursements_Integration_TwoLoansOneMerchant_OneDisbursementLine_SumCorrect",
			inputs: TestCaseInputs{
				loans: []TestCaseLoan{
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-02-01T09:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id",
					},
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-02-01T11:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id_2",
					},
				},
				merchantDisbursementStart:  "2023-02-01T00:00:00Z",
				merchantDisbursementEnd:    "2023-02-02T00:00:00Z",
				merchantDisbursementPaidAt: "2023-02-03T00:00:00Z",
			},
			outputs: TestCaseOutputs{
				expectedDisbursements: []TestCaseDisbursementItem{
					{
						merchantId: "test_merchant_id",
						amount:     2 * 190880, // minus downpayment and minus gross admin fee
					},
				},
			},
		},
		{
			name: "TestDisbursements_Integration_TwoLoansTwoMerchants_TwoDisbursementLines",
			inputs: TestCaseInputs{
				loans: []TestCaseLoan{
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-03-01T09:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id",
					},
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-03-01T11:48:08Z",
						merchantId:      "test_merchant_id_2",
						consumerId:      "test_consumer_id_2",
					},
				},
				merchantDisbursementStart:  "2023-03-01T00:00:00Z",
				merchantDisbursementEnd:    "2023-03-02T00:00:00Z",
				merchantDisbursementPaidAt: "2023-03-03T00:00:00Z",
			},
			outputs: TestCaseOutputs{
				expectedDisbursements: []TestCaseDisbursementItem{
					{
						merchantId: "test_merchant_id",
						amount:     190880, // minus downpayment and minus gross admin fee
					},
					{
						merchantId: "test_merchant_id_2",
						amount:     190880, // minus downpayment and minus gross admin fee
					},
				},
			},
		},
		{
			name: "TestDisbursements_Integration_TwoLoansOverTwoDaysOneMerchant_OneDisbursementLine_SumCorrect",
			inputs: TestCaseInputs{
				loans: []TestCaseLoan{
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-04-01T09:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id",
					},
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-04-02T11:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id_2",
					},
				},
				merchantDisbursementStart:  "2023-04-01T00:00:00Z",
				merchantDisbursementEnd:    "2023-04-03T00:00:00Z",
				merchantDisbursementPaidAt: "2023-04-04T00:00:00Z",
			},
			outputs: TestCaseOutputs{
				expectedDisbursements: []TestCaseDisbursementItem{
					{
						merchantId: "test_merchant_id",
						amount:     2 * 190880, // minus downpayment and minus gross admin fee
					},
				},
			},
		},
		{
			name: "TestDisbursements_Integration_TwoLoansOverTwoDaysTwoMerchants_TwoDisbursementLines",
			inputs: TestCaseInputs{
				loans: []TestCaseLoan{
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-05-01T09:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id",
					},
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-05-02T11:48:08Z",
						merchantId:      "test_merchant_id_2",
						consumerId:      "test_consumer_id_2",
					},
				},
				merchantDisbursementStart:  "2023-05-01T00:00:00Z",
				merchantDisbursementEnd:    "2023-05-03T00:00:00Z",
				merchantDisbursementPaidAt: "2023-05-04T00:00:00Z",
			},
			outputs: TestCaseOutputs{
				expectedDisbursements: []TestCaseDisbursementItem{
					{
						merchantId: "test_merchant_id",
						amount:     190880, // minus downpayment and minus gross admin fee
					},
					{
						merchantId: "test_merchant_id_2",
						amount:     190880, // minus downpayment and minus gross admin fee
					},
				},
			},
		},
		{
			name: "TestDisbursements_Integration_ThreeLoansOverThreeDays_TwoDaysOnly_TwoMerchants_TwoDisbursementLines",
			inputs: TestCaseInputs{
				loans: []TestCaseLoan{
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-06-01T09:48:08Z",
						merchantId:      "test_merchant_id",
						consumerId:      "test_consumer_id",
					},
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-06-02T11:48:08Z",
						merchantId:      "test_merchant_id_2",
						consumerId:      "test_consumer_id_2",
					},
					{
						productKey:      "test-financial-product",
						productVersion:  "1",
						basketValue:     250000,
						tenorVariantKey: "48_Months",
						bookingTime:     "2023-06-03T10:48:08Z",
						merchantId:      "test_merchant_id_3",
						consumerId:      "test_consumer_id_3",
					},
				},
				merchantDisbursementStart:  "2023-06-02T00:00:00Z",
				merchantDisbursementEnd:    "2023-06-04T00:00:00Z",
				merchantDisbursementPaidAt: "2023-06-06T00:00:00Z",
			},
			outputs: TestCaseOutputs{
				expectedDisbursements: []TestCaseDisbursementItem{
					{
						merchantId: "test_merchant_id_2",
						amount:     190880, // minus downpayment and minus gross admin fee
					},
					{
						merchantId: "test_merchant_id_3",
						amount:     190880, // minus downpayment and minus gross admin fee
					},
				},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {

			for _, tcl := range tc.inputs.loans {
				openConsumerAccountTaskRes, err := openConsumerAccountTaskFn(&model.Task{
					WorkflowInstanceId: "workflow-001",
					WorkflowType:       openConsumerAccountTask.GetName(),
					TaskDefinition: &model.TaskDef{
						Name: openConsumerAccountTask.GetName(),
					},
					WorkerId: "worker-001",
					TaskId:   openConsumerAccountTask.GetName(),
					InputData: map[string]interface{}{
						"consumer_id": tcl.consumerId,
					},
				})

				if err == nil || err.Error() != fmt.Errorf("Account %s already exists", tcl.consumerId).Error() { // optional check
					assert.Nil(t, err)
					assert.NotNil(t, openConsumerAccountTaskRes)

					updateConsumerAccountStatusTaskRes, err := updateConsumerAccountStatusFn(&model.Task{
						WorkflowInstanceId: "workflow-001",
						WorkflowType:       updateConsumerAccountStatusTask.GetName(),
						TaskDefinition: &model.TaskDef{
							Name: updateConsumerAccountStatusTask.GetName(),
						},
						WorkerId: "worker-001",
						TaskId:   updateConsumerAccountStatusTask.GetName(),
						InputData: map[string]interface{}{
							"consumer_id": tcl.consumerId,
							"status":      "ACTIVE",
						},
					})

					assert.Nil(t, err)
					assert.NotNil(t, updateConsumerAccountStatusTaskRes)
				}

				openMerchantAccountTaskRes, err := openMerchantAccountTaskFn(&model.Task{
					WorkflowInstanceId: "workflow-001",
					WorkflowType:       openMerchantAccountTask.GetName(),
					TaskDefinition: &model.TaskDef{
						Name: openMerchantAccountTask.GetName(),
					},
					WorkerId: "worker-001",
					TaskId:   openMerchantAccountTask.GetName(),
					InputData: map[string]interface{}{
						"merchant_id": tcl.merchantId,
					},
				})

				if err == nil || err.Error() != fmt.Errorf("Account %s already exists", tcl.merchantId).Error() { // optional check
					assert.Nil(t, err)
					assert.NotNil(t, openMerchantAccountTaskRes)

					updateMerchantAccountStatusTaskRes, err := updateMerchantAccountStatusFn(&model.Task{
						WorkflowInstanceId: "workflow-001",
						WorkflowType:       updateMerchantAccountStatusTask.GetName(),
						TaskDefinition: &model.TaskDef{
							Name: updateMerchantAccountStatusTask.GetName(),
						},
						WorkerId: "worker-001",
						TaskId:   updateMerchantAccountStatusTask.GetName(),
						InputData: map[string]interface{}{
							"merchant_id": tcl.merchantId,
							"status":      "ACTIVE",
						},
					})

					assert.Nil(t, err)
					assert.NotNil(t, updateMerchantAccountStatusTaskRes)
				}

				getCommercialOfferTaskRes, err := getCommercialOfferTaskFn(&model.Task{
					WorkflowInstanceId: "workflow-001",
					WorkflowType:       getCommercialOfferTask.GetName(),
					TaskDefinition: &model.TaskDef{
						Name: getCommercialOfferTask.GetName(),
					},
					WorkerId: "worker-001",
					TaskId:   getCommercialOfferTask.GetName(),
					InputData: map[string]interface{}{
						"selected_financial_products": []financialProductDto.SelectFinancialProductResponseItems{
							{
								ProductKey:     tcl.productKey,
								ProductVersion: tcl.productVersion,
							},
						},
						"consumer_id": tcl.consumerId,
						"credit_limit": &money.SerializableMoney{
							Units:        100000000,
							CurrencyCode: "EGP",
						},
						"basket_id": uuid.New().String(),
						"principal_amount": &money.SerializableMoney{
							Units:        tcl.basketValue,
							CurrencyCode: "EGP",
						},
					},
				})

				assert.Nil(t, err)
				assert.NotNil(t, getCommercialOfferTaskRes)

				commercialOfferOutputData := getCommercialOfferTaskRes.(*model.TaskResult).OutputData
				assert.NotNil(t, commercialOfferOutputData)
				offerDetailsOutputData := commercialOfferOutputData["offer_details"].([]interface{})
				assert.NotNil(t, offerDetailsOutputData)
				var selectedOffer map[string]interface{}
				for _, o := range offerDetailsOutputData {
					om := o.(map[string]interface{})
					if om["tenure"] == tcl.tenorVariantKey {
						selectedOffer = om
						break
					}
				}
				assert.NotNil(t, selectedOffer, "Could not find expected tenor variant %s in commercial offers", tcl.tenorVariantKey)

				activateLoanTaskRes, err := activateLoanTaskFn(&model.Task{
					WorkflowInstanceId: "workflow-001",
					WorkflowType:       loanActivationTask.GetName(),
					TaskDefinition: &model.TaskDef{
						Name: loanActivationTask.GetName(),
					},
					WorkerId: "worker-001",
					TaskId:   loanActivationTask.GetName(),
					InputData: map[string]interface{}{
						"merchant_id":       tcl.merchantId,
						"selected_offer_id": selectedOffer["id"],
						"consumer_id":       tcl.consumerId,
						"booking_time":      tcl.bookingTime,
					},
				})

				assert.Nil(t, err)
				assert.NotNil(t, activateLoanTaskRes)
			}

			bookMerchantInvoicesTaskRes, err := bookMerchantInvoicesTaskFn(&model.Task{
				WorkflowInstanceId: "workflow-001",
				WorkflowType:       bookMerchantInvoicesTask.GetName(),
				TaskDefinition: &model.TaskDef{
					Name: bookMerchantInvoicesTask.GetName(),
				},
				WorkerId: "worker-001",
				TaskId:   bookMerchantInvoicesTask.GetName(),
				InputData: map[string]interface{}{
					"date_range_start": tc.inputs.merchantDisbursementStart,
					"date_range_end":   tc.inputs.merchantDisbursementEnd,
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
			for _, e := range tc.outputs.expectedDisbursements {
				if e.amount == 0 {
					foundDisb := int64(0)
					for _, d := range *disbursementsResult {
						if d.MerchantGlobalId == e.merchantId {
							foundDisb = d.Amount
							break
						}
					}
					assert.Equal(t, int64(0), foundDisb, "Account %s expected to have no disbursements but found %d amount", e.merchantId, foundDisb)
					continue
				}

				for _, d := range *disbursementsResult {
					if e.merchantId == d.MerchantGlobalId {
						assert.Equal(t, e.amount, d.Amount, "Account %s actual disbursement %d does not equal expected disbursement %d", e.merchantId, d.Amount, e.amount)
						break
					}
				}
			}

			if tc.inputs.merchantDisbursementPaidAt != "" {
				for _, d := range *disbursementsResult {
					updateDisbursementStatusTaskRes, err := updateDisbursementStatusTaskFn(&model.Task{
						WorkflowInstanceId: "workflow-001",
						WorkflowType:       updateDisbursementStatusTask.GetName(),
						TaskDefinition: &model.TaskDef{
							Name: updateDisbursementStatusTask.GetName(),
						},
						WorkerId: "worker-001",
						TaskId:   updateDisbursementStatusTask.GetName(),
						InputData: map[string]interface{}{
							"merchant_payment_id": fmt.Sprintf("INV-%010d", d.Id),
							"status":              "PAID",
							"status_timestamp":    tc.inputs.merchantDisbursementPaidAt,
						},
					})

					assert.Nil(t, err)
					assert.NotNil(t, updateDisbursementStatusTaskRes)
				}
			}
		})
	}
}
