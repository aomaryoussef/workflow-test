package domain

import (
	"errors"
	"github.com/btechlabs/lms-lite/pkg/stringconv"
)

type lateFeeType string

const (
	MonetaryLateFeeType lateFeeType = "MONETARY"
)

type FinancialProductLateFee struct {
	feeType            lateFeeType
	lateFeeBasisPoints uint64 // lateFeeBasisPoints is the late fee in basis points or lowest denominator
}

/** Builder **/
type FinancialProductLateFeeBuilder struct {
	LateFeeType  string
	LateFeeValue string
}

func NewFinancialProductLateFeeBuilder() (builder *FinancialProductLateFeeBuilder) {
	builder = &FinancialProductLateFeeBuilder{}
	return
}

func (b *FinancialProductLateFeeBuilder) SetLateFeeType(val string) *FinancialProductLateFeeBuilder {
	b.LateFeeType = val
	return b
}
func (b *FinancialProductLateFeeBuilder) SetLateFeeValue(val string) *FinancialProductLateFeeBuilder {
	b.LateFeeValue = val
	return b
}
func (b *FinancialProductLateFeeBuilder) Build() (fplf *FinancialProductLateFee, err error) {
	lateFeeBasisPoints, err := stringconv.ParseStringToBasisPoints(b.LateFeeValue, uint8(2))
	if err != nil {
		err = errors.Join(errors.New("incorrect late fee format"), err)
		return nil, err
	}

	fplf = &FinancialProductLateFee{
		feeType:            MonetaryLateFeeType,
		lateFeeBasisPoints: lateFeeBasisPoints,
	}

	return fplf, nil
}
