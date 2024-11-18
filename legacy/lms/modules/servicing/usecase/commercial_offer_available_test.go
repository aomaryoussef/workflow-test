package usecase

import (
	"github.com/btechlabs/lms-lite/pkg/money"
	"testing"
)

func TestIsCommercialOfferAvailable(t *testing.T) {
	testcases := []struct {
		name                      string
		totalAvailableCreditLimit money.Money
		principalAmount           money.Money
		minDownPayment            money.Money
		maxDownPayment            money.Money
		want                      commercialOfferAvailability
	}{
		{
			name:                      "when total available credit limit is greater than basket value, then tenor is available",
			totalAvailableCreditLimit: *money.NewMoney(10000_00),
			principalAmount:           *money.NewMoney(9000_00),
			minDownPayment:            *money.NewMoney(2000_00),
			maxDownPayment:            *money.NewMoney(5000_00),
			want:                      commercialOfferAvailability{rejected: false, rejectionReason: "", appliedDownPayment: *money.NewMoney(2000_00)},
		},
		{
			name:                      "when total available credit limit is greater than basket value, then tenor is available irrespective of min. downpayment",
			totalAvailableCreditLimit: *money.NewMoney(10000_00),
			principalAmount:           *money.NewMoney(9000_00),
			minDownPayment:            *money.NewMoney(0),
			maxDownPayment:            *money.NewMoney(1000_00),
			want:                      commercialOfferAvailability{rejected: false, rejectionReason: "", appliedDownPayment: *money.NewMoney(0)},
		},
		{
			name:                      "when total available credit limit is less than basket value, then tenor is available if difference is exactly min. downpayment",
			totalAvailableCreditLimit: *money.NewMoney(8000_00),
			principalAmount:           *money.NewMoney(9000_00),
			minDownPayment:            *money.NewMoney(1000_00),
			maxDownPayment:            *money.NewMoney(3000_00),
			want:                      commercialOfferAvailability{rejected: false, rejectionReason: "", appliedDownPayment: *money.NewMoney(1000_00)},
		},
		{
			name:                      "when total available credit limit is less than basket value, then tenor is available if difference is within max. downpayment",
			totalAvailableCreditLimit: *money.NewMoney(8000_00),
			principalAmount:           *money.NewMoney(9000_00),
			minDownPayment:            *money.NewMoney(500_00),
			maxDownPayment:            *money.NewMoney(1001_00),
			want:                      commercialOfferAvailability{rejected: false, rejectionReason: "", appliedDownPayment: *money.NewMoney(1000_00)},
		},
		{
			name:                      "when total available credit limit is less than basket value, then tenor is available if difference is exactly max. downpayment",
			totalAvailableCreditLimit: *money.NewMoney(8000_00),
			principalAmount:           *money.NewMoney(9000_00),
			minDownPayment:            *money.NewMoney(500_00),
			maxDownPayment:            *money.NewMoney(1000_00),
			want:                      commercialOfferAvailability{rejected: false, rejectionReason: "", appliedDownPayment: *money.NewMoney(1000_00)},
		},
		{
			name:                      "when total available credit limit is less than basket value, then tenor is not available if difference is greater than max. downpayment",
			totalAvailableCreditLimit: *money.NewMoney(5000_00),
			principalAmount:           *money.NewMoney(50000_00),
			minDownPayment:            *money.NewMoney(1000_00),
			maxDownPayment:            *money.NewMoney(5000_00),
			want:                      commercialOfferAvailability{rejected: true, rejectionReason: "difference in down payment: EGP 45000.00 is greater than the max down payment: EGP 5000.00", appliedDownPayment: *money.NewMoney(0)},
		},
	}

	for _, tc := range testcases {
		t.Run(tc.name, func(t *testing.T) {
			coa := commercialOfferAvailable(tc.totalAvailableCreditLimit, tc.principalAmount, tc.minDownPayment, tc.maxDownPayment)
			if coa.rejected != tc.want.rejected {
				t.Errorf("got offer rejected: %v; want %v", coa.rejected, tc.want.rejected)
			}
			if coa.rejected && coa.rejectionReason != tc.want.rejectionReason {
				t.Errorf("got rejection reason: %s; want %s", coa.rejectionReason, tc.want.rejectionReason)
			}
			if coa.appliedDownPayment.Units() != tc.want.appliedDownPayment.Units() {
				t.Errorf("got applied downpayment: %s; want %s", coa.appliedDownPayment.ReadableNotationWithCurrency(), tc.want.appliedDownPayment.ReadableNotationWithCurrency())
			}
		})
	}
}
