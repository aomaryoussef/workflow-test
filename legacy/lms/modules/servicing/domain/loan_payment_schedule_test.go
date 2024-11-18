package domain

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestLoanPaymentSchedule_IsAnySchedulePaid(t *testing.T) {
	today := time.Now().UTC()
	paidDate := today.AddDate(0, 0, -1)
	addMonth := func(t time.Time) time.Time {
		return today.AddDate(0, 1, 0)
	}
	refId := "ref001"

	testCases := []struct {
		name                      string
		loan                      Loan
		expectedIsAnySchedulePaid bool
	}{
		{
			name: "should return true if any schedule is paid",
			loan: Loan{
				statuses: []LoanStatus{
					{
						statusType:   LoanStatusActive,
						createdAtUTC: today.AddDate(0, -1, 0),
					},
				},
				paymentSchedule: LoanPaymentSchedule{
					lineItems: []LoanPaymentScheduleLineItem{
						{
							id:                    uint64(1),
							loanId:                "001",
							instalmentDueDateUTC:  today,
							loanBalance:           *money.NewMoney(78300),
							gracePeriodEndDateUTC: today.AddDate(0, 0, 3),
							paidDateUTC:           &paidDate,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6100),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         money.NewMoney(20000),
							paidInterest:          money.NewMoney(6100),
							paidLateFee:           money.NewMoney(0),
							refId:                 &refId,
						},
						{
							id:                    uint64(2),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(today),
							loanBalance:           *money.NewMoney(52200),
							gracePeriodEndDateUTC: addMonth(today).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6100),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
					},
				},
			},
			expectedIsAnySchedulePaid: true,
		},
		{
			name: "should return true if all schedules are paid",
			loan: Loan{
				statuses: []LoanStatus{
					{
						statusType:   LoanStatusActive,
						createdAtUTC: today.AddDate(0, -1, 0),
					},
				},
				paymentSchedule: LoanPaymentSchedule{
					lineItems: []LoanPaymentScheduleLineItem{
						{
							id:                    uint64(1),
							loanId:                "001",
							instalmentDueDateUTC:  today,
							loanBalance:           *money.NewMoney(78300),
							gracePeriodEndDateUTC: today.AddDate(0, 0, 3),
							paidDateUTC:           &paidDate,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6100),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         money.NewMoney(20000),
							paidInterest:          money.NewMoney(6100),
							paidLateFee:           money.NewMoney(0),
							refId:                 &refId,
						},
						{
							id:                    uint64(2),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(today),
							loanBalance:           *money.NewMoney(52200),
							gracePeriodEndDateUTC: addMonth(today).AddDate(0, 0, 3),
							paidDateUTC:           &paidDate,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6100),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         money.NewMoney(20000),
							paidInterest:          money.NewMoney(6100),
							paidLateFee:           money.NewMoney(0),
							refId:                 &refId,
						},
					},
				},
			},
			expectedIsAnySchedulePaid: true,
		},
		{
			name: "should return false if all schedules are unpaid",
			loan: Loan{
				statuses: []LoanStatus{
					{
						statusType:   LoanStatusActive,
						createdAtUTC: today.AddDate(0, -1, 0),
					},
				},
				paymentSchedule: LoanPaymentSchedule{
					lineItems: []LoanPaymentScheduleLineItem{
						{
							id:                    uint64(1),
							loanId:                "001",
							instalmentDueDateUTC:  today,
							loanBalance:           *money.NewMoney(78300),
							gracePeriodEndDateUTC: today.AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(7000),
							interestDue:           *money.NewMoney(3000),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
						{
							id:                    uint64(2),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(today),
							loanBalance:           *money.NewMoney(52200),
							gracePeriodEndDateUTC: addMonth(today).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(7000),
							interestDue:           *money.NewMoney(3000),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
					},
				},
			},
			expectedIsAnySchedulePaid: false,
		},
	}
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.expectedIsAnySchedulePaid, tc.loan.paymentSchedule.IsAnySchedulePaid())
		})
	}
}
