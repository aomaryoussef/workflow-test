package domain

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/btechlabs/lms-lite/modules/ga/dto"
)

type IntegrationPointType string
type AccountType string

const (
	XXX_ToBeConfirmed                        = "XXX"
	DueIntegrationPoint IntegrationPointType = "Due"
	VendorAccountType   AccountType          = "Vendor"
)

type MerchantPayment struct {
	id        string
	createdAt time.Time

	// GA api fields
	requestNumber     string
	merchantAccountId string
	amount            int64
	transactionDate   time.Time
	invoiceDate       time.Time
	currency          string
	serialId          int

	// Ids of all transaction slips that are linked to this payment
	// Not sure if needed, and could also be represented somehow else, e.g. foreign key
	merchantTransactionSlipIds []string

	// Response from API
	response map[string]interface{}
}

func (m MerchantPayment) Id() string {
	return m.id
}
func (m MerchantPayment) MerchantAccountId() string {
	return m.merchantAccountId
}
func (m MerchantPayment) Amount() int64 {
	return m.amount
}
func (m MerchantPayment) TransactionDate() time.Time {
	return m.transactionDate
}
func (m MerchantPayment) InvoiceDate() time.Time {
	return m.invoiceDate
}
func (m MerchantPayment) SerialId() int {
	return m.serialId
}

// BUILDER

type MerchantPaymentBuilder struct {
	Id                         string                 `db:"id"`
	CreatedAt                  time.Time              `db:"created_at"`
	RequestNumber              string                 `db:"request_number"`
	MerchantAccountId          string                 `db:"merchant_account_id"`
	Amount                     int64                  `db:"amount"`
	TransactionDate            time.Time              `db:"transaction_date"`
	InvoiceDate                time.Time              `db:"invoice_date"`
	Currency                   string                 `db:"currency"`
	SerialId                   int                    `db:"serial_id"`
	MerchantTransactionSlipIds []string               `db:"merchant_transaction_slip_ids"`
	Response                   map[string]interface{} `db:"response"`
}

func NewMerchantPaymentBuilder() *MerchantPaymentBuilder {
	return &MerchantPaymentBuilder{}
}

func (m *MerchantPaymentBuilder) Build() MerchantPayment {
	return MerchantPayment{
		id:                         m.Id,
		createdAt:                  m.CreatedAt,
		requestNumber:              m.RequestNumber,
		merchantAccountId:          m.MerchantAccountId,
		amount:                     m.Amount,
		transactionDate:            m.TransactionDate,
		invoiceDate:                m.InvoiceDate,
		currency:                   m.Currency,
		serialId:                   m.SerialId,
		merchantTransactionSlipIds: m.MerchantTransactionSlipIds,
		response:                   m.Response,
	}
}

// PaymentStatus represents the possible payment statuses
type PaymentStatus string

func (ps PaymentStatus) String() string {
	return string(ps)
}

const (
	Created    PaymentStatus = "CREATED"
	InProgress PaymentStatus = "IN-PROGRESS"
	Paid       PaymentStatus = "PAID"
	Returned   PaymentStatus = "RETURNED"
)

func StringToPaymentStatus(status string) (PaymentStatus, error) {
	upperStatus := strings.ToUpper(status)

	switch PaymentStatus(upperStatus) {
	case Created, InProgress, Paid, Returned:
		return PaymentStatus(upperStatus), nil
	default:
		return "", fmt.Errorf("%s is not a valid payment status", status)
	}
}

type UpdateDisbursementStatusInput struct {
	MerchantPaymentId int
	Status            PaymentStatus
	StatusTimestamp   time.Time
}

func MapUpdateDisbursementStatusRequestToInput(req *dto.UpdateDisbursementStatusRequest) (*UpdateDisbursementStatusInput, error) {
	// decode incoming id from expected format of INV-000000001 to 1
	re := regexp.MustCompile("[0-9]+")
	ids := re.FindAllString(req.MerchantPaymentId, 1)
	if len(ids) != 1 {
		err := fmt.Errorf("Malformed invoice id (expected 'INV-000000001', got %s)", req.MerchantPaymentId)
		return nil, err
	}
	id, err := strconv.Atoi(ids[0])
	if err != nil {
		err := fmt.Errorf("Malformed invoice id (expected 'INV-000000001', got %s)", req.MerchantPaymentId)
		return nil, err
	}

	disbursementStatus, err := StringToPaymentStatus(req.Status)
	if err != nil {
		return nil, err
	}
	return &UpdateDisbursementStatusInput{
		MerchantPaymentId: id,
		Status:            disbursementStatus,
		StatusTimestamp:   req.StatusTimestamp,
	}, nil
}
