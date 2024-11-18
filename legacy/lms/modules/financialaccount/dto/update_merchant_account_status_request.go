package dto

type UpdateMerchantAccountStatusRequest struct {
	MerchantId string        `json:"merchant_id" mapstructure:"merchant_id"`
	Status     AccountStatus `json:"status" mapstructure:"status"`
}
