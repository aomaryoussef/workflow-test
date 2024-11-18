package domain

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
)

// Define CollectionMethod type and constants
type CollectionMethod string

const (
	BTECH_STORE_CASH CollectionMethod = "BTECH_STORE_CASH"
	BTECH_STORE_POS  CollectionMethod = "BTECH_STORE_POS"
	FAWRY            CollectionMethod = "FAWRY"
)

type ConsumerCollectionToTreasury struct {
	PaymentReferenceId string
	BookingTime        time.Time
	PaidAmountUnits    uint64
	PaidAmountCurrency money.Currency
	Metadata           map[string]interface{} `json:"metadata"`
	CollectionMethod   CollectionMethod       `json:"collection_method"`
}

func (c *ConsumerCollectionToTreasury) SetBookingTime(t time.Time) {
	// Convert the time to UTC
	c.BookingTime = t.UTC()
}

type ConsumerCollectionBTechStoreChannel struct {
	PaymentReferenceId string
	BillingAccount     string
	BookingTime        time.Time
	PaidAmountUnits    uint64
	PaidAmountCurrency money.Currency
	CollectionStoreId  string
	CollectedBy        string
	PaymentMethod      string
}

type ConsumerCollectionFawryChannel struct {
	PaymentReferenceId string
	BillingAccount     string
	BookingTime        time.Time
	PaidAmountUnits    uint64
	PaidAmountCurrency money.Currency
}

type ConsumerCollection interface {
	Validate() error
}

func (c *ConsumerCollectionBTechStoreChannel) Validate() (err error) {
	is_uuid := func(s string) bool {
		return regexp.MustCompile(`^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$`).MatchString(s)
	}

	if strings.TrimSpace(c.PaymentReferenceId) == "" {
		return errors.New("payment reference id is required")
	}

	if strings.TrimSpace(c.BillingAccount) == "" {
		return errors.New("billing account is required")
	}
	if !is_uuid(strings.ToUpper(c.BillingAccount)) {
		return fmt.Errorf("billing account must be uuid format only current value: %s", c.BillingAccount)
	}

	if c.BookingTime.IsZero() || c.BookingTime.After(time.Now().UTC()) {
		return errors.New("booking time is required and must be in the past")
	}

	if c.PaidAmountUnits <= 0 {
		return errors.New("paid amount units must be positive")
	}

	if strings.TrimSpace(c.CollectionStoreId) == "" {
		return errors.New("collection store id is required")
	}

	if strings.TrimSpace(c.CollectedBy) == "" {
		return errors.New("collected by is required")
	}

	return nil
}

func (c *ConsumerCollectionFawryChannel) Validate() (err error) {
	is_uuid := func(s string) bool {
		return regexp.MustCompile(`^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$`).MatchString(s)
	}

	if strings.TrimSpace(c.PaymentReferenceId) == "" {
		return errors.New("payment reference id is required")
	}

	if strings.TrimSpace(c.BillingAccount) == "" {
		return errors.New("billing account is required")
	}
	if !is_uuid(strings.ToUpper(c.BillingAccount)) {
		return fmt.Errorf("billing account must be uuid format only current value: %s", c.BillingAccount)
	}

	if c.BookingTime.IsZero() || c.BookingTime.After(time.Now().UTC()) {
		return errors.New("booking time is required and must be in the past")
	}

	if c.PaidAmountUnits <= 0 {
		return errors.New("paid amount units must be positive")
	}

	return nil
}

func (c *ConsumerCollectionToTreasury) Validate() (err error) {
	if strings.TrimSpace(c.PaymentReferenceId) == "" {
		return errors.New("payment reference id is required")
	}

	if c.BookingTime.IsZero() || c.BookingTime.After(time.Now().UTC()) {
		return errors.New("booking time is required and must be in the past")
	}

	if c.PaidAmountUnits <= 0 {
		return errors.New("paid amount units must be positive")
	}

	return nil
}
