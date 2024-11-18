package dto

import (
	"time"
)

type UpdateDisbursementStatusRequest struct {
	MerchantPaymentId string    `mapstructure:"merchant_payment_id" json:"merchant_payment_id"`
	Status            string    `mapstructure:"status" json:"status"`
	StatusTimestamp   time.Time `mapstructure:"status_timestamp" json:"status_timestamp"`
}
