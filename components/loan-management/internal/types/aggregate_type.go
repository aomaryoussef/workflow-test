package types

import "github.com/btechlabs/lms/pkg/cqrs"

const (
	AggregateTypeFinancialProduct cqrs.AggregateType = "financial_product"
	AggregateTypeLoanAccount      cqrs.AggregateType = "loan_account"
	AggregateTypePayment          cqrs.AggregateType = "payment"
)
