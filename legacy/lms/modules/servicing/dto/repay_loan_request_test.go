package dto

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestRepayLoanRequestValidate(t *testing.T) {
	t.Run("should return error when payment reference id is empty", func(t *testing.T) {
		request := RepayLoanRequest{
			PaymentReferenceId: "",
		}
		err := request.Validate()
		if err == nil {
			t.Error("expected error but got nil")
		}
	})

	t.Run("should return error when payment reference id is not alphanumeric", func(t *testing.T) {
		request := RepayLoanRequest{
			PaymentReferenceId: "123-abc",
		}
		err := request.Validate()
		if err == nil {
			t.Error("expected error but got nil")
		}
	})

	t.Run("should return error when billing account is empty", func(t *testing.T) {
		request := RepayLoanRequest{
			PaymentReferenceId: "123",
			BillingAccount:     "",
		}
		err := request.Validate()
		if err == nil {
			t.Error("expected error but got nil")
		}
	})

	t.Run("should return error when billing account is not uuid", func(t *testing.T) {
		accountScheduleId := uint64(1)
		request := RepayLoanRequest{
			PaymentReferenceId:       "123",
			BillingAccount:           "123",
			BillingAccountScheduleId: &accountScheduleId,
		}
		err := request.Validate()
		if err == nil {
			t.Error("expected error but got nil")
		}
	})

	t.Run("should not return error when billing account is uuid", func(t *testing.T) {
		accountScheduleId := uint64(1)
		request := RepayLoanRequest{
			PaymentReferenceId:       "123",
			BillingAccount:           "123e4567-e89b-12d3-a456-426614174000",
			BillingAccountScheduleId: &accountScheduleId,
			BookingTime:              time.Now().UTC().AddDate(0, 0, -1),
			PaidAmountUnits:          *money.NewMoney(77000),
		}
		err := request.Validate()
		if err != nil {
			t.Errorf("expected nil but got %v", err)
		}
	})

	t.Run("should return error no account schedule id is present and not marked as early settlement", func(t *testing.T) {
		request := RepayLoanRequest{
			PaymentReferenceId: "123",
			BillingAccount:     "123e4567-e89b-12d3-a456-426614174000",
			BookingTime:        time.Now().UTC().AddDate(0, 0, -1),
			PaidAmountUnits:    *money.NewMoney(77000),
		}
		err := request.Validate()
		if err == nil {
			t.Error("expected error but got nil")
		}
		assert.Equal(t, "billing account schedule id is required when not collected as early settlement", err.Error())
	})

	t.Run("should return error account schedule id is present and also marked as early settlement", func(t *testing.T) {
		accountScheduleId := uint64(1)
		request := RepayLoanRequest{
			PaymentReferenceId:         "123",
			BillingAccount:             "123e4567-e89b-12d3-a456-426614174000",
			BillingAccountScheduleId:   &accountScheduleId,
			CollectedAsEarlySettlement: true,
			BookingTime:                time.Now().UTC().AddDate(0, 0, -1),
			PaidAmountUnits:            *money.NewMoney(77000),
		}
		err := request.Validate()
		if err == nil {
			t.Error("expected error but got nil")
		}
		assert.Equal(t, "billing account schedule id must be nil when collected as early settlement", err.Error())
	})
}
