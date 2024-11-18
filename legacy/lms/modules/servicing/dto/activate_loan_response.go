package dto

import "time"

type ActivateLoanResponse struct {
	ActivatedLoan ActivatedLoanOutput `json:"activated_loan"`
}

type ActivatedLoanOutput struct {
	LoanId                string    `json:"loan_id"`
	OrderNumber           string    `json:"order_number"`
	MerchantAccountId     int       `json:"merchant_account_id"`
	LoanAmount            uint64    `json:"loan_amount"`
	BookingTime           time.Time `json:"booking_time"`
	MerchantPayableAmount uint64    `json:"merchant_payable_amount"`
}
