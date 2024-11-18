package dto

type OpenMerchantAccountRequest struct {
	MerchantId string `json:"merchant_id" mapstructure:"merchant_id"`
}
