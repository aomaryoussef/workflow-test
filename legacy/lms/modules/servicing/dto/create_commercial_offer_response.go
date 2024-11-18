package dto

import (
	"github.com/btechlabs/lms-lite/modules/servicing/domain"
	"github.com/btechlabs/lms-lite/pkg/money"
)

type CreateCommercialOfferResponse struct {
	OfferDetails []*OfferDetails `json:"offer_details"`
}

type OfferDetails struct {
	Id                       string                   `json:"id" mapstructure:"id"`
	Tenure                   string                   `json:"tenure" mapstructure:"tenure"`
	AdminFee                 *money.SerializableMoney `json:"admin_fee" mapstructure:"admin_fee"`
	FinancedAmount           *money.SerializableMoney `json:"financed_amount" mapstructure:"financed_amount"`
	TotalAmount              *money.SerializableMoney `json:"total_amount" mapstructure:"total_amount"`
	AnnualInterestPercentage string                   `json:"annual_interest_percentage" mapstructure:"annual_interest_percentage"`
	InterestRatePerTenure    string                   `json:"interest_rate_per_tenure" mapstructure:"interest_rate_per_tenure"`
	DownPayment              *money.SerializableMoney `json:"down_payment" mapstructure:"down_payment"`
	MonthlyInstalment        *money.SerializableMoney `json:"monthly_instalment" mapstructure:"monthly_instalment"`
	AnnualPercentageRate     string                   `json:"annual_percentage_rate" mapstructure:"annual_percentage_rate"`
	FlatEffectiveRate        string                   `json:"flat_effective_rate" mapstructure:"flat_effective_rate"`
}

func MapFromDomain(co []domain.CommercialOffer) (response CreateCommercialOfferResponse, err error) {
	response = CreateCommercialOfferResponse{}

	var details []*OfferDetails
	for _, v := range co {
		offerDetails := OfferDetails{
			Id:                       v.Id,
			Tenure:                   v.Tenure,
			AdminFee:                 money.SerializeMoney(v.AdminFee),
			FinancedAmount:           money.SerializeMoney(v.FinancedAmount),
			TotalAmount:              money.SerializeMoney(v.TotalAmount),
			AnnualInterestPercentage: v.AnnualInterestPercentage,
			InterestRatePerTenure:    v.InterestRatePerTenure,
			DownPayment:              money.SerializeMoney(v.DownPayment),
			MonthlyInstalment:        money.SerializeMoney(v.MonthlyInstalment),
			AnnualPercentageRate:     v.AnnualPercentageRate,
			FlatEffectiveRate:        v.FlatEffectiveRate,
		}
		details = append(details, &offerDetails)
	}
	response.OfferDetails = details

	return response, nil
}
