package dto

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/btechlabs/lms-lite/pkg/uid"

	"github.com/btechlabs/lms-lite/pkg/money"
)

// Define CollectionMethod type and constants
type CollectionMethod string

var CollectionMethods = []CollectionMethod{"BTECH_STORE_CASH", "BTECH_STORE_POS", "FAWRY"}

type RepayLoanRequest struct {
	PaymentReferenceId         string
	BillingAccount             string
	BillingAccountScheduleId   *uint64
	CollectedAsEarlySettlement bool
	BookingTime                time.Time
	PaidAmountUnits            money.Money
	PaidAmountCurrency         money.Currency
	CollectionMethod           CollectionMethod
}

func (c *RepayLoanRequest) Validate() (err error) {

	if strings.TrimSpace(c.PaymentReferenceId) == "" {
		return errors.New("payment reference id is required")
	}

	if strings.TrimSpace(c.BillingAccount) == "" {
		return errors.New("billing account is required")
	}
	if !uid.IsValidUUIDV4(c.BillingAccount) {
		return errors.New(fmt.Sprintf("billing account must be uuid format only current value: %s", c.BillingAccount))
	}

	billingAccountScheduleId := c.BillingAccountScheduleId
	if c.BillingAccountScheduleId != nil && *billingAccountScheduleId <= uint64(0) {
		return errors.New("billing account schedule id must be positive")
	}

	if c.BookingTime.IsZero() || c.BookingTime.After(time.Now().UTC()) {
		return errors.New("booking time is required and must be in the past")
	}

	if c.PaidAmountUnits.Units() == 0 {
		return errors.New("paid amount units must be positive")
	}

	if c.BillingAccountScheduleId == nil && !c.CollectedAsEarlySettlement {
		return errors.New("billing account schedule id is required when not collected as early settlement")
	}

	if c.BillingAccountScheduleId != nil && c.CollectedAsEarlySettlement {
		return errors.New("billing account schedule id must be nil when collected as early settlement")
	}

	return nil
}
