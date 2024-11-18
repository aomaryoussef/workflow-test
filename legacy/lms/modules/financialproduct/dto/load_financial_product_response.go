package dto

import (
	"fmt"

	"github.com/btechlabs/lms-lite/modules/financialproduct/domain"
)

type LoadFinancialProductResponse struct {
	FinancialProducts []LoadFinancialProductResponseItem `mapstructure:"financial_products" json:"financial_products"`
}

type LoadFinancialProductResponseItem struct {
	ProductKey     string `mapstructure:"product_key" json:"product_key"`
	ProductVersion string `mapstructure:"product_version" json:"product_version"`
	ProductID      string `mapstructure:"product_id" json:"product_id"`

	TenorVariants []*TenorVariant `mapstructure:"tenor_variants" json:"tenor_variants"`
}

type TenorVariant struct {
	Key                string        `mapstructure:"key" json:"key"`
	DurationInDays     uint16        `mapstructure:"duration_in_days" json:"duration_in_days"`
	MinimumDownpayment Downpayment   `mapstructure:"minimum_downpayment" json:"minimum_downpayment"`
	MaximumDownpayment Downpayment   `mapstructure:"maximum_downpayment" json:"maximum_downpayment"`
	TenorPhases        []*TenorPhase `mapstructure:"tenor_phases" json:"tenor_phases"`
}

type TenorPhase struct {
	DurationInDays uint16          `mapstructure:"duration_in_days" json:"duration_in_days"`
	Interest       ProductInterest `mapstructure:"interest" json:"interest"`
}

type ProductInterest struct {
	InterestType                 domain.InterestType                 `mapstructure:"type" json:"type"`
	InterestMethodology          domain.InterestMethodology          `mapstructure:"methodology" json:"methodology"`
	InterestCompoundingFrequency domain.InterestCompoundingFrequency `mapstructure:"compounding_frequency" json:"compounding_frequency"`
	InterestBasisPoints          uint64                              `mapstructure:"basis_points" json:"basis_points"`
	Precision                    uint8                               `mapstructure:"precision" json:"precision"`
}

type Downpayment struct {
	Percentage string `mapstructure:"percentage" json:"percentage"`
	Flat       uint64 `mapstructure:"flat" json:"flat"`
}

func MapFromDomain(fp *domain.FinancialProduct) (response LoadFinancialProductResponseItem, err error) {
	response = LoadFinancialProductResponseItem{
		ProductKey:     fp.Key(),
		ProductVersion: fp.Version(),
		ProductID:      fp.Id(),
	}

	var variants []*TenorVariant
	for _, v := range fp.TenorVariants() {
		tenorVariant := TenorVariant{
			Key: v.Key(),
			MinimumDownpayment: Downpayment{
				Percentage: fmt.Sprintf("%.2f", float64(v.MinimumDownpayment().GetPercentage())/100),
				Flat:       v.MinimumDownpayment().GetFixed().Units(),
			},
			MaximumDownpayment: Downpayment{
				Percentage: fmt.Sprintf("%.2f", float64(v.MaximumDownpayment().GetPercentage())/100),
				Flat:       v.MaximumDownpayment().GetFixed().Units(),
			},
			DurationInDays: v.DurationInDays(),
		}
		for _, x := range v.Phases() {
			tenorPhase := TenorPhase{
				DurationInDays: x.DurationInDays(),
				Interest: ProductInterest{
					InterestType:                 x.Interest().Type(),
					InterestMethodology:          x.Interest().Methodology(),
					InterestCompoundingFrequency: x.Interest().CompoundingFrequency(),
					InterestBasisPoints:          x.Interest().BasisPoints(),
					Precision:                    x.Interest().Precision(),
				},
			}
			tenorVariant.TenorPhases = append(tenorVariant.TenorPhases, &tenorPhase)
		}
		variants = append(variants, &tenorVariant)
	}
	response.TenorVariants = variants

	return response, nil
}
