package aggregate

import (
	"fmt"
	"github.com/btechlabs/lms/config"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/timex"
)

var _ cqrs.Aggregate = (*FinancialProductAggregate)(nil)

// FinancialProductAggregate defines an immutable structure.
// All business calculations are always performed on the financial product
// level as this is the main business entity.
// All other related structs within the financial product are not available
// outside of this package.
type FinancialProductAggregate struct {
	*cqrs.BaseAggregate
	state                         pbevent.FinancialProductState // state of the financial product
	Name                          string                        // Name of the product
	Description                   string                        // Description of the product
	ActiveSince                   timex.UtcTime                 // ActiveSince is the date time from when this financial product is active
	ActiveUntil                   timex.UtcTime                 // ActiveUntil is the date time until when this financial product is active
	vatPercentBasisPoints         types.PercentBasisPoints      // VAT Percent defined globally
	AdminFeeBasisPoints           types.PercentBasisPoints      // Admin Fee in percentage basis points. Currently only fixed percentage is allowed with max. 2 decimal precision.
	EarlySettlementFeeBasisPoints types.PercentBasisPoints      // Early Settlement Fee in percentage basis points. Currently only fixed percentage is allowed with max. 2 decimal precision.
	BadDebtProvisionBasisPoints   types.PercentBasisPoints      // Bad Debt Provision in percentage basis points. Currently only fixed percentage is allowed with max. 2 decimal precision.
	InstallmentRoundingType       RoundingType                  // Installment Rounding Type
	GracePeriodInDays             uint32                        // Grace period in days
	PrincipalRange                PrincipalRange                // Minimum and maximum principal above which (including) should this financial product will be applied. Currently only fixed money is allowed.
	DownPayment                   DownPayment                   // Minimum and maximum down payment needed to avail this financial product.
	Tenors                        []FinancialProductTenor       // Tenor specific configuration overriding global configuration
}

// NewInitFinancialProductAggregate creates a new financial product
// aggregate model with the given Key and options as the first init model.
// This method creates an empty aggregate as if no events have been applied.
func NewInitFinancialProductAggregate() *FinancialProductAggregate {
	f := &FinancialProductAggregate{
		BaseAggregate:         cqrs.NewBaseAggregate(types.AggregateTypeFinancialProduct),
		state:                 pbevent.FinancialProductState_DRAFT,
		vatPercentBasisPoints: types.PercentBasisPoints(config.VATPercentBasisPoints),
	}
	return f
}

func (fp *FinancialProductAggregate) State() pbevent.FinancialProductState {
	return fp.state
}

func (fp *FinancialProductAggregate) VatPercentBasisPoints() types.PercentBasisPoints {
	return fp.vatPercentBasisPoints
}

func (fp *FinancialProductAggregate) GetTenorByKey(tenorKey string) (*FinancialProductTenor, error) {
	var tenor *FinancialProductTenor
	for _, t := range fp.Tenors {
		if t.Key == tenorKey {
			tenor = &t
			break
		}
	}
	if tenor == nil {
		return nil, fmt.Errorf("tenor with key: %s not found in financial product: %s", tenorKey, fp.Id)
	}

	return tenor, nil
}
