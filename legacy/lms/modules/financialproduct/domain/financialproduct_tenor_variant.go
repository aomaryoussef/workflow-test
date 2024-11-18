package domain

import (
	"errors"
	"github.com/btechlabs/lms-lite/pkg/money"
)

var (
	daysInMonthForCalc uint16 = 30 // Days in month for all tenor month calculations ONLY
)

type FinancialProductTenorVariant struct {
	key                string
	durationInDays     uint16
	minimumDownpayment *FinancialProductDownpayment
	maximumDownpayment *FinancialProductDownpayment
	adminFee           *FinancialProductAdminFee
	tenorPhases        []*FinancialProductTenorPhase
}

func (tp *FinancialProductTenorVariant) Key() string {
	return tp.key
}
func (tp *FinancialProductTenorVariant) DurationInDays() uint16 {
	return tp.durationInDays
}
func (tp *FinancialProductTenorVariant) Phases() []*FinancialProductTenorPhase {
	return tp.tenorPhases
}
func (tp *FinancialProductTenorVariant) MinimumAllowedDownpaymentForPrincipal(principal *money.Money) money.Money {
	return tp.minimumDownpayment.GetDownpaymentForPrincipal(principal)
}
func (tp *FinancialProductTenorVariant) MaximumAllowedDownpaymentForPrincipal(principal *money.Money) money.Money {
	return tp.maximumDownpayment.GetDownpaymentForPrincipal(principal)
}

func (tp *FinancialProductTenorVariant) MinimumDownpayment() *FinancialProductDownpayment {
	return tp.minimumDownpayment
}
func (tp *FinancialProductTenorVariant) MaximumDownpayment() *FinancialProductDownpayment {
	return tp.maximumDownpayment
}

type FinancialProductTenorPhase struct {
	durationInDays uint16
	interest       *FinancialProductInterest
	lateFee        *FinancialProductLateFee
}

func (tp *FinancialProductTenorPhase) DurationInDays() uint16 {
	return tp.durationInDays
}
func (tp *FinancialProductTenorPhase) Interest() *FinancialProductInterest {
	return tp.interest
}

func (tp *FinancialProductTenorPhase) DurationInMonths() uint16 {
	return tp.durationInDays / daysInMonthForCalc
}

/** Builder **/
type FinancialProductTenorVariantBuilder struct {
	Key                string
	DurationInDays     uint16
	MinimumDownpayment *FinancialProductDownpaymentBuilder
	MaximumDownpayment *FinancialProductDownpaymentBuilder
	AdminFee           *FinancialProductAdminFeeBuilder
	TenorPhaseBuilders []*FinancialProductTenorPhaseBuilder
}

func NewFinancialProductTenorVariantBuilder() (builder *FinancialProductTenorVariantBuilder) {
	builder = &FinancialProductTenorVariantBuilder{
		TenorPhaseBuilders: make([]*FinancialProductTenorPhaseBuilder, 0),
	}
	return builder
}

func (b *FinancialProductTenorVariantBuilder) SetKey(val string) *FinancialProductTenorVariantBuilder {
	b.Key = val
	return b
}
func (b *FinancialProductTenorVariantBuilder) SetDurationInDays(val uint16) *FinancialProductTenorVariantBuilder {
	b.DurationInDays = val
	return b
}
func (b *FinancialProductTenorVariantBuilder) AddTenorPhaseBuilder(val *FinancialProductTenorPhaseBuilder) *FinancialProductTenorVariantBuilder {
	b.TenorPhaseBuilders = append(b.TenorPhaseBuilders, val)
	return b
}
func (b *FinancialProductTenorVariantBuilder) SetMinimumDownpayment(val *FinancialProductDownpaymentBuilder) *FinancialProductTenorVariantBuilder {
	b.MinimumDownpayment = val
	return b
}
func (b *FinancialProductTenorVariantBuilder) SetMaximumDownpayment(val *FinancialProductDownpaymentBuilder) *FinancialProductTenorVariantBuilder {
	b.MaximumDownpayment = val
	return b
}
func (b *FinancialProductTenorVariantBuilder) SetAdminFee(val *FinancialProductAdminFeeBuilder) *FinancialProductTenorVariantBuilder {
	b.AdminFee = val
	return b
}
func (b *FinancialProductTenorVariantBuilder) Build() (tenorVariant *FinancialProductTenorVariant, err error) {
	tenorVariant = &FinancialProductTenorVariant{
		key:            b.Key,
		durationInDays: b.DurationInDays,
		tenorPhases:    make([]*FinancialProductTenorPhase, 0),
	}
	if b.AdminFee != nil {
		tenorVariant.adminFee, err = b.AdminFee.Build()
		if err != nil {
			return nil, err
		}
	}

	for _, phaseBuilder := range b.TenorPhaseBuilders {
		phase, err := phaseBuilder.Build()
		if err != nil {
			return nil, err
		}
		tenorVariant.tenorPhases = append(tenorVariant.tenorPhases, phase)
	}

	// Temporary check until we support multiple phases in tenors
	// validate totalPhaseLength == tenorInDays
	totalPhaseLength := uint16(0)
	for _, phase := range tenorVariant.tenorPhases {
		totalPhaseLength += phase.durationInDays
	}
	if tenorVariant.durationInDays != totalPhaseLength {
		err := errors.New("total phase length is not equal to tenor length, currently supported is 1 full phase for a tenor")
		return nil, err
	}

	tenorVariant.minimumDownpayment, err = b.MinimumDownpayment.Build()
	if err != nil {
		return nil, err
	}

	tenorVariant.maximumDownpayment, err = b.MaximumDownpayment.Build()
	if err != nil {
		return nil, err
	}

	return
}

type FinancialProductTenorPhaseBuilder struct {
	DurationInDays  uint16
	InterestBuilder *FinancialProductInterestBuilder
	LateFeeBuilder  *FinancialProductLateFeeBuilder
}

func NewFinancialProductTenorPhaseBuilder() (builder *FinancialProductTenorPhaseBuilder) {
	builder = &FinancialProductTenorPhaseBuilder{}
	return
}
func (b *FinancialProductTenorPhaseBuilder) SetDurationInDays(val uint16) *FinancialProductTenorPhaseBuilder {
	b.DurationInDays = val
	return b
}
func (b *FinancialProductTenorPhaseBuilder) SetInterestBuilder(val *FinancialProductInterestBuilder) *FinancialProductTenorPhaseBuilder {
	b.InterestBuilder = val
	return b
}
func (b *FinancialProductTenorPhaseBuilder) SetLateFeeBuilder(val *FinancialProductLateFeeBuilder) *FinancialProductTenorPhaseBuilder {
	b.LateFeeBuilder = val
	return b
}
func (b *FinancialProductTenorPhaseBuilder) Build() (fptp *FinancialProductTenorPhase, err error) {
	fptp = &FinancialProductTenorPhase{
		durationInDays: b.DurationInDays,
	}
	// Interest
	interest, err := b.InterestBuilder.Build()
	if err != nil {
		return nil, err
	}
	fptp.interest = interest
	// Late Fee
	lateFee, err := b.LateFeeBuilder.Build()
	if err != nil {
		return nil, err
	}
	fptp.lateFee = lateFee
	return
}
