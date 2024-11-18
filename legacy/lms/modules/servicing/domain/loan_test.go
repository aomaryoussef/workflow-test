package domain

import (
	"context"
	"errors"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestLoan_CurrentStatus(t *testing.T) {
	
	now := time.Now()
	timeOneMonthLater := now.Add(43200 * time.Minute)
	timeTwoMonthLater := timeOneMonthLater.Add(43200 * time.Minute)
	
	loan := &Loan{
		statuses: make([]LoanStatus, 0),
	}
	
	// Ordered it reverse consciously
	loan.statuses = append(loan.statuses, LoanStatus{statusType: LoanStatusActive, createdAtUTC: timeOneMonthLater})
	loan.statuses = append(loan.statuses, LoanStatus{statusType: LoanStatusClosed, createdAtUTC: timeTwoMonthLater})
	loan.statuses = append(loan.statuses, LoanStatus{statusType: LoanStatusActive, createdAtUTC: now})
	
	currentStatus := loan.CurrentStatus()
	assert.Equal(t, LoanStatusClosed, currentStatus.StatusType())
	assert.Equal(t, timeTwoMonthLater, currentStatus.createdAtUTC)
}

/**
This test case tests the core logic of updating the payment schedule of a loan.
It DOES NOT test:
1. Journal Entries
2. Database Storage

The cases it covers are the following:
1. book payment for invalid schedule id -> expect error
2. book payment for a schedule already paid -> expect error
3. book payment for schedule with less money than total due -> expect error
4. book payment for schedule with more money than total due -> expect error
5. book payment for schedule randomly in the future (reason is tech async and not business) -> expect no error
6. happy path -> expect lots of money ;)
*/
func TestLoan_BookPaymentForSchedule(t *testing.T) {
	err := logging.InitLogger("debug", "lms-lite", "development-testing")
	if err != nil {
		t.Errorf("failed to init logger")
	}
	
	type TestCaseData struct {
		loan        *Loan
		ctx         context.Context
		bookingTime time.Time
	}
	
	type TestCaseInputs struct {
		scheduleId         uint64
		paymentReferenceId string
		totalPaidAmount    money.Money
		paidDate           time.Time
	}
	
	type TestCaseOutputs struct {
		err                     error
		updatedScheduleLineItem *LoanPaymentScheduleLineItem
	}
	
	type TestCase struct {
		name    string
		inputs  TestCaseInputs
		data    TestCaseData
		outputs TestCaseOutputs
	}
	loanActivationDate := time.Date(2024, 1, 21, 9, 34, 43, 345, time.UTC)
	firstInstalmentPaidDate := loanActivationDate.Add(15 * 24 * time.Hour) // first instalment paid in 15 days
	paymentReferenceId := "test-payment-ref-id-1"
	bookingTime := time.Now()
	baseTestCaseData := TestCaseData{
		loan: &Loan{
			id: "test-loan-id",
			paymentSchedule: LoanPaymentSchedule{
				lineItems: []LoanPaymentScheduleLineItem{
					{
						id:                   1,
						loanId:               "test-loan-id",
						instalmentDueDateUTC: loanActivationDate.Add(30 * 24 * time.Hour),
						lateFeeDue:           *money.NewMoney(0),
						interestDue:          *money.NewMoney(11301),
						principalDue:         *money.NewMoney(65699),
						loanBalance:          *money.NewMoney(208000),
					},
					{
						id:                   2,
						loanId:               "test-loan-id",
						instalmentDueDateUTC: loanActivationDate.Add(60 * 24 * time.Hour),
						lateFeeDue:           *money.NewMoney(0),
						interestDue:          *money.NewMoney(7731),
						principalDue:         *money.NewMoney(69269),
						loanBalance:          *money.NewMoney(142301),
					},
					{
						id:                   3,
						loanId:               "test-loan-id",
						instalmentDueDateUTC: loanActivationDate.Add(90 * 24 * time.Hour),
						lateFeeDue:           *money.NewMoney(0),
						interestDue:          *money.NewMoney(3968),
						principalDue:         *money.NewMoney(73032),
						loanBalance:          *money.NewMoney(73032),
					},
				},
			},
		},
		bookingTime: bookingTime,
		ctx:         context.WithValue(context.Background(), logging.CorrelationIdContextKey, "wf-001"),
	}
	
	testCases := []TestCase{
		{
			name: "book payment for invalid schedule id",
			inputs: TestCaseInputs{
				scheduleId:         10,
				paymentReferenceId: "test-payment-ref-id-1",
				totalPaidAmount:    *money.NewMoney(77000),
				paidDate:           firstInstalmentPaidDate,
			},
			data: baseTestCaseData,
			outputs: TestCaseOutputs{
				err: errors.New("invalid payment schedule id\nno payment schedule: 10 found for loan: test-loan-id"),
			},
		},
		{
			name: "book payment for a schedule already paid",
			inputs: TestCaseInputs{
				scheduleId:         1,
				paymentReferenceId: "test-payment-ref-id-1",
				totalPaidAmount:    *money.NewMoney(77000),
				paidDate:           firstInstalmentPaidDate,
			},
			data: TestCaseData{
				loan: &Loan{
					id: "test-loan-id",
					paymentSchedule: LoanPaymentSchedule{
						lineItems: []LoanPaymentScheduleLineItem{
							{
								id:                   1,
								loanId:               "test-loan-id",
								instalmentDueDateUTC: loanActivationDate.Add(30 * 24 * time.Hour),
								lateFeeDue:           *money.NewMoney(0),
								interestDue:          *money.NewMoney(11301),
								principalDue:         *money.NewMoney(65699),
								loanBalance:          *money.NewMoney(208000),
								paidPrincipal:        money.NewMoney(65699),
								paidInterest:         money.NewMoney(11301),
								paidLateFee:          money.NewMoney(0),
								paidDateUTC:          &firstInstalmentPaidDate,
								refId:                &paymentReferenceId,
							},
							{
								id:                   2,
								loanId:               "test-loan-id",
								instalmentDueDateUTC: loanActivationDate.Add(60 * 24 * time.Hour),
								lateFeeDue:           *money.NewMoney(0),
								interestDue:          *money.NewMoney(7731),
								principalDue:         *money.NewMoney(69269),
								loanBalance:          *money.NewMoney(142301),
							},
							{
								id:                   3,
								loanId:               "test-loan-id",
								instalmentDueDateUTC: loanActivationDate.Add(90 * 24 * time.Hour),
								lateFeeDue:           *money.NewMoney(0),
								interestDue:          *money.NewMoney(3968),
								principalDue:         *money.NewMoney(73032),
								loanBalance:          *money.NewMoney(73032),
							},
						},
					},
				},
				bookingTime: time.Now(),
				ctx:         context.WithValue(context.Background(), logging.CorrelationIdContextKey, "wf-001"),
			},
			outputs: TestCaseOutputs{
				updatedScheduleLineItem: &LoanPaymentScheduleLineItem{
					id:                   1,
					loanId:               "test-loan-id",
					instalmentDueDateUTC: loanActivationDate.Add(30 * 24 * time.Hour),
					lateFeeDue:           *money.NewMoney(0),
					interestDue:          *money.NewMoney(11301),
					principalDue:         *money.NewMoney(65699),
					loanBalance:          *money.NewMoney(208000),
					paidLateFee:          money.NewMoney(0),
					paidInterest:         money.NewMoney(11301),
					paidPrincipal:        money.NewMoney(65699),
					paidDateUTC:          &firstInstalmentPaidDate,
					refId:                &paymentReferenceId,
				},
				err: errors.New("cannot update payment details for schedule using same payment reference\nalready paid schedule: 1 for loan: test-loan-id with same payment reference: test-payment-ref-id-1"),
			},
		},
		{
			name: "book payment for schedule with less money than total due",
			inputs: TestCaseInputs{
				scheduleId:         1,
				paymentReferenceId: "test-payment-ref-id-1",
				// 1 cent less than total instalment amount EGP 770
				totalPaidAmount: *money.NewMoney(76999),
				paidDate:        firstInstalmentPaidDate,
			},
			data: baseTestCaseData,
			outputs: TestCaseOutputs{
				err: errors.New("paid amount is not same as due amount\nschedule: 1 for loan: test-loan-id - paid amount: EGP 769.99 is not exactly same as due amount: EGP 770.00"),
			},
		},
		{
			name: "book payment for schedule with more money than total due",
			inputs: TestCaseInputs{
				scheduleId:         1,
				paymentReferenceId: "test-payment-ref-id-1",
				// 1 cent more than total instalment amount EGP 770
				totalPaidAmount: *money.NewMoney(77001),
				paidDate:        firstInstalmentPaidDate,
			},
			data: baseTestCaseData,
			outputs: TestCaseOutputs{
				err: errors.New("paid amount is not same as due amount\nschedule: 1 for loan: test-loan-id - paid amount: EGP 770.01 is not exactly same as due amount: EGP 770.00"),
			},
		},
		{
			name: "book payment for schedule randomly in the future (reason is tech async and not business)",
			inputs: TestCaseInputs{
				scheduleId:         2,
				paymentReferenceId: "test-payment-ref-id-1",
				totalPaidAmount:    *money.NewMoney(77000),
				paidDate:           firstInstalmentPaidDate,
			},
			data: baseTestCaseData,
			outputs: TestCaseOutputs{
				updatedScheduleLineItem: &LoanPaymentScheduleLineItem{
					id:                   2,
					loanId:               "test-loan-id",
					instalmentDueDateUTC: loanActivationDate.Add(30 * 24 * time.Hour),
					lateFeeDue:           *money.NewMoney(0),
					interestDue:          *money.NewMoney(7731),
					principalDue:         *money.NewMoney(69269),
					loanBalance:          *money.NewMoney(142301),
					paidLateFee:          money.NewMoney(0),
					paidInterest:         money.NewMoney(7731),
					paidPrincipal:        money.NewMoney(69269),
					paidDateUTC:          &bookingTime,
				},
			},
		},
		{
			name: "happy path",
			inputs: TestCaseInputs{
				scheduleId:         1,
				paymentReferenceId: "test-payment-ref-id-1",
				// 1 cent more than total instalment amount EGP 770
				totalPaidAmount: *money.NewMoney(77000),
				paidDate:        firstInstalmentPaidDate,
			},
			data: baseTestCaseData,
			outputs: TestCaseOutputs{
				updatedScheduleLineItem: &LoanPaymentScheduleLineItem{
					id:                   1,
					loanId:               "test-loan-id",
					instalmentDueDateUTC: loanActivationDate.Add(30 * 24 * time.Hour),
					lateFeeDue:           *money.NewMoney(0),
					interestDue:          *money.NewMoney(11301),
					principalDue:         *money.NewMoney(65699),
					loanBalance:          *money.NewMoney(208000),
					paidLateFee:          money.NewMoney(0),
					paidInterest:         money.NewMoney(11301),
					paidPrincipal:        money.NewMoney(65699),
					paidDateUTC:          &bookingTime,
				},
			},
		},
	}
	
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			result, bookingErr := tc.data.
				loan.
				BookPaymentForSchedule(
					tc.data.ctx,
					tc.inputs.scheduleId,
					tc.inputs.paymentReferenceId,
					tc.inputs.totalPaidAmount,
					tc.inputs.paidDate,
				)
			if bookingErr != nil {
				if bookingErr.Error() != tc.outputs.err.Error() {
					t.Error("expected error: ", tc.outputs.err, " but got: ", bookingErr.Error())
				}
				if result == nil {
					return
				}
			}
			
			// Assert result is correct
			assert.NotNil(t, result)
			assert.Equal(t, result.id, tc.outputs.updatedScheduleLineItem.id)
			assert.Equal(t, tc.inputs.paymentReferenceId, *result.refId)
			assert.Equal(t, *result.paidDateUTC, firstInstalmentPaidDate)
			assert.Equal(t, result.interestDue.Units(), tc.outputs.updatedScheduleLineItem.interestDue.Units())
			assert.Equal(t, result.principalDue.Units(), tc.outputs.updatedScheduleLineItem.principalDue.Units())
			assert.Equal(t, result.lateFeeDue.Units(), tc.outputs.updatedScheduleLineItem.lateFeeDue.Units())
			assert.Equal(t, result.loanBalance.Units(), tc.outputs.updatedScheduleLineItem.loanBalance.Units())
			assert.Equal(t, result.paidInterest.Units(), tc.outputs.updatedScheduleLineItem.paidInterest.Units())
			assert.Equal(t, result.paidPrincipal.Units(), tc.outputs.updatedScheduleLineItem.paidPrincipal.Units())
			assert.Equal(t, result.paidLateFee.Units(), tc.outputs.updatedScheduleLineItem.paidLateFee.Units())
		})
	}
}
