package domain

import (
	"errors"
	"fmt"
	"math"
	
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/btechlabs/lms-lite/pkg/stringconv"
)

type InterestType string
type InterestMethodology string
type InterestCompoundingFrequency string

const (
	FixedInterestType            InterestType                 = "FIXED"     // FixedInterestType means that the interest rate does not change over time.
	DecliningInterestMethodology InterestMethodology          = "DECLINING" // DecliningInterestMethodology means that the interest rate calculation is done on the declining outstanding balance
	MonthlyInterestCompounding   InterestCompoundingFrequency = "MONTHLY"   // MonthlyInterestCompounding means that the interest rate calculation is done based on a monthly compounding frequency
	InterestPrecision                                         = uint8(2)    // InterestPrecision is the number of decimal points supported 	// InterestPrecisionSeparator is the decimal separator
)

// FinancialProductInterest represents an interest of the financial product
// with an interest formula.
// Currently only supports FIXED interest type, with DECLINING interest
// methodology and MONTHLY compounding frequency
type FinancialProductInterest struct {
	interestType                 InterestType
	interestMethodology          InterestMethodology
	interestCompoundingFrequency InterestCompoundingFrequency
	interestBasisPoints          uint64
	precision                    uint8
}

func (fpi *FinancialProductInterest) Type() InterestType {
	return fpi.interestType
}
func (fpi *FinancialProductInterest) Methodology() InterestMethodology {
	return fpi.interestMethodology
}
func (fpi *FinancialProductInterest) CompoundingFrequency() InterestCompoundingFrequency {
	return fpi.interestCompoundingFrequency
}
func (fpi *FinancialProductInterest) BasisPoints() uint64 {
	return fpi.interestBasisPoints
}
func (fpi *FinancialProductInterest) Precision() uint8 {
	return fpi.precision
}

// totalInterestPayableOnPrincipal calculates the total interest to be paid
// for the full tenor.
func (fpi *FinancialProductInterest) totalInterestPayableOnPrincipal(netFinancedAmount money.Money) *money.Money {
	// Because the interest is saved as basis points, it
	// first needs to be converted into interest
	// i.e. 176% is saved as basis points 17600
	interest := float64(fpi.interestBasisPoints / 100)
	// Then 176% multiplied with principal and divided by 100 (176% = 1.76)
	amount := (interest * float64(netFinancedAmount.Units())) / 100
	return money.NewMoney(uint64(math.Round(amount)))
}

/** Builder **/
type FinancialProductInterestBuilder struct {
	InterestType                 InterestType
	InterestMethodology          InterestMethodology
	InterestCompoundingFrequency InterestCompoundingFrequency
	Interest                     string
	Precision                    uint8
}

func NewFinancialProductInterestBuilder() (builder *FinancialProductInterestBuilder) {
	builder = &FinancialProductInterestBuilder{
		InterestType:                 FixedInterestType,
		InterestMethodology:          DecliningInterestMethodology,
		InterestCompoundingFrequency: MonthlyInterestCompounding,
		Precision:                    InterestPrecision,
	}
	
	return builder
}

func (b *FinancialProductInterestBuilder) SetInterest(val string) *FinancialProductInterestBuilder {
	b.Interest = val
	return b
}

func (b *FinancialProductInterestBuilder) Build() (fpi *FinancialProductInterest, err error) {
	interestBasisPoints, err := stringconv.ParseStringToBasisPoints(b.Interest, uint8(2))
	if err != nil {
		err = errors.Join(fmt.Errorf("bad interest format: %s", b.Interest), err)
		return nil, err
	}
	
	fpi = &FinancialProductInterest{
		interestBasisPoints:          interestBasisPoints,
		precision:                    b.Precision,
		interestCompoundingFrequency: b.InterestCompoundingFrequency,
		interestMethodology:          b.InterestMethodology,
		interestType:                 b.InterestType,
	}
	
	return fpi, nil
}
