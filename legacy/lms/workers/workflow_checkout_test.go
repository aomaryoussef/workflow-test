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
	"github.com/btechlabs/lms-lite/pkg/money"
	libWorker "github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/btechlabs/lms-lite/workers/checkout"
	"github.com/btechlabs/lms-lite/workers/onboarding"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func (suite *WorkersIntegrationTestSuite) TestCheckoutWorkflow() {
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

	getAllLoansForConsumerRestCall := rest.GetAllLoansForConsumer(suite.coreApp)
	getAllLoansForMerchantRestCall := rest.GetAllLoansForMerchant(suite.coreApp)
	getTransactionDetailsRestCall := rest.GetTransactionDetails(suite.coreApp)

	// TODO: test cases:
	// 1. one loan, enough monthly pays, loan issued
	// 2. one loan, not enough monthly payment, no loan given
	// 3. one loan, not enough available tenure, no loan given
	// 4. one loan, downpayment too much, no loan given
	// 5. one loan, too low basket value, no loan given
	// 6. one loan, too high basket value, no loan given
	// 7. one loan, merchant inactive, no loan given
	// 8. one loan, consumer inactive, no loan given
	// 9. one loan, merchant never onboarded, no loan given
	// 10. one loan, consumer never onboarded, no loan given
	// 11. multiple loans, ...
	// extra:
	// one loan, available tenor eliminates 1-2 offers
	// one loan, available monthly payment eliminates 1-2 offers
	type TestCaseLoan struct {
		productKey              string
		productVersion          string
		basketValue             uint64
		tenorVariantKey         string
		bookingTime             string
		merchantId              string
		merchantIdToOnboard     string
		merchantIdToDeactivate  string
		consumerId              string
		consumerIdToOnboard     string
		consumerIdToDeactivate  string
		monthlyAvailablePayment uint64
		maximumAvailableTenor   uint
	}
	type TestCaseInputs struct {
		loans []TestCaseLoan
	}

	type TestCaseCommercialOffer struct {
		tenorKey          string
		adminFee          uint64
		financedAmount    uint64
		totalAmount       uint64
		downpayment       uint64
		monthlyInstalment uint64
	}
	type TestCaseOutputs struct {
		expectedError             error
		expectedCommercialOffers  []TestCaseCommercialOffer
		expectedNumberOfSchedules int
	}

	type TestCase struct {
		name    string
		inputs  TestCaseInputs
		outputs TestCaseOutputs
	}

	testCases := []TestCase{
		{
			name: "TestCheckouts_Integration_OneLoan_SuccessfulActivation",
			inputs: TestCaseInputs{
				loans: []TestCaseLoan{
					{
						productKey:              "test-financial-product",
						productVersion:          "1",
						basketValue:             250000,
						tenorVariantKey:         "48_Months",
						bookingTime:             "2029-01-01T09:48:08Z",
						merchantId:              "test_merchant_id_for_checkout",
						merchantIdToOnboard:     "test_merchant_id_for_checkout",
						consumerId:              "test_consumer_id_for_checkout",
						consumerIdToOnboard:     "test_consumer_id_for_checkout",
						monthlyAvailablePayment: 1700000,
						maximumAvailableTenor:   5000,
					},
				},
			},
			outputs: TestCaseOutputs{
				expectedError: nil,
				expectedCommercialOffers: []TestCaseCommercialOffer{
					{
						tenorKey:          "12_Months",
						adminFee:          3429,
						financedAmount:    205000,
						totalAmount:       343629,
						downpayment:       45000,
						monthlyInstalment: 24600,
					},
					{
						tenorKey:          "24_Months",
						adminFee:          2850,
						financedAmount:    250000,
						totalAmount:       694050,
						downpayment:       0,
						monthlyInstalment: 28800,
					},
					{
						tenorKey:          "36_Months",
						adminFee:          7125,
						financedAmount:    250000,
						totalAmount:       698325,
						downpayment:       0,
						monthlyInstalment: 19200,
					},
					{
						tenorKey:          "48_Months",
						adminFee:          9120,
						financedAmount:    200000,
						totalAmount:       611120,
						downpayment:       50000,
						monthlyInstalment: 11500,
					},
				},
				expectedNumberOfSchedules: 48,
			},
		},
		// {
		// 	name: "TestCheckouts_Integration_OneLoan_LowMaximumAvailableTenor_NoLoanGiven",
		// 	inputs: TestCaseInputs{
		// 		loans: []TestCaseLoan{
		// 			{
		// 				productKey:              "test-financial-product",
		// 				productVersion:          "1",
		// 				basketValue:             250000,
		// 				tenorVariantKey:         "48_Months",
		// 				bookingTime:             "2029-01-01T09:48:08",
		// 				merchantId:              "test_merchant_id_for_checkout",
		// 				merchantIdToOnboard:     "test_merchant_id_for_checkout",
		// 				consumerId:              "test_consumer_id_for_checkout",
		// 				consumerIdToOnboard:     "test_consumer_id_for_checkout",
		// 				monthlyAvailablePayment: 1700000,
		// 				maximumAvailableTenor:   11,
		// 			},
		// 		},
		// 	},
		// 	outputs: TestCaseOutputs{
		// 		expectedError: fmt.Errorf("No offers generated for basket, see logs for reasons"),
		// 	},
		// },
		// {
		// 	name: "TestCheckouts_Integration_OneLoan_TooLowBasketValue_NoLoanGiven",
		// 	inputs: TestCaseInputs{
		// 		loans: []TestCaseLoan{
		// 			{
		// 				productKey:              "test-financial-product",
		// 				productVersion:          "1",
		// 				basketValue:             250,
		// 				tenorVariantKey:         "48_Months",
		// 				bookingTime:             "2029-01-01 09:48:08.000520",
		// 				merchantId:              "test_merchant_id_for_checkout",
		// 				merchantIdToOnboard:     "test_merchant_id_for_checkout",
		// 				consumerId:              "test_consumer_id_for_checkout",
		// 				consumerIdToOnboard:     "test_consumer_id_for_checkout",
		// 				monthlyAvailablePayment: 1700000,
		// 				maximumAvailableTenor:   5000,
		// 			},
		// 		},
		// 	},
		// 	outputs: TestCaseOutputs{
		// 		expectedError: nil,
		// 	},
		// },
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			for _, tcl := range tc.inputs.loans {
				if tcl.consumerIdToOnboard != "" {
					openConsumerAccountTaskRes, err := openConsumerAccountTaskFn(&model.Task{
						WorkflowType: "open_consumer_account",
						TaskId:       openConsumerAccountTask.GetName(),
						TaskDefinition: &model.TaskDef{
							Name: "open_consumer_account",
						},
						WorkerId:           "worker-id-001",
						WorkflowInstanceId: "test_workflow_instance_id",
						TaskDefName:        "open_consumer_account",
						WorkflowTask: &model.WorkflowTask{
							Name: "open_consumer_account",
						},
						InputData: map[string]interface{}{
							"consumer_id": tcl.consumerIdToOnboard,
						},
					})

					if err == nil || err.Error() != fmt.Errorf("Account %s already exists", tcl.consumerIdToOnboard).Error() { // optional check
						assert.Nil(t, err)
						assert.NotNil(t, openConsumerAccountTaskRes)

						updateConsumerAccountStatusTaskRes, err := updateConsumerAccountStatusFn(&model.Task{
							WorkflowInstanceId: "workflow-001",
							WorkflowType:       "update_account_status",
							TaskId:             updateConsumerAccountStatusTask.GetName(),
							TaskDefinition: &model.TaskDef{
								Name: "update_account_status",
							},
							WorkerId:    "worker-001",
							TaskDefName: "update_account_status",
							WorkflowTask: &model.WorkflowTask{
								Name: "update_account_status",
							},
							InputData: map[string]interface{}{
								"consumer_id": tcl.consumerIdToOnboard,
								"status":      "ACTIVE",
							},
						})

						assert.Nil(t, err)
						assert.NotNil(t, updateConsumerAccountStatusTaskRes)
					}
				}

				if tcl.consumerIdToDeactivate != "" {
					updateConsumerAccountStatusTaskRes, err := updateConsumerAccountStatusFn(&model.Task{
						WorkflowInstanceId: "workflow-001",
						WorkflowType:       "update_account_status",
						TaskDefinition: &model.TaskDef{
							Name: "update_account_status",
						},
						WorkflowTask: &model.WorkflowTask{
							Name: "update_account_status",
						},
						TaskId:      updateConsumerAccountStatusTask.GetName(),
						WorkerId:    "worker-001",
						TaskDefName: "update_account_status",
						InputData: map[string]interface{}{
							"consumer_id": tcl.consumerIdToDeactivate,
							"status":      "INACTIVE",
						},
					})

					assert.Nil(t, err)
					assert.NotNil(t, updateConsumerAccountStatusTaskRes)
				}

				if tcl.merchantIdToOnboard != "" {
					openMerchantAccountTaskRes, err := openMerchantAccountTaskFn(&model.Task{
						WorkflowInstanceId: "workflow-001",
						WorkflowType:       "open_merchant_account",
						TaskDefinition: &model.TaskDef{
							Name: "open_merchant_account",
						},
						WorkerId:    "worker-001",
						TaskId:      openMerchantAccountTask.GetName(),
						TaskDefName: "open_merchant_account",
						WorkflowTask: &model.WorkflowTask{
							Name: "open_merchant_account",
						},
						InputData: map[string]interface{}{
							"merchant_id": tcl.merchantIdToOnboard,
						},
					})

					if err == nil || err.Error() != fmt.Errorf("Account %s already exists", tcl.merchantIdToOnboard).Error() { // optional check
						assert.Nil(t, err)
						assert.NotNil(t, openMerchantAccountTaskRes)

						updateMerchantAccountStatusTaskRes, err := updateMerchantAccountStatusFn(&model.Task{
							WorkflowInstanceId: "workflow-001",
							WorkflowType:       "update_account_status",
							TaskDefinition: &model.TaskDef{
								Name: "update_account_status",
							},
							WorkerId:    "worker-001",
							TaskId:      updateMerchantAccountStatusTask.GetName(),
							TaskDefName: "update_account_status",
							WorkflowTask: &model.WorkflowTask{
								Name: "update_account_status",
							},
							InputData: map[string]interface{}{
								"merchant_id": tcl.merchantIdToOnboard,
								"status":      "ACTIVE",
							},
						})

						assert.Nil(t, err)
						assert.NotNil(t, updateMerchantAccountStatusTaskRes)
					}
				}

				if tcl.merchantIdToDeactivate != "" {
					updateMerchantAccountStatusTaskRes, err := updateMerchantAccountStatusFn(&model.Task{
						WorkflowInstanceId: "workflow-001",
						WorkflowType:       "update_account_status",
						TaskDefinition: &model.TaskDef{
							Name: "update_account_status",
						},
						WorkerId:    "worker-001",
						TaskId:      updateMerchantAccountStatusTask.GetName(),
						TaskDefName: "update_account_status",
						WorkflowTask: &model.WorkflowTask{
							Name: "update_account_status",
						},
						InputData: map[string]interface{}{
							"merchant_id": tcl.merchantIdToDeactivate,
							"status":      "INACTIVE",
						},
					})

					assert.Nil(t, err)
					assert.NotNil(t, updateMerchantAccountStatusTaskRes)
				}

				getCommercialOfferTaskRes, err := getCommercialOfferTaskFn(&model.Task{
					WorkflowInstanceId: "workflow-001",
					WorkflowType:       "get_commercial_offers",
					TaskDefinition: &model.TaskDef{
						Name: "get_commercial_offers",
					},
					WorkerId:    "worker-001",
					TaskId:      getCommercialOfferTask.GetName(),
					TaskDefName: "get_commercial_offers",
					WorkflowTask: &model.WorkflowTask{
						Name: "get_commercial_offers",
					},
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

				if tc.outputs.expectedError != nil {
					assert.Equal(t, tc.outputs.expectedError, err)
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
						if om["tenure"] == tcl.tenorVariantKey {
							selectedOffer = &om
						}
						var expectedOffer *TestCaseCommercialOffer
						for _, expected := range tc.outputs.expectedCommercialOffers {
							if expected.tenorKey == om["tenure"] {
								expectedOffer = &expected
								break
							}
						}
						assert.NotNil(t, expectedOffer, "Tenor %s was not expected to be returned", om["tenure"])
						if expectedOffer != nil {
							// decode serializable money values and assert
							assert.Equal(t, expectedOffer.adminFee, GetUnits(om["admin_fee"]),
								"Expected %d admin fee, but got %d", expectedOffer.adminFee, GetUnits(om["admin_fee"]))
							assert.Equal(t, expectedOffer.downpayment, GetUnits(om["down_payment"]),
								"Expected %d downpayment, but got %d", expectedOffer.downpayment, GetUnits(om["down_payment"]))
							assert.Equal(t, expectedOffer.financedAmount, GetUnits(om["financed_amount"]),
								"Expected %d financed amount, but got %d", expectedOffer.financedAmount, GetUnits(om["financed_amount"]))
							assert.Equal(t, expectedOffer.monthlyInstalment, GetUnits(om["monthly_instalment"]),
								"Expected %d monthly instalment, but got %d", expectedOffer.monthlyInstalment, GetUnits(om["monthly_instalment"]))
							assert.Equal(t, expectedOffer.totalAmount, GetUnits(om["total_amount"]),
								"Expected %d total amount, but got %d", expectedOffer.totalAmount, GetUnits(om["total_amount"]))
						}
					}
					assert.NotNil(t, selectedOffer, "Could not find expected tenor variant %s in commercial offers", tcl.tenorVariantKey)

					offer := *selectedOffer
					activateLoanTaskRes, err := activateLoanTaskFn(&model.Task{
						WorkflowType: "activate_loan",
						TaskDefinition: &model.TaskDef{
							Name: "activate_loan",
						},
						WorkerId:           "worker-001",
						TaskId:             loanActivationTask.GetName(),
						WorkflowInstanceId: loanActivationTask.GetName(),
						InputData: map[string]interface{}{
							"merchant_id":       tcl.merchantId,
							"selected_offer_id": offer["id"],
							"consumer_id":       tcl.consumerId,
							"booking_time":      tcl.bookingTime,
						},
					})

					assert.Nil(t, err)
					assert.NotNil(t, activateLoanTaskRes)

					activateLoanTaskOutputData := activateLoanTaskRes.(*model.TaskResult).OutputData
					activatedLoanDetails := activateLoanTaskOutputData["activated_loan"].(map[string]interface{})
					loanId := activatedLoanDetails["loan_id"].(string)
					assert.NotNil(t, loanId)

					resp := httptest.NewRecorder()
					req, err := http.NewRequest("GET",
						"/api/loans/consumer/{consumer_id}",
						nil)
					assert.Nil(t, err)
					rctx := chi.NewRouteContext()
					rctx.URLParams.Add("consumer_id", tcl.consumerId)
					req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))

					getAllLoansForConsumerRestCall(resp, req)

					assert.Equal(t, http.StatusOK, resp.Code, "Request to get all loans for consumer failed with code %d", resp.Code)

					var lmsResponse *domain.LmsResponse
					err = json.Unmarshal(resp.Body.Bytes(), &lmsResponse)
					assert.Nil(t, err, "Failed to unmarshal response from get all loans for consumer REST call")
					assert.True(t, lmsResponse.Success)
					assert.NotNil(t, lmsResponse.Data)
					loanList := lmsResponse.Data.(map[string]interface{})["loans"].([]interface{})
					assert.Equal(t, 1, len(loanList))
					firstLoanId := loanList[0].(map[string]interface{})["loan_id"]
					assert.Equal(t, loanId, firstLoanId)
					// iterate on schedule, add back up values and check equality to commercial offer
					paymentScheduleLines := loanList[0].(map[string]interface{})["payment_schedule"].([]interface{})
					assert.Equal(t, tc.outputs.expectedNumberOfSchedules, len(paymentScheduleLines))

					sototal := (*selectedOffer)["total_amount"].(map[string]interface{})["units"].(float64)
					soadmin := (*selectedOffer)["admin_fee"].(map[string]interface{})["units"].(float64)
					sodownp := (*selectedOffer)["down_payment"].(map[string]interface{})["units"].(float64)

					sum := float64(0)
					for _, l := range paymentScheduleLines {
						lmap := l.(map[string]interface{})
						sum += lmap["principal_due"].(map[string]interface{})["amount"].(float64)
						sum += lmap["interest_due"].(map[string]interface{})["amount"].(float64)
					}

					assert.Equal(t, sototal-soadmin-sodownp, sum)

					coid := (*selectedOffer)["id"]
					assert.Equal(t, coid, loanList[0].(map[string]interface{})["commercial_offer_id"])

					ladmin := loanList[0].(map[string]interface{})["admin_fee"].(map[string]interface{})["amount"]
					assert.Equal(t, soadmin, ladmin)

					resp = httptest.NewRecorder()
					req, err = http.NewRequest("GET",
						"/api/loans/merchant/{merchant_id}",
						nil)
					assert.Nil(t, err)
					rctx = chi.NewRouteContext()
					rctx.URLParams.Add("merchant_id", tcl.merchantId)
					req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))

					getAllLoansForMerchantRestCall(resp, req)

					assert.Equal(t, http.StatusOK, resp.Code, "Request to get all loans for merchant failed with code %d", resp.Code)

					// responseBody := string(resp.Body.Bytes())
					// fmt.Println(responseBody)
					err = json.Unmarshal(resp.Body.Bytes(), &lmsResponse)
					assert.Nil(t, err, "Failed to unmarshal response from get all loans for merchant REST call")
					assert.True(t, lmsResponse.Success)
					assert.NotNil(t, lmsResponse.Data)
					loanList = lmsResponse.Data.(map[string]interface{})["loans"].([]interface{})
					assert.Equal(t, 1, len(loanList))
					firstLoanId = loanList[0].(map[string]interface{})["loan_id"]
					assert.Equal(t, loanId, firstLoanId)

					assert.Equal(t, coid, loanList[0].(map[string]interface{})["commercial_offer_id"])
					ladmin = loanList[0].(map[string]interface{})["admin_fee"].(map[string]interface{})["amount"]
					assert.Equal(t, soadmin, ladmin)

					transactionId := loanList[0].(map[string]interface{})["transaction_id"].(string)
					assert.NotNil(t, transactionId)

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
			}
		})
	}
}

func GetUnits(moneyField interface{}) uint64 {
	money := moneyField.(map[string]interface{})
	units := uint64(money["units"].(float64))
	return units
}
