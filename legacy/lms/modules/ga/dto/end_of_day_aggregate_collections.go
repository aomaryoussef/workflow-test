package dto

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"time"
)

type RegularCollections struct {
	DebitCustomerCollection            money.Money
	CreditMurabahaPrincipalReceivables money.Money
	CreditMurabahaInterestReceivables  money.Money
}

func (r *RegularCollections) isBalanced() bool {
	return r.DebitCustomerCollection.UnitsOrZero() ==
		r.CreditMurabahaInterestReceivables.UnitsOrZero()+r.CreditMurabahaPrincipalReceivables.UnitsOrZero()
}

type EarlySettlementCollections struct {
	DebitCustomerCollection            money.Money
	DebitMurabahaSettlementAllowance   money.Money
	CreditMurabahaPrincipalReceivables money.Money
	CreditMurabahaInterestReceivables  money.Money
}

func (r *EarlySettlementCollections) isBalanced() bool {
	return r.DebitCustomerCollection.UnitsOrZero()+r.DebitMurabahaSettlementAllowance.UnitsOrZero() ==
		r.CreditMurabahaInterestReceivables.UnitsOrZero()+r.CreditMurabahaPrincipalReceivables.UnitsOrZero()
}

type EarlySettlementRevenueLoss struct {
	DebitUnearnedRevenue              money.Money
	CreditMurabahaSettlementAllowance money.Money
	CreditInterestRevenue             money.Money
}

func (r *EarlySettlementRevenueLoss) isBalanced() bool {
	return r.DebitUnearnedRevenue.UnitsOrZero() ==
		r.CreditInterestRevenue.UnitsOrZero()+r.CreditMurabahaSettlementAllowance.UnitsOrZero()
}

type EndOfDayCollectionsAggregate struct {
	StartTime time.Time
	EndTime   time.Time

	RegularCollections         RegularCollections
	EarlySettlementCollections EarlySettlementCollections
	EarlySettlementRevenueLoss EarlySettlementRevenueLoss
}

type EndOfDayCollectionsAggregateOpts func(aggregate *EndOfDayCollectionsAggregate)

func NewEndOfDayCollectionsAggregate(opts ...EndOfDayCollectionsAggregateOpts) *EndOfDayCollectionsAggregate {
	aggregate := &EndOfDayCollectionsAggregate{
		RegularCollections:         RegularCollections{},
		EarlySettlementCollections: EarlySettlementCollections{},
		EarlySettlementRevenueLoss: EarlySettlementRevenueLoss{},
	}
	for _, opt := range opts {
		opt(aggregate)
	}
	return aggregate
}

func WithRegularCollectionDebitCustomerCollection(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.RegularCollections.DebitCustomerCollection = *money.NewMoney(uint64(u))
	}
}
func WithRegularCollectionCreditPrincipalReceivable(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.RegularCollections.CreditMurabahaPrincipalReceivables = *money.NewMoney(uint64(u))
	}
}
func WithRegularCollectionCreditInterestReceivable(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.RegularCollections.CreditMurabahaInterestReceivables = *money.NewMoney(uint64(u))
	}
}

func WithEarlyCollectionDebitCustomerCollection(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.EarlySettlementCollections.DebitCustomerCollection = *money.NewMoney(uint64(u))
	}
}
func WithEarlyCollectionDebitSettlementAllowance(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.EarlySettlementCollections.DebitMurabahaSettlementAllowance = *money.NewMoney(uint64(u))
	}
}
func WithEarlyCollectionCreditPrincipalReceivable(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.EarlySettlementCollections.CreditMurabahaPrincipalReceivables = *money.NewMoney(uint64(u))
	}
}
func WithEarlyCollectionCreditInterestReceivable(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.EarlySettlementCollections.CreditMurabahaInterestReceivables = *money.NewMoney(uint64(u))
	}
}

func WithEarlyCollectionDebitUnearnedRevenue(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.EarlySettlementRevenueLoss.DebitUnearnedRevenue = *money.NewMoney(uint64(u))
	}
}
func WithEarlyCollectionCreditSettlementAllowance(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.EarlySettlementRevenueLoss.CreditMurabahaSettlementAllowance = *money.NewMoney(uint64(u))
	}
}
func WithEarlyCollectionCreditInterestRevenue(u int64) EndOfDayCollectionsAggregateOpts {
	return func(aggregate *EndOfDayCollectionsAggregate) {
		aggregate.EarlySettlementRevenueLoss.CreditInterestRevenue = *money.NewMoney(uint64(u))
	}
}

func (e *EndOfDayCollectionsAggregate) IsBalanced() bool {
	// The code just checks if the Sum of Debit = Sum of Credit
	return e.RegularCollections.isBalanced() &&
		e.EarlySettlementCollections.isBalanced() &&
		e.EarlySettlementRevenueLoss.isBalanced()
}
