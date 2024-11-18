package domain

import (
	"strconv"
	"strings"

	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/btechlabs/lms-lite/pkg/stringconv"
)

type FinancialProductBuilder struct {
	// General
	Id              string
	Key             string
	Version         string
	PreviousVersion string
	Name            string
	Description     string
	ActiveSince     string
	ActiveUntil     string
	// Config params
	ConfigRoundUpMonthlyToNearest bool

	// Global Attributes
	GlobalAdminFeeBuilder            *FinancialProductAdminFeeBuilder
	GlobalBadDebtBuilder             *FinancialProductBadDebtBuilder
	GlobalGracePeriodInDays          uint8
	GlobalMinimumApplicablePrincipal string
	GlobalMaximumApplicablePrincipal string
	GlobalRepaymentDaysOfMonth       string

	// Variants
	TenorVariantBuilder []*FinancialProductTenorVariantBuilder
}

func NewFinancialProductBuilder() *FinancialProductBuilder {
	builder := &FinancialProductBuilder{
		TenorVariantBuilder: make([]*FinancialProductTenorVariantBuilder, 0),
	}
	return builder
}
func (b *FinancialProductBuilder) Build() (fb *FinancialProduct, err error) {
	fb = &FinancialProduct{
		id:                            b.Id,
		key:                           b.Key,
		version:                       b.Version,
		previousVersion:               b.PreviousVersion,
		name:                          b.Name,
		description:                   b.Description,
		globalGracePeriodInDays:       b.GlobalGracePeriodInDays,
		tenorVariants:                 make([]*FinancialProductTenorVariant, 0),
		configRoundUpMonthlyToNearest: b.ConfigRoundUpMonthlyToNearest,
	}
	// Active Since
	activeSince, err := stringconv.ParseStringAsDateTime(b.ActiveSince)
	if err == nil && activeSince != nil {
		fb.activeSince = activeSince
	}
	// Active Until
	activeUntil, err := stringconv.ParseStringAsDateTime(b.ActiveUntil)
	if err == nil && activeUntil != nil {
		fb.activeUntil = activeUntil
	}
	// Global Admin Fee
	globalAdminFee, err := b.GlobalAdminFeeBuilder.Build()
	if err != nil {
		return nil, err
	}
	fb.globalAdminFee = globalAdminFee
	// Global Bad Debt
	globalBadDebt, err := b.GlobalBadDebtBuilder.Build()
	if err != nil {
		return nil, err
	}
	fb.globalBadDebt = globalBadDebt
	// Minimum Principal
	minPrincipal, err := stringconv.ParseStringToBasisPoints(b.GlobalMinimumApplicablePrincipal, uint8(2))
	if err != nil {
		return nil, err
	}
	fb.globalMinimumApplicablePrincipal = money.NewMoney(minPrincipal)
	// Maximum Principal
	maxPrincipal, err := stringconv.ParseStringToBasisPoints(b.GlobalMaximumApplicablePrincipal, uint8(2))
	if err != nil {
		return nil, err
	}
	fb.globalMaximumApplicablePrincipal = money.NewMoney(maxPrincipal)
	// Repayment days
	commaSeparatedDays := strings.TrimSpace(b.GlobalRepaymentDaysOfMonth)
	days := strings.Split(commaSeparatedDays, ",")
	daysArr := make([]uint8, 0)
	for _, day := range days {
		day = strings.TrimSpace(day)
		d, err := strconv.ParseUint(day, 10, 64)
		if err != nil {
			return nil, err
		}
		daysArr = append(daysArr, uint8(d))
	}
	fb.globalRepaymentDaysOfMonth = daysArr

	// Tenor Variants
	for _, variantBuilder := range b.TenorVariantBuilder {
		v, err := variantBuilder.Build()
		if err != nil {
			return nil, err
		}
		fb.tenorVariants = append(fb.tenorVariants, v)
	}

	err = fb.validate()
	if err != nil {
		return nil, err
	}
	return
}

func (b *FinancialProductBuilder) SetId(id string) *FinancialProductBuilder {
	b.Id = id
	return b
}
func (b *FinancialProductBuilder) SetKey(key string) *FinancialProductBuilder {
	b.Key = key
	return b
}
func (b *FinancialProductBuilder) SetVersion(version string) *FinancialProductBuilder {
	b.Version = version
	return b
}
func (b *FinancialProductBuilder) SetPreviousVersion(pv string) *FinancialProductBuilder {
	b.PreviousVersion = pv
	return b
}
func (b *FinancialProductBuilder) SetName(name string) *FinancialProductBuilder {
	b.Name = name
	return b
}
func (b *FinancialProductBuilder) SetDescription(description string) *FinancialProductBuilder {
	b.Description = description
	return b
}
func (b *FinancialProductBuilder) SetActiveSince(as string) *FinancialProductBuilder {
	b.ActiveSince = as
	return b
}
func (b *FinancialProductBuilder) SetActiveUntil(au string) *FinancialProductBuilder {
	b.ActiveUntil = au
	return b
}
func (b *FinancialProductBuilder) SetRoundUpMonthlyToNearest(i bool) *FinancialProductBuilder {
	b.ConfigRoundUpMonthlyToNearest = i
	return b
}
func (b *FinancialProductBuilder) SetGlobalAdminFeeBuilder(builder *FinancialProductAdminFeeBuilder) *FinancialProductBuilder {
	b.GlobalAdminFeeBuilder = builder
	return b
}
func (b *FinancialProductBuilder) SetGlobalBadDebtBuilder(builder *FinancialProductBadDebtBuilder) *FinancialProductBuilder {
	b.GlobalBadDebtBuilder = builder
	return b
}
func (b *FinancialProductBuilder) SetGlobalGracePeriod(globalGracePeriodInDays uint8) *FinancialProductBuilder {
	b.GlobalGracePeriodInDays = globalGracePeriodInDays
	return b
}
func (b *FinancialProductBuilder) SetGlobalMinPrincipal(val string) *FinancialProductBuilder {
	b.GlobalMinimumApplicablePrincipal = val
	return b
}
func (b *FinancialProductBuilder) SetGlobalMaxPrincipal(val string) *FinancialProductBuilder {
	b.GlobalMaximumApplicablePrincipal = val
	return b
}
func (b *FinancialProductBuilder) SetGlobalRepaymentDays(commaSeparatedDays string) *FinancialProductBuilder {
	b.GlobalRepaymentDaysOfMonth = commaSeparatedDays
	return b
}
func (b *FinancialProductBuilder) AddTenorVariantBuilder(variant *FinancialProductTenorVariantBuilder) *FinancialProductBuilder {
	b.TenorVariantBuilder = append(b.TenorVariantBuilder, variant)
	return b
}
