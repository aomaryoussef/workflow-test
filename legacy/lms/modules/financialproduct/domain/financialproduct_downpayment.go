package domain

import (
	"errors"
	"fmt"
	"math"
	
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/btechlabs/lms-lite/pkg/stringconv"
)

type downpaymentType string

const (
	FormulaDownpaymentType downpaymentType = "FORMULA" // FormulaDownpaymentType means it has a fix and a percentage part (or other custom formula later)
)

type FinancialProductDownpayment struct {
	downpaymentType downpaymentType
	fixed           *money.Money
	percentage      uint64 // percentage in basis points
}

func (d *FinancialProductDownpayment) GetDownpaymentForPrincipal(principal *money.Money) money.Money {
	variablePartFloat := float64(principal.Units()) * (float64(d.percentage) / 10000)
	variablePartRounded := math.Round(variablePartFloat*10000) / 10000 // round to nearest 10000
	variablePartMoney := money.NewMoney(uint64(math.Round(variablePartRounded)))
	
	return *money.NewMoney(variablePartMoney.Units() + d.fixed.Units())
}
func (d *FinancialProductDownpayment) GetPercentage() uint64 {
	return d.percentage
}
func (d *FinancialProductDownpayment) GetType() downpaymentType {
	return d.downpaymentType
}
func (d *FinancialProductDownpayment) GetFixed() *money.Money {
	return d.fixed
}

/** Builder **/

// FinancialProductAdminFeeBuilder builds a financialProductAdminFee structure
type FinancialProductDownpaymentBuilder struct {
	Type  string
	Value string
}

func NewFinancialProductDownpaymentBuilder() (builder *FinancialProductDownpaymentBuilder) {
	builder = &FinancialProductDownpaymentBuilder{}
	return
}
func (b *FinancialProductDownpaymentBuilder) SetType(val string) *FinancialProductDownpaymentBuilder {
	b.Type = val
	return b
}
func (b *FinancialProductDownpaymentBuilder) SetValue(val string) *FinancialProductDownpaymentBuilder {
	b.Value = val
	return b
}
func (b *FinancialProductDownpaymentBuilder) Build() (
	downpayment *FinancialProductDownpayment,
	err error,
) {
	if downpaymentType(b.Type) == FormulaDownpaymentType {
		flatFeeBasisPoints, percentageFeeBasisPoints, err := stringconv.ParseFormulaToBasisPoints(b.Value, uint8(2))
		if err != nil {
			err = errors.Join(fmt.Errorf("bad downpayment format"), err)
			return nil, err
		}
		return &FinancialProductDownpayment{
			downpaymentType: downpaymentType(b.Type),
			fixed:           money.NewMoney(flatFeeBasisPoints),
			percentage:      percentageFeeBasisPoints,
		}, nil
	} else {
		err = fmt.Errorf("unsupported downpayment type: %s", b.Type)
		return nil, err
	}
}
