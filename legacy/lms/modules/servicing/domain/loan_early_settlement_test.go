package domain

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestLoan_EarlySettlementDetails_WithNonZeroSettlementFees(t *testing.T) {
	today := time.Now().UTC()
	paidDate := today.AddDate(0, 0, -1)
	addMonth := func(t time.Time) time.Time {
		return today.AddDate(0, 1, 0)
	}
	refId := "ref001"
	testCases := []struct {
		name                                  string
		loan                                  Loan
		expectedEarlySettlementAvailable      bool
		expectedEarlySettlementPrincipalDue   *money.Money
		expectedEarlySettlementFeesDue        *money.Money
		expectedEarlySettlementTotalAmountDue *money.Money
	}{
		{
			name: "Given a loan with no payments, should not be able to early settle",
			loan: Loan{
				earlySettlementPercentBasisPoints: 15,
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
							loanBalance:           *money.NewMoney(30000),
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
							loanBalance:           *money.NewMoney(20000),
							gracePeriodEndDateUTC: addMonth(today).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(7000),
							interestDue:           *money.NewMoney(3000),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
						{
							id:                    uint64(3),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(addMonth(today)),
							loanBalance:           *money.NewMoney(10000),
							gracePeriodEndDateUTC: addMonth(addMonth(today)).AddDate(0, 0, 3),
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
			expectedEarlySettlementAvailable:      false,
			expectedEarlySettlementPrincipalDue:   nil,
			expectedEarlySettlementFeesDue:        nil,
			expectedEarlySettlementTotalAmountDue: nil,
		},
		{
			name: "Given a loan with 1 payment and resulting fees result to whole number (no round up), should be able to early settle",
			loan: Loan{
				earlySettlementPercentBasisPoints: 15,
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
							loanBalance:           *money.NewMoney(30000),
							gracePeriodEndDateUTC: today.AddDate(0, 0, 3),
							paidDateUTC:           &paidDate,
							principalDue:          *money.NewMoney(7000),
							interestDue:           *money.NewMoney(3000),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         money.NewMoney(7000),
							paidInterest:          money.NewMoney(3000),
							paidLateFee:           money.NewMoney(0),
							refId:                 &refId,
						},
						{
							id:                    uint64(2),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(today),
							loanBalance:           *money.NewMoney(20000),
							gracePeriodEndDateUTC: addMonth(today).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(7000),
							interestDue:           *money.NewMoney(3000),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
						{
							id:                    uint64(3),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(addMonth(today)),
							loanBalance:           *money.NewMoney(10000),
							gracePeriodEndDateUTC: addMonth(addMonth(today)).AddDate(0, 0, 3),
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
			expectedEarlySettlementAvailable:      true,
			expectedEarlySettlementPrincipalDue:   money.NewMoney(14000),
			expectedEarlySettlementFeesDue:        money.NewMoney(3000),
			expectedEarlySettlementTotalAmountDue: money.NewMoney(17000),
		},
		{
			// x.5 means e.g. resulting amount is 98.51
			name: "Given a loan with 1 payment and resulting fees result to > x.5 (rounded up), should be able to early settle",
			loan: Loan{
				earlySettlementPercentBasisPoints: 15,
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
							loanBalance:           *money.NewMoney(78600),
							gracePeriodEndDateUTC: today.AddDate(0, 0, 3),
							paidDateUTC:           &paidDate,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6200),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         money.NewMoney(20000),
							paidInterest:          money.NewMoney(6200),
							paidLateFee:           money.NewMoney(0),
							refId:                 &refId,
						},
						{
							id:                    uint64(2),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(today),
							loanBalance:           *money.NewMoney(52400),
							gracePeriodEndDateUTC: addMonth(today).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6200),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
						{
							id:                    uint64(3),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(addMonth(today)),
							loanBalance:           *money.NewMoney(26200),
							gracePeriodEndDateUTC: addMonth(addMonth(today)).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6200),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
					},
				},
			},
			expectedEarlySettlementAvailable:      true,
			expectedEarlySettlementPrincipalDue:   money.NewMoney(40000),
			expectedEarlySettlementFeesDue:        money.NewMoney(7900),
			expectedEarlySettlementTotalAmountDue: money.NewMoney(47900),
		},
		{
			// x.5 means e.g. resulting amount is 98.49
			name: "Given a loan with 1 payment and resulting fees result to < x.5 (rounded up), should be able to early settle",
			loan: Loan{
				earlySettlementPercentBasisPoints: 15,
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
						{
							id:                    uint64(3),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(addMonth(today)),
							loanBalance:           *money.NewMoney(26100),
							gracePeriodEndDateUTC: addMonth(addMonth(today)).AddDate(0, 0, 3),
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
			expectedEarlySettlementAvailable:      true,
			expectedEarlySettlementPrincipalDue:   money.NewMoney(40000),
			expectedEarlySettlementFeesDue:        money.NewMoney(7900),
			expectedEarlySettlementTotalAmountDue: money.NewMoney(47900),
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			isEarlySettlementAvailable := testCase.loan.IsEarlySettlementAvailable()
			assert.Equal(t, testCase.expectedEarlySettlementAvailable, isEarlySettlementAvailable)
			if testCase.expectedEarlySettlementAvailable {
				earlySettlementDetails := testCase.loan.EarlySettlementDetails()
				assert.Equal(t, testCase.expectedEarlySettlementPrincipalDue, earlySettlementDetails.EarlySettlementPrincipalDue)
				assert.Equal(t, testCase.expectedEarlySettlementFeesDue, earlySettlementDetails.EarlySettlementFeesDue)
				assert.Equal(t, testCase.expectedEarlySettlementTotalAmountDue, earlySettlementDetails.EarlySettlementTotalAmountDue())
			}
		})

	}
}

func TestLoan_EarlySettlementDetails_ZeroSettlementFees(t *testing.T) {
	today := time.Now().UTC()
	paidDate := today.AddDate(0, 0, -1)
	addMonth := func(t time.Time) time.Time {
		return today.AddDate(0, 1, 0)
	}
	refId := "ref001"
	testCases := []struct {
		name                                  string
		loan                                  Loan
		expectedEarlySettlementAvailable      bool
		expectedEarlySettlementPrincipalDue   *money.Money
		expectedEarlySettlementFeesDue        *money.Money
		expectedEarlySettlementTotalAmountDue *money.Money
	}{
		{
			name: "Given a loan with no payments, should not be able to early settle",
			loan: Loan{
				earlySettlementPercentBasisPoints: 0,
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
							loanBalance:           *money.NewMoney(30000),
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
							loanBalance:           *money.NewMoney(20000),
							gracePeriodEndDateUTC: addMonth(today).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(7000),
							interestDue:           *money.NewMoney(3000),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
						{
							id:                    uint64(3),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(addMonth(today)),
							loanBalance:           *money.NewMoney(10000),
							gracePeriodEndDateUTC: addMonth(addMonth(today)).AddDate(0, 0, 3),
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
			expectedEarlySettlementAvailable:      false,
			expectedEarlySettlementPrincipalDue:   nil,
			expectedEarlySettlementFeesDue:        nil,
			expectedEarlySettlementTotalAmountDue: nil,
		},
		{
			name: "Given a loan with 1 payment and resulting fees result to whole number (no round up), should be able to early settle",
			loan: Loan{
				earlySettlementPercentBasisPoints: 0,
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
							loanBalance:           *money.NewMoney(30000),
							gracePeriodEndDateUTC: today.AddDate(0, 0, 3),
							paidDateUTC:           &paidDate,
							principalDue:          *money.NewMoney(7000),
							interestDue:           *money.NewMoney(3000),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         money.NewMoney(7000),
							paidInterest:          money.NewMoney(3000),
							paidLateFee:           money.NewMoney(0),
							refId:                 &refId,
						},
						{
							id:                    uint64(2),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(today),
							loanBalance:           *money.NewMoney(20000),
							gracePeriodEndDateUTC: addMonth(today).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(7000),
							interestDue:           *money.NewMoney(3000),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
						{
							id:                    uint64(3),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(addMonth(today)),
							loanBalance:           *money.NewMoney(10000),
							gracePeriodEndDateUTC: addMonth(addMonth(today)).AddDate(0, 0, 3),
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
			expectedEarlySettlementAvailable:      true,
			expectedEarlySettlementPrincipalDue:   money.NewMoney(14000),
			expectedEarlySettlementFeesDue:        money.NewMoney(0),
			expectedEarlySettlementTotalAmountDue: money.NewMoney(14000),
		},
		{
			// x.5 means e.g. resulting amount is 98.51
			name: "Given a loan with 1 payment and resulting fees result to > x.5 (rounded up), should be able to early settle",
			loan: Loan{
				earlySettlementPercentBasisPoints: 0,
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
							loanBalance:           *money.NewMoney(78600),
							gracePeriodEndDateUTC: today.AddDate(0, 0, 3),
							paidDateUTC:           &paidDate,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6200),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         money.NewMoney(20000),
							paidInterest:          money.NewMoney(6200),
							paidLateFee:           money.NewMoney(0),
							refId:                 &refId,
						},
						{
							id:                    uint64(2),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(today),
							loanBalance:           *money.NewMoney(52400),
							gracePeriodEndDateUTC: addMonth(today).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6200),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
						{
							id:                    uint64(3),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(addMonth(today)),
							loanBalance:           *money.NewMoney(26200),
							gracePeriodEndDateUTC: addMonth(addMonth(today)).AddDate(0, 0, 3),
							paidDateUTC:           nil,
							principalDue:          *money.NewMoney(20000),
							interestDue:           *money.NewMoney(6200),
							lateFeeDue:            *money.NewMoney(0),
							paidPrincipal:         nil,
							paidInterest:          nil,
							paidLateFee:           nil,
						},
					},
				},
			},
			expectedEarlySettlementAvailable:      true,
			expectedEarlySettlementPrincipalDue:   money.NewMoney(40000),
			expectedEarlySettlementFeesDue:        money.NewMoney(0),
			expectedEarlySettlementTotalAmountDue: money.NewMoney(40000),
		},
		{
			// x.5 means e.g. resulting amount is 98.49
			name: "Given a loan with 1 payment and resulting fees result to < x.5 (rounded up), should be able to early settle",
			loan: Loan{
				earlySettlementPercentBasisPoints: 0,
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
						{
							id:                    uint64(3),
							loanId:                "001",
							instalmentDueDateUTC:  addMonth(addMonth(today)),
							loanBalance:           *money.NewMoney(26100),
							gracePeriodEndDateUTC: addMonth(addMonth(today)).AddDate(0, 0, 3),
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
			expectedEarlySettlementAvailable:      true,
			expectedEarlySettlementPrincipalDue:   money.NewMoney(40000),
			expectedEarlySettlementFeesDue:        money.NewMoney(0),
			expectedEarlySettlementTotalAmountDue: money.NewMoney(40000),
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			isEarlySettlementAvailable := testCase.loan.IsEarlySettlementAvailable()
			assert.Equal(t, testCase.expectedEarlySettlementAvailable, isEarlySettlementAvailable)
			if testCase.expectedEarlySettlementAvailable {
				earlySettlementDetails := testCase.loan.EarlySettlementDetails()
				assert.Equal(t, testCase.expectedEarlySettlementPrincipalDue, earlySettlementDetails.EarlySettlementPrincipalDue)
				assert.Equal(t, testCase.expectedEarlySettlementFeesDue, earlySettlementDetails.EarlySettlementFeesDue)
				assert.Equal(t, testCase.expectedEarlySettlementTotalAmountDue, earlySettlementDetails.EarlySettlementTotalAmountDue())
			}
		})

	}
}
