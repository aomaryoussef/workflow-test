package dto

type FilterCommercialOfferRequest struct {
	SSN          string          `mapstructure:"ssn" json:"ssn"`
	OfferDetails []*OfferDetails `mapstructure:"offer_details" json:"offer_details"`
}
