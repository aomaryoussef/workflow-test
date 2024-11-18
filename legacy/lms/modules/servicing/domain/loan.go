package domain

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"strconv"
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/samber/lo"
)

var (
	ErrInvalidPaymentScheduleId                  = errors.New("invalid payment schedule id")
	ErrRecurringPaymentRequestWithDifferentRefId = errors.New("cannot update payment details for schedule using multiple payment references")
	ErrRecurringPaymentRequestWithSameRefId      = errors.New("cannot update payment details for schedule using same payment reference")
	ErrPaidAmountIsNotSameAsDueAmount            = errors.New("paid amount is not same as due amount")
)

type LoanStatusType string

const (
	LoanStatusActive       LoanStatusType = "ACTIVE"        // Live loans
	LoanStatusCancelled    LoanStatusType = "CANCELLED"     // When the items returned to merchant by consumer the loan has to be cancelled
	LoanStatusDefaulted    LoanStatusType = "DEFAULTED"     // The status used when the debtor stopped making payments, the loan is still open and might move to CHARGED_OFF
	LoanStatusClosed       LoanStatusType = "CLOSED"        // Closed loans which happened naturally when the debtor paid all the dues
	LoanStatusChargedOff   LoanStatusType = "CHARGED_OFF"   // Meaning the creditor has written the account off as a loss, and the loan is closed to future charges
	LoanStatusEarlySettled LoanStatusType = "EARLY_SETTLED" // When the debtor pays the full amount due before the due date and closes the loan early
)

// TODO We will need a state machine to manage the loan status and their state changes
type Loan struct {
	id                                string
	correlationId                     string // This is the workflow ID that created this loan
	merchantGlobalId                  string
	consumerId                        string
	financialProductKey               string
	financialProductVersion           string
	statuses                          []LoanStatus
	bookedAt                          time.Time
	createdAtUTC                      time.Time
	createdBy                         string
	paymentSchedule                   LoanPaymentSchedule
	commercialOfferId                 string
	adminFee                          *money.Money
	earlySettlementPercentBasisPoints int
}

func SetLoanId(l *Loan, id string) {
	l.id = id
}

func SetLoanMerchantGlobalId(l *Loan, id string) {
	l.merchantGlobalId = id
}

func (l *Loan) Id() string {
	return l.id
}

func (l *Loan) ConsumerId() string {
	return l.consumerId
}

func (l *Loan) FinancialProductKey() string {
	return l.financialProductKey
}

func (l *Loan) FinancialProductVersion() string {
	return l.financialProductVersion
}

func (l *Loan) CorrelationId() string {
	return l.correlationId
}

func (l *Loan) BookedAt() time.Time {
	return l.bookedAt
}

func (l *Loan) CreatedAt() time.Time {
	return l.createdAtUTC
}

func (l *Loan) CreatedBy() string {
	return l.createdBy
}

func (l *Loan) CurrentStatus() LoanStatus {
	lastStatus := lo.MaxBy(l.statuses, func(a LoanStatus, b LoanStatus) bool {
		return a.createdAtUTC.After(b.createdAtUTC)
	})
	return lastStatus
}

func (l *Loan) PaymentSchedule() LoanPaymentSchedule {
	return l.paymentSchedule
}

func (l *Loan) CommercialOfferId() string {
	return l.commercialOfferId
}

func (l *Loan) AdminFee() *money.Money {
	return l.adminFee
}

func (l *Loan) MerchantId() string {
	return l.merchantGlobalId
}

func (l *Loan) BookPaymentForSchedule(
	ctx context.Context,
	id uint64,
	paymentReferenceId string,
	totalPaidAmount money.Money,
	bookingTime time.Time,
) (paymentScheduleItem *LoanPaymentScheduleLineItem, err error) {
	logger := logging.
		LogHandle.
		WithContext(ctx).
		WithFields(map[string]string{
			"loan_id":     l.id,
			"schedule_id": strconv.FormatUint(id, 10),
		})
	logger.Infof("received book payment request")

	paymentScheduleItem = l.paymentSchedule.GetScheduleLineItem(id)
	if paymentScheduleItem == nil {
		errMsg := fmt.Sprintf("no payment schedule: %d found for loan: %s", id, l.id)
		logger.Error(errMsg)
		err = errors.Join(ErrInvalidPaymentScheduleId, errors.New(errMsg))
		return
	}
	if paymentScheduleItem.IsCancelled() {
		errMsg := fmt.Sprintf("schedule: %d for loan: %s is already cancelled", id, l.id)
		logger.Error(errMsg)
		err = errors.New(errMsg)
		return
	}

	remainingPaidAmount := money.NewMoney(totalPaidAmount.Units())
	totalAmountDue := money.NewMoney(0)
	totalAmountDue = totalAmountDue.
		AddMoney(&paymentScheduleItem.principalDue).
		AddMoney(&paymentScheduleItem.interestDue).
		AddMoney(&paymentScheduleItem.lateFeeDue)
	if totalAmountDue.Ne(&totalPaidAmount) {
		errMsg := fmt.Sprintf("schedule: %d for loan: %s - paid amount: %s is not exactly same as due amount: %s",
			id,
			l.id,
			totalPaidAmount.ReadableNotationWithCurrency(),
			totalAmountDue.ReadableNotationWithCurrency(),
		)
		logger.Error(errMsg)
		err = errors.Join(ErrPaidAmountIsNotSameAsDueAmount, errors.New(errMsg))
		return nil, err
	}

	// We need to have this function as idempotent
	// Therefore we look for the schedule if paid or not
	// and paid by which reference.
	// And if it is paid, we ensure the incoming refId
	// is the same as the one in the schedule
	if !paymentScheduleItem.IsCancelled() && paymentScheduleItem.IsPaid() {
		if paymentScheduleItem.PaidByRefId(paymentReferenceId) {
			errMsg := fmt.Sprintf("already paid schedule: %d for loan: %s with same payment reference: %s", id, l.id, paymentReferenceId)
			logger.Info(errMsg)
			return paymentScheduleItem, errors.Join(ErrRecurringPaymentRequestWithSameRefId, errors.New(errMsg))
		} else {
			errMsg := fmt.Sprintf("already paid schedule: %d for loan: %s with different payment reference: %s", id, l.id, paymentReferenceId)
			logger.Error(errMsg)
			err = errors.Join(ErrRecurringPaymentRequestWithDifferentRefId, errors.New(errMsg))
			return nil, err
		}
	}

	// Late Fee Booking
	// We prioritise repaying lateFee over interest+principal
	// Logic:
	// 1. Ensure that remainingAmount is at least greater than late fees (late fee to be paid in full)
	// 2. Book the late fee
	// 3. Decrease the remaining amount
	lateFeeDue := paymentScheduleItem.LateFeeDue()
	lateFeePaid := paymentScheduleItem.PaidLateFee()
	logger.Infof("booking late fee due: %s against remaining amount: %s",
		lateFeeDue.ReadableNotationWithCurrency(),
		remainingPaidAmount.ReadableNotationWithCurrency(),
	)
	lateFeeRemaining := money.NewMoney(lateFeeDue.Units() - lateFeePaid.UnitsOrZero())
	if remainingPaidAmount.Lt(lateFeeRemaining) {
		errMsg := fmt.Sprintf(
			"total remaining amount: %s is less than remaining due late fees: %s",
			remainingPaidAmount.ReadableNotationWithCurrency(),
			lateFeeRemaining.ReadableNotationWithCurrency(),
		)
		logger.Error(errMsg)
		err = errors.Join(ErrPaidAmountIsNotSameAsDueAmount, errors.New(errMsg))
		return nil, err
	}
	paymentScheduleItem.paidLateFee = lateFeeRemaining
	remainingPaidAmount, err = remainingPaidAmount.SubMoney(lateFeeRemaining)
	if err != nil {
		err = fmt.Errorf(
			"decreasing the late fee from remaining amount resulted into negative balance, should not have happened: %s",
			err.Error(),
		)
		return nil, err
	}

	// Interest Fee Booking
	// We prioritise repaying interest over principal
	// Logic:
	// 1. Ensure that remainingAmount is at least greater than interest fees (interest fee to be paid in full)
	// 2. Book the interest fee
	// 3. Decrease the remaining amount
	interestFeeDue := paymentScheduleItem.InterestDue()
	interestFeePaid := paymentScheduleItem.PaidInterest()
	logger.Infof("booking interest fee due: %s against remaining amount: %s",
		interestFeeDue.ReadableNotationWithCurrency(),
		remainingPaidAmount.ReadableNotationWithCurrency(),
	)
	interestFeeRemaining := money.NewMoney(interestFeeDue.Units() - interestFeePaid.UnitsOrZero())
	if remainingPaidAmount.Lt(interestFeeRemaining) {
		errMsg := fmt.Sprintf(
			"total remaining amount: %s is less than remaining due interest fees: %s",
			remainingPaidAmount.ReadableNotationWithCurrency(),
			interestFeeRemaining.ReadableNotationWithCurrency(),
		)
		logger.Error(errMsg)
		err = errors.Join(ErrPaidAmountIsNotSameAsDueAmount, errors.New(errMsg))
		return nil, err
	}
	paymentScheduleItem.paidInterest = interestFeeRemaining
	remainingPaidAmount, err = remainingPaidAmount.SubMoney(interestFeeRemaining)
	if err != nil {
		err = fmt.Errorf(
			"decreasing the interest fee from remaining amount resulted into negative balance, should not have happened: %s",
			err.Error(),
		)
		return nil, err
	}

	// Principal Fee Booking
	// We take the principal last
	// Logic:
	// 1. Ensure that remainingAmount is at least equal to principal amount (principal to be paid in full)
	// 2. Book the principal fee
	// 3. Decrease the remaining amount
	principalFeeDue := paymentScheduleItem.PrincipalDue()
	principalFeePaid := paymentScheduleItem.PaidPrincipal()
	logger.Infof("booking principal fee due: %s against remaining amount: %s",
		principalFeeDue.ReadableNotationWithCurrency(),
		remainingPaidAmount.ReadableNotationWithCurrency(),
	)
	principalFeeRemaining := money.NewMoney(principalFeeDue.Units() - principalFeePaid.UnitsOrZero())
	if remainingPaidAmount.Lt(principalFeeRemaining) {
		errMsg := fmt.Sprintf(
			"total remaining amount: %s is less than the remaining principal fees: %s",
			remainingPaidAmount.ReadableNotationWithCurrency(),
			principalFeeRemaining.ReadableNotationWithCurrency(),
		)
		logger.Error(errMsg)
		err = errors.Join(ErrPaidAmountIsNotSameAsDueAmount, errors.New(errMsg))
		return nil, err
	}
	paymentScheduleItem.paidPrincipal = principalFeeRemaining
	remainingPaidAmount, err = remainingPaidAmount.SubMoney(principalFeeRemaining)
	if err != nil {
		err = fmt.Errorf(
			"decreasing the principal fee from remaining amount resulted into negative balance, should not have happened: %s",
			err.Error(),
		)
		return nil, err
	}

	// Now we ensure that the remaining amount is zero
	if remainingPaidAmount.Units() != 0 {
		errMsg := fmt.Sprintf(
			"remaining amount is not zero after booking all the dues, remaining amount: %s",
			remainingPaidAmount.ReadableNotationWithCurrency(),
		)
		err = errors.Join(ErrPaidAmountIsNotSameAsDueAmount, errors.New(errMsg))
		return nil, err
	}

	paymentScheduleItem.paidDateUTC = &bookingTime
	paymentScheduleItem.refId = &paymentReferenceId
	return paymentScheduleItem, nil
}

func (l *Loan) GenerateEarlySettlementSchedule(bookingTime time.Time, refId string) (paymentScheduleItem LoanPaymentScheduleLineItem) {
	earlySettlementDetails := l.EarlySettlementDetails()
	lineItem := LoanPaymentScheduleLineItem{
		loanId:                l.id,
		refId:                 &refId,
		instalmentDueDateUTC:  bookingTime,
		gracePeriodEndDateUTC: bookingTime,
		lateFeeDue:            *money.NewMoney(0),
		interestDue:           *money.NewMoney(earlySettlementDetails.EarlySettlementFeesDue.UnitsOrZero()),
		principalDue:          *money.NewMoney(earlySettlementDetails.EarlySettlementPrincipalDue.UnitsOrZero()),
		loanBalance:           *money.NewMoney(earlySettlementDetails.EarlySettlementTotalAmountDue().UnitsOrZero()),
		paidLateFee:           money.NewMoney(0),
		paidInterest:          money.NewMoney(earlySettlementDetails.EarlySettlementFeesDue.UnitsOrZero()),
		paidPrincipal:         money.NewMoney(earlySettlementDetails.EarlySettlementPrincipalDue.UnitsOrZero()),
		paidDateUTC:           &bookingTime,
		isCancelled:           false,
	}
	l.paymentSchedule.lineItems = append(l.paymentSchedule.lineItems, lineItem)

	return lineItem
}

func (l *Loan) validate() error {
	// TODO add validations
	return nil
}

type LoanStatus struct {
	statusType   LoanStatusType
	createdAtUTC time.Time
	// TODO Omitting the audit data around who added the status
}

func (ls *LoanStatus) StatusType() LoanStatusType {
	return ls.statusType
}
func (ls *LoanStatus) CreatedAtUTC() time.Time {
	return ls.createdAtUTC
}

func (l *Loan) Statuses() []LoanStatus {
	return l.statuses
}

type MerchantLoan struct {
	*Loan
	paymentStatus     string
	transactionStatus string
	transactionId     string
}

func (ml *MerchantLoan) TransactionStatus() string {
	return ml.transactionStatus
}

func (ml *MerchantLoan) PaymentStatus() string {
	return ml.paymentStatus
}

func (ml *MerchantLoan) TransactionId() string {
	return ml.transactionId
}
