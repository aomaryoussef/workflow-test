package dto

import "fmt"

type FilterCommercialOfferResponse struct {
	Status          string          `json:"status"`
	RejectionReason string          `json:"rejection_reason"`
	OffersDetails   []*OfferDetails `json:"offer_details"`
}

type FilterCommercialOfferWorkerOutput struct {
	OffersDetails []*OfferDetails `json:"offer_details"`
}

func MapDomainToWorkerOutput(response *FilterCommercialOfferResponse) (*FilterCommercialOfferWorkerOutput, error) {
	if response == nil {
		return nil, fmt.Errorf("response cannot be nil")
	}
	return &FilterCommercialOfferWorkerOutput{
		OffersDetails: response.OffersDetails,
	}, nil
}
