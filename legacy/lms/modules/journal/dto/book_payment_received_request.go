package dto

import (
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
)

type CollectionMethod string

const (
	BTECH_STORE_CASH CollectionMethod = "BTECH_STORE_CASH"
	FAWRY            CollectionMethod = "FAWRY"
)

type BookPaymentReceivedRequest struct {
	LoanId             string
	BookedAt           time.Time
	CorrelationId      string
	TotalAmountPaid    money.Money
	TotalPrincipalPaid *money.Money
	TotalInterestPaid  *money.Money
	TotalLateFeePaid   *money.Money
	CollectionMethod   CollectionMethod
}
