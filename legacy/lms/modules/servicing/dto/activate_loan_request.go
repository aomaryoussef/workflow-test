package dto

type ActivateLoanRequest struct {
	MerchantId                 string `mapstructure:"merchant_id" json:"merchant_id"`
	SelectedOfferId            string `mapstructure:"selected_offer_id" json:"selected_offer_id"`
	LoanApplicationId          string `mapstructure:"loan_application_id" json:"loan_application_id"`
	ConsumerId                 string `mapstructure:"consumer_id" json:"consumer_id"`
	ConsumerSingleRepaymentDay int    `mapstructure:"consumer_single_payment_day" json:"consumer_single_payment_day"`
	LoanApplicationBookingTime string `mapstructure:"booking_time" json:"booking_time"`
	CorrelationId              string `mapstructure:"correlation_id" json:"correlation_id"`
}
