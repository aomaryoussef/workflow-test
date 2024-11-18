package aggregate

import (
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/timex"
	. "github.com/samber/lo"
)

type LoanAccountAmmortisationLineItems []LoanAccountAmmortisationLineItem

func (l LoanAccountAmmortisationLineItems) TotalPrincipalDue() money.Money {
	if len(l) == 0 {
		return *money.NewMoney(0, money.DefaultSystemCurrency)
	}

	totalPrincipalDueUnits := uint64(0)
	for _, item := range l {
		if !item.Canceled && !item.IsPaid() {
			totalPrincipalDueUnits += item.PrincipalDue.Amount()
		}
	}
	return *money.NewMoney(totalPrincipalDueUnits, money.DefaultSystemCurrency)
}

func (l LoanAccountAmmortisationLineItems) TotalInterestReceivableDue() money.Money {
	if len(l) == 0 {
		return *money.NewMoney(0, money.DefaultSystemCurrency)
	}

	totalInterestReceivableDueUnits := uint64(0)
	for _, item := range l {
		if !item.Canceled && !item.IsPaid() {
			totalInterestReceivableDueUnits += item.InterestDue.Amount()
		}
	}
	return *money.NewMoney(totalInterestReceivableDueUnits, money.DefaultSystemCurrency)
}

func (l LoanAccountAmmortisationLineItems) TotalInterestReceivable() money.Money {
	if len(l) == 0 {
		return *money.NewMoney(0, money.DefaultSystemCurrency)
	}

	totalInterestReceivableDueUnits := Reduce(l, func(agg uint64, item LoanAccountAmmortisationLineItem, _ int) uint64 {
		return agg + item.InterestDue.Amount()
	}, uint64(0))

	return *money.NewMoney(totalInterestReceivableDueUnits, money.DefaultSystemCurrency)
}

func (l LoanAccountAmmortisationLineItems) GetUnpaidDues() []LoanAccountAmmortisationLineItem {
	unpaidDues := make([]LoanAccountAmmortisationLineItem, 0)
	for _, item := range l {
		if !item.Canceled && !item.IsPaid() {
			unpaidDues = append(unpaidDues, item)
		}
	}
	return unpaidDues
}

type LoanAccountAmmortisationLineItem struct {
	ScheduleNumber     uint32
	InstalmentDueAt    timex.UtcTime
	GracePeriodDueAt   timex.UtcTime
	LoanBalance        money.Money
	PrincipalDue       money.Money
	InterestDue        money.Money
	CumulativeInterest money.Money
	VatDue             money.Money
	AdminFeeDue        money.Money
	PenaltyDue         money.Money
	Canceled           bool
	CanceledAt         *timex.UtcTime
	CanceledReason     *string
	PrincipalPaid      money.Money
	InterestPaid       money.Money
	VatPaid            money.Money
	AdminFeePaid       money.Money
	PenaltyPaid        money.Money
	PaidAt             *timex.UtcTime
	// LinkedPaymentIds are the payment ids that were used to pay this instalment
	LinkedPaymentReference    []string
	InterestRevenueRecognised bool
}

func (laa LoanAccountAmmortisationLineItem) TotalDue() money.Money {
	total := money.AsPtr(laa.PrincipalDue).
		MustAdd(money.AsPtr(laa.InterestDue)).
		MustAdd(money.AsPtr(laa.VatDue)).
		MustAdd(money.AsPtr(laa.AdminFeeDue)).
		MustAdd(money.AsPtr(laa.PenaltyDue))
	return *total
}

func (laa LoanAccountAmmortisationLineItem) IsPaid() bool {
	return laa.PaidAt != nil &&
		laa.Canceled == false &&
		laa.PrincipalPaid.Amount() == laa.PrincipalDue.Amount() &&
		laa.InterestPaid.Amount() == laa.InterestDue.Amount() &&
		laa.VatPaid.Amount() == laa.VatDue.Amount() &&
		laa.AdminFeePaid.Amount() == laa.AdminFeeDue.Amount() &&
		laa.PenaltyPaid.Amount() == laa.PenaltyDue.Amount()
}
