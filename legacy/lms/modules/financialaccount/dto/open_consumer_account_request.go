package dto

type OpenConsumerAccountRequest struct {
	ConsumerId string `json:"consumer_id" mapstructure:"consumer_id"`
}
