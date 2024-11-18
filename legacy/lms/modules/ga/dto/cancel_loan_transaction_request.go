package dto

import (
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
)

// TODO: Sid the input here is exactly same to book_journal_entry
// FIXME - Once the checkout process tasks and contracts are properly created
type CancelLoanTransactionRequest struct {
	LoanId            string    `json:"loan_id"`
	MerchantAccountId string    `json:"merchant_account_id"`
	LoanAmount        uint64    `json:"loan_amount"`
	BookingTime       time.Time `json:"booking_time"`
}

func (ltr CancelLoanTransactionRequest) LoanAmountMoney() money.Money {
	mny := money.NewMoney(ltr.LoanAmount)
	return *mny
}