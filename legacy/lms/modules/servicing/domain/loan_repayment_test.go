package domain

import (
	"testing"
	"time"
	
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/stretchr/testify/assert"
)

func TestBookRepayment(t *testing.T) {
	testCases := []struct {
		name              string
		instalments       []LoanPaymentScheduleLineItem
		payment           uint64
		expectedLateFee   uint64
		expectedInterest  uint64
		expectedPrincipal uint64
		bookingDate       time.Time
	}{
		{
			name: "Given enough money, should pay all outstanding fees for intstalment",
			instalments: []LoanPaymentScheduleLineItem{
				{
					instalmentDueDateUTC: time.Now(),
					loanBalance:          newMoneyVal(800000),
					principalDue:         newMoneyVal(3000),
					interestDue:          newMoneyVal(2000),
					lateFeeDue:           newMoneyVal(1000),
				},
			},
			expectedPrincipal: 3000,
			expectedInterest:  2000,
			expectedLateFee:   1000,
			payment:           6000,
			bookingDate:       time.Now().AddDate(0, 0, 1), // 1 day after due date
		},
		{
			name: "Given not enough money, should pay off lateFees first, split interest and pricipal based on outstanding ratio",
			instalments: []LoanPaymentScheduleLineItem{
				{
					instalmentDueDateUTC: time.Now(),
					loanBalance:          newMoneyVal(800000),
					principalDue:         newMoneyVal(3000),
					interestDue:          newMoneyVal(1000),
					lateFeeDue:           newMoneyVal(1000),
				},
			},
			expectedPrincipal: 750,
			expectedInterest:  250,
			expectedLateFee:   1000,
			payment:           2000,
			bookingDate:       time.Now().AddDate(0, 0, 1), // 1 day after due date
		},
		{
			name: "Should not pay instalments due after booking date", // TODO: once early settlement is introduced, delete this
			instalments: []LoanPaymentScheduleLineItem{
				{
					instalmentDueDateUTC: time.Now(),
					loanBalance:          newMoneyVal(800000),
					principalDue:         newMoneyVal(1000),
					interestDue:          newMoneyVal(1000),
					lateFeeDue:           newMoneyVal(0),
				},
				{
					instalmentDueDateUTC: time.Now().AddDate(1, 0, 0),
					loanBalance:          newMoneyVal(800000),
					principalDue:         newMoneyVal(1000),
					interestDue:          newMoneyVal(1000),
					lateFeeDue:           newMoneyVal(0),
				},
			},
			expectedPrincipal: 1000, // only the first instalment is due, we only expect that to be paid
			expectedInterest:  1000,
			expectedLateFee:   0,
			payment:           2000,
			bookingDate:       time.Now().AddDate(0, 0, 1), // 1 day after due date
		},
		{
			name: "Should pay multiple instalments correctly, even with one being partial payment",
			instalments: []LoanPaymentScheduleLineItem{
				{
					instalmentDueDateUTC: time.Now(),
					loanBalance:          newMoneyVal(800000),
					principalDue:         newMoneyVal(3000),
					interestDue:          newMoneyVal(2000),
					lateFeeDue:           newMoneyVal(1000),
				},
				{
					instalmentDueDateUTC: time.Now().AddDate(0, 0, 1),
					loanBalance:          newMoneyVal(800000),
					principalDue:         newMoneyVal(3000),
					interestDue:          newMoneyVal(1000),
					lateFeeDue:           newMoneyVal(1000),
				},
			},
			expectedPrincipal: 3750, // payment - latefees should be divided between principal and interest with correct ratio
			expectedInterest:  2250,
			expectedLateFee:   2000, // all latefees should be paid
			payment:           8000,
			bookingDate:       time.Now().AddDate(0, 0, 2), // 2 day after first due date
		},
	}
	
	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			_, totalLateFeePaid, totalInterestPaid, totalPrincipalPaid, err := BookRepayment(&testCase.instalments, newMoneyVal(testCase.payment), testCase.bookingDate)
			if err != nil {
				t.Error(err)
			}
			
			// TODO: remainingpaidamount
			
			assert.Equal(t, testCase.expectedLateFee, totalLateFeePaid.Units())
			assert.Equal(t, testCase.expectedInterest, totalInterestPaid.Units())
			assert.Equal(t, testCase.expectedPrincipal, totalPrincipalPaid.Units())
		})
		
	}
	
}

func newMoneyVal(amount uint64) money.Money {
	m := money.NewMoney(amount)
	return *m
}
