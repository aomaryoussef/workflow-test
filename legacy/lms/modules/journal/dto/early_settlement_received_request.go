package dto

import (
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
)

type BookEarlySettlementReceivedRequest struct {
	LoanId                  string
	CorrelationId           string
	PaymentReferenceId      string
	BookedAt                time.Time
	TotalAmountPaid         money.Money
	TotalPrincipalPaid      money.Money
	TotalInterestPaid       money.Money
	TotalInitialInterestDue money.Money
	WithoutAllowance        bool
	WithoutInterest         bool
	CollectionMethod        CollectionMethod
}

func (r *BookEarlySettlementReceivedRequest) InterestReceivableDelta() *money.Money {
	deltaUnits := r.TotalInitialInterestDue.UnitsOrZero() - r.TotalInterestPaid.UnitsOrZero()
	if deltaUnits < 0 {
		panic("interest receivable delta cannot be negative")
	}
	return money.NewMoney(deltaUnits)
}
