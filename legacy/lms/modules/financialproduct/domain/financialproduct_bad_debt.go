package domain

import (
	"errors"
	"github.com/btechlabs/lms-lite/pkg/stringconv"
)

type FinancialProductBadDebt struct {
	badDebtBasisPoints uint32 // badDebtBasisPoints is the bad debt percent in basis points
}

type FinancialProductBadDebtBuilder struct {
	BadDebtType  string
	BadDebtValue string
}

func NewFinancialProductBadDebtBuilder() (builder *FinancialProductBadDebtBuilder) {
	builder = &FinancialProductBadDebtBuilder{}
	return
}

func (b *FinancialProductBadDebtBuilder) SetBadDebtType(val string) *FinancialProductBadDebtBuilder {
	b.BadDebtType = val
	return b
}
func (b *FinancialProductBadDebtBuilder) SetBadDebtValue(val string) *FinancialProductBadDebtBuilder {
	b.BadDebtValue = val
	return b
}
func (b *FinancialProductBadDebtBuilder) Build() (
	badDebt *FinancialProductBadDebt,
	err error,
) {
	badDebtBasisPoints, err := stringconv.ParseStringToBasisPoints(b.BadDebtValue, uint8(2))
	if err != nil {
		err = errors.Join(errors.New("incorrect bad debt format"), err)
		return nil, err
	}

	badDebt = &FinancialProductBadDebt{
		badDebtBasisPoints: uint32(badDebtBasisPoints),
	}

	return badDebt, nil
}
