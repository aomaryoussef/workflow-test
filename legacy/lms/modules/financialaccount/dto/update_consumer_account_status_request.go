package dto

type UpdateConsumerAccountStatusRequest struct {
	ConsumerId string        `json:"consumer_id" mapstructure:"consumer_id"`
	Status     AccountStatus `json:"status" mapstructure:"status"`
}
