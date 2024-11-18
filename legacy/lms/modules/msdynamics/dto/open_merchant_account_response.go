package dto

type OpenMerchantAccountResponse struct {
	RequestNumber    string `json:"request_number" mapstructure:"request_number"`
	GlobalId         string `json:"global_id" mapstructure:"global_id"`
	GeneralAccountId string `json:"general_account_id" mapstructure:"general_account_id"`
}
