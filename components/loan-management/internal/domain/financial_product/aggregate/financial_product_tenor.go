package aggregate

import (
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/internal/types"
)

type FinancialProductTenor struct {
	Key                 string
	DurationInDays      uint32
	Interest            types.PercentBasisPoints // Interest in percentage basis points. Currently only fixed percentage is allowed with max. 2 decimal precision.
	AdminFeeBasisPoints types.PercentBasisPoints // Admin Fee in percentage basis points. Currently only fixed percentage is allowed with max. 2 decimal precision.
}

func (tenor *FinancialProductTenor) DurationInMonths() uint32 {
	return tenor.DurationInDays / config.DaysInMonth
}
