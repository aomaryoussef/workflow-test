package domain

import (
	"time"

	financialProductDomain "github.com/btechlabs/lms-lite/modules/financialproduct/domain"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/btechlabs/lms-lite/pkg/uid"
)

type LoanBuilder struct {
	Id                      string
	ConsumerId              string
	FinancialProductKey     string
	FinancialProductVersion string
	CorrelationId           string
	MerchantGlobalId        string
	Statuses                []LoanStatus
	BookedAtUTC             time.Time
	CreatedAtUTC            time.Time
	PaymentSchedule         LoanPaymentSchedule
	CommercialOfferId       string
	AdminFee                *money.Money
}

func NewLoanBuilderFromLoanApplication(
	merchantGlobalId string,
	consumerId string,
	bookingTimeUTC time.Time,
	cid string,
	co *CommercialOffer,
	as *financialProductDomain.AmmortizationSchedule) *LoanBuilder {

	loanId := uid.NewUUID()
	now := time.Now().UTC()

	loanBuilder := &LoanBuilder{
		Id:                      loanId,
		BookedAtUTC:             bookingTimeUTC,
		FinancialProductVersion: co.FinancialProductVersion,
		FinancialProductKey:     co.FinancialProductKey,
		CorrelationId:           cid,
		MerchantGlobalId:        merchantGlobalId,
		Statuses:                make([]LoanStatus, 0),
		CreatedAtUTC:            now,
		ConsumerId:              consumerId,
		PaymentSchedule: LoanPaymentSchedule{
			lineItems: make([]LoanPaymentScheduleLineItem, 0),
		},
		CommercialOfferId: co.Id,
		AdminFee:          co.AdminFee,
	}

	loanBuilder.Statuses = append(loanBuilder.Statuses, LoanStatus{
		statusType:   LoanStatusActive,
		createdAtUTC: now,
	})

	for _, aSchedule := range as.PaymentSchedule {
		ps := LoanPaymentScheduleLineItem{
			loanId:                loanId,
			instalmentDueDateUTC:  aSchedule.InstalmentDueDateUTC,
			loanBalance:           aSchedule.LoanBalance,
			interestDue:           aSchedule.InterestDue,
			principalDue:          aSchedule.PrincipalDue,
			gracePeriodEndDateUTC: aSchedule.GracePeriodEndDateUTC,
		}
		loanBuilder.PaymentSchedule.lineItems = append(loanBuilder.PaymentSchedule.lineItems, ps)
	}

	return loanBuilder
}

func (b *LoanBuilder) AddScheduleEntry(
	id uint64,
	dueDate time.Time,
	gracePeriodEndDateUTC time.Time,
	paidDateUTC *time.Time,
	loanBalance uint64,
	principalDue uint64,
	interestDue uint64,
	paidPrincipal *uint64,
	paidInterest *uint64,
	paidLateFee *uint64,
	dueLateFee *uint64,
	updatedAt *time.Time,
	updatedBy *string,
	refId *string,
	isCancelled bool,
) *LoanBuilder {
	if b.PaymentSchedule.lineItems == nil {
		b.PaymentSchedule.lineItems = make([]LoanPaymentScheduleLineItem, 0)
	}

	found := false
	for _, l := range b.PaymentSchedule.lineItems {
		if l.id == id {
			found = true
		}
	}
	if !found {
		b.PaymentSchedule.lineItems = append(b.PaymentSchedule.lineItems, LoanPaymentScheduleLineItem{
			id:                    id,
			loanId:                b.Id,
			instalmentDueDateUTC:  dueDate,
			loanBalance:           *money.NewMoney(loanBalance),
			principalDue:          *money.NewMoney(principalDue),
			interestDue:           *money.NewMoney(interestDue),
			lateFeeDue:            *money.NewMoney(derefOrZero(dueLateFee)),
			paidDateUTC:           paidDateUTC,
			gracePeriodEndDateUTC: gracePeriodEndDateUTC,
			paidPrincipal:         money.NewMoney(derefOrZero(paidPrincipal)),
			paidInterest:          money.NewMoney(derefOrZero(paidInterest)),
			paidLateFee:           money.NewMoney(derefOrZero(paidLateFee)),
			updatedAt:             updatedAt,
			updatedBy:             updatedBy,
			refId:                 refId,
			isCancelled:           isCancelled,
		})
	}

	return b
}

func (b *LoanBuilder) AddStatus(statusType LoanStatusType, createdAt time.Time) *LoanBuilder {
	if b.Statuses == nil {
		b.Statuses = make([]LoanStatus, 0)
	}

	found := false
	for _, s := range b.Statuses {
		if s.statusType == statusType && s.createdAtUTC.Equal(createdAt) {
			found = true
		}
	}
	if !found {
		b.Statuses = append(b.Statuses, LoanStatus{
			statusType:   statusType,
			createdAtUTC: createdAt,
		})
	}

	return b
}

func (b *LoanBuilder) Build() (*Loan, error) {

	loan := &Loan{
		id:                                b.Id,
		createdAtUTC:                      b.CreatedAtUTC,
		createdBy:                         "TODO", // This needs to come from access token
		correlationId:                     b.CorrelationId,
		merchantGlobalId:                  b.MerchantGlobalId,
		statuses:                          b.Statuses,
		paymentSchedule:                   b.PaymentSchedule,
		consumerId:                        b.ConsumerId,
		financialProductVersion:           b.FinancialProductVersion,
		financialProductKey:               b.FinancialProductKey,
		bookedAt:                          b.BookedAtUTC,
		commercialOfferId:                 b.CommercialOfferId,
		adminFee:                          b.AdminFee,
		earlySettlementPercentBasisPoints: EarlySettlementFeePercentageBasisPoints,
	}

	err := loan.validate()
	if err != nil {
		return nil, err
	}
	return loan, nil
}

func derefOrZero(v *uint64) uint64 {
	if v == nil {
		return 0
	}
	return *v
}

type MerchantLoanBuilder struct {
	*LoanBuilder
	PaymentStatus     string
	TransactionStatus string
	TransactionId     string
}

func (b *MerchantLoanBuilder) AddPaymentStatus(paymentStatus string) *MerchantLoanBuilder {
	b.PaymentStatus = paymentStatus
	return b
}
func (b *MerchantLoanBuilder) AddTransactionStatus(transactionStatus string) *MerchantLoanBuilder {
	b.TransactionStatus = transactionStatus
	return b
}

func (b *MerchantLoanBuilder) AddTransactionId(transactionId string) *MerchantLoanBuilder {
	b.TransactionId = transactionId
	return b
}

func (b *MerchantLoanBuilder) Build() (*MerchantLoan, error) {
	loan, err := b.LoanBuilder.Build()
	if err != nil {
		return nil, err
	}
	merchantLoan := &MerchantLoan{
		Loan:              loan,
		transactionStatus: b.TransactionStatus,
		paymentStatus:     b.PaymentStatus,
		transactionId:     b.TransactionId,
	}

	return merchantLoan, nil
}
