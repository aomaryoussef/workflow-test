package aggregate

import (
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/timex"
)

type LoanAccountMonetaryLineItems []LoanAccountMonetaryLineItem

type LoanAccountMonetaryLineItem struct {
	Amount         money.Money
	Type           pbevent.MonetaryLineItemType
	CollectionType pbevent.MonetaryLineItemCollectionType
	BookingTime    timex.UtcTime
}

func (lamli LoanAccountMonetaryLineItems) FinancedAmount() money.Money {
	for _, item := range lamli {
		if item.Type == pbevent.MonetaryLineItemType_FINANCED_AMOUNT {
			return item.Amount
		}
	}
	return *money.NewMoney(0, money.DefaultSystemCurrency)
}

func (lamli LoanAccountMonetaryLineItems) AdminFeeAmount() money.Money {
	for _, item := range lamli {
		if item.Type == pbevent.MonetaryLineItemType_ADMIN_FEE {
			return item.Amount
		}
	}
	return *money.NewMoney(0, money.DefaultSystemCurrency)
}

func (lamli LoanAccountMonetaryLineItems) VatAmount() money.Money {
	for _, item := range lamli {
		if item.Type == pbevent.MonetaryLineItemType_VAT {
			return item.Amount
		}
	}
	return *money.NewMoney(0, money.DefaultSystemCurrency)
}
