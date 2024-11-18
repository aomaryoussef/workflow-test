package domain

import (
	"errors"
	"fmt"

	"math"

	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/btechlabs/lms-lite/pkg/stringconv"
)

type adminFeeType string

const (
	MonetaryAdminFeeType adminFeeType = "MONETARY" // MonetaryAdminFeeType means the admin fee is a fixed monetary value e.g. EGP 100.50
	FormulaAdminFeeType  adminFeeType = "FORMULA"  // FormulaAdminFeeType means it has a fix and a percentage part (or other custom formula later)
)

type FinancialProductAdminFee struct {
	feeType                  adminFeeType // feeType is the AdminFeeType supporting if InterestType is fixed e.g. EGP 100 or VARIABLE based on any formula
	fixedFee                 *money.Money // fixedFee is the monetary value of the fixed admin fee
	percentageFeeBasisPoints uint64       // percentageFeeBasisPoints is the percentage value of the admin fee in basis points, e.g. 100 is 1% (of principal)
}

/** Builder **/

// FinancialProductAdminFeeBuilder builds a financialProductAdminFee structure
type FinancialProductAdminFeeBuilder struct {
	FeeType  string
	FeeValue string
}

func NewFinancialProductAdminFeeBuilder() (builder *FinancialProductAdminFeeBuilder) {
	builder = &FinancialProductAdminFeeBuilder{}
	return
}
func (b *FinancialProductAdminFeeBuilder) SetFeeType(val string) *FinancialProductAdminFeeBuilder {
	b.FeeType = val
	return b
}
func (b *FinancialProductAdminFeeBuilder) SetFeeValue(val string) *FinancialProductAdminFeeBuilder {
	b.FeeValue = val
	return b
}
func (b *FinancialProductAdminFeeBuilder) Build() (
	adminFee *FinancialProductAdminFee,
	err error,
) {
	if adminFeeType(b.FeeType) == FormulaAdminFeeType {
		flatFeeUnits, percentageFeeBasisPoints, err := stringconv.ParseFormulaToBasisPoints(b.FeeValue, uint8(2))
		if err != nil {
			err = errors.Join(fmt.Errorf("bad admin fee format"), err)
			return nil, err
		}
		return &FinancialProductAdminFee{
			feeType:                  adminFeeType(b.FeeType),
			fixedFee:                 money.NewMoney(flatFeeUnits),
			percentageFeeBasisPoints: percentageFeeBasisPoints,
		}, nil
	} else if adminFeeType(b.FeeType) == MonetaryAdminFeeType {
		adminFeeUnits, err := stringconv.ParseStringToBasisPoints(b.FeeValue, uint8(2))
		if err != nil {
			err = errors.Join(fmt.Errorf("bad admin fee format"), err)
			return nil, err
		}

		return &FinancialProductAdminFee{
			feeType:                  adminFeeType(b.FeeType),
			fixedFee:                 money.NewMoney(adminFeeUnits),
			percentageFeeBasisPoints: 0,
		}, nil
	} else {
		err = fmt.Errorf("unsupported admin fee type: %s", b.FeeType)
		return nil, err
	}
}

func (fp *FinancialProduct) AdminFee(principal *money.Money, vatPercentage uint, forTenorKey string) (mny *money.Money, err error) {
	// loop through the tenor variants to find the tenor with the given key
	for _, tenor := range fp.tenorVariants {
		if tenor.key == forTenorKey {
			// take the admin fee from the global as default
			adminFee := fp.globalAdminFee
			if tenor.adminFee != nil {
				// override the global admin fee with the tenor level admin fee
				adminFee = tenor.adminFee
			}
			if adminFee == nil {
				// no admin fee either in global or tenor level
				return money.NewMoney(0), nil
			}
			// calculate admin fee monetary value
			adminFeeMonetaryFloat := ((float64(adminFee.percentageFeeBasisPoints) / 100) * float64(principal.UnitsOrZero())) / 100
			adminFeeMonetaryFloat += float64(adminFee.fixedFee.Units())
			// apply VAT to admin fee and add it to the admin fee
			vatMonetaryFloat := (float64(vatPercentage) / 100) * adminFeeMonetaryFloat
			// please note that we are ONLY rounding the VAT value
			// Because VAT is a govt. tax and it must be calculated as rounding only (not round up or round down explicitly)
			vatRounded := math.Round(vatMonetaryFloat)
			totalRoundedUp := uint64(math.Ceil(adminFeeMonetaryFloat + vatRounded))
			return money.NewMoney(totalRoundedUp), nil
		}
	}

	return nil, fmt.Errorf("tenor not found with tenorKey: %s for financial product: %s", forTenorKey, fp.key)
}
