package domain

import (
	"fmt"
	"time"

	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/btechlabs/lms-lite/pkg/uid"
)

type MerchantTransactionSlip struct {
	id                       string
	loanId                   string
	orderNumber              string
	merchantAccountId        string
	payableAmount            money.Money
	bookingTime              time.Time
	narrationComment         string
	createdAt                time.Time
	updatedAt                time.Time
	cancelledForDisbursement bool
}

func NewMerchantTransactionSlip(ltr dto.LoanTransactionRequest) MerchantTransactionSlip {
	loanMoney := ltr.LoanAmountMoney()
	return MerchantTransactionSlip{
		id:                       uid.NewUUID(),
		loanId:                   ltr.LoanId,
		orderNumber:              ltr.OrderNumber,
		merchantAccountId:        ltr.MerchantAccountId,
		payableAmount:            loanMoney,
		bookingTime:              ltr.BookingTime,
		narrationComment:         fmt.Sprintf("Merchant disbursement slip for EGP: %d.%d", loanMoney.Units()/100, loanMoney.Units()%100),
		createdAt:                time.Now().UTC(),
		updatedAt:                time.Now().UTC(),
		cancelledForDisbursement: false,
	}
}

func (m *MerchantTransactionSlip) Id() string {
	return m.id
}

func (m *MerchantTransactionSlip) LoanId() string {
	return m.loanId
}

func (m *MerchantTransactionSlip) OrderNumber() string {
	return m.orderNumber
}

func (m *MerchantTransactionSlip) MerchantAccountId() string {
	return m.merchantAccountId
}

func (m *MerchantTransactionSlip) PayableAmount() money.Money {
	return m.payableAmount
}

func (m *MerchantTransactionSlip) BookingTime() time.Time {
	return m.bookingTime
}

func (m *MerchantTransactionSlip) NarrationComment() string {
	return m.narrationComment
}

func (m *MerchantTransactionSlip) CreatedAt() time.Time {
	return m.createdAt
}

func (m *MerchantTransactionSlip) UpdatedAt() time.Time {
	return m.updatedAt
}

func (m *MerchantTransactionSlip) IsCancelledForDisbursement() bool {
	return m.cancelledForDisbursement
}

func (m *MerchantTransactionSlip) CancelForDisbursement() {
	m.cancelledForDisbursement = true
}

// BUILDER

type MerchantTransactionSlipBuilder struct {
	Id                       string    `db:"id"`
	LoanId                   string    `db:"loan_id"`
	MerchantAccountId        string    `db:"merchant_account_id"`
	CreatedAt                time.Time `db:"created_at"`
	UpdatedAt                time.Time `db:"updated_at"`
	CancelledForDisbursement bool      `db:"cancelled_for_disbursement"`
}

func NewMerchantTransactionSlipBuilder() *MerchantTransactionSlipBuilder {
	return &MerchantTransactionSlipBuilder{}
}

func (m *MerchantTransactionSlipBuilder) Build() MerchantTransactionSlip {
	return MerchantTransactionSlip{
		id:                       m.Id,
		loanId:                   m.LoanId,
		merchantAccountId:        m.MerchantAccountId,
		createdAt:                m.CreatedAt,
		updatedAt:                m.UpdatedAt,
		cancelledForDisbursement: m.CancelledForDisbursement,
	}
}
