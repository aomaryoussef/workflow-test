package domain

import (
	"slices"
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
)

type LoanPaymentSchedule struct {
	lineItems []LoanPaymentScheduleLineItem
}

func (lps *LoanPaymentSchedule) CancelAllUnpaidSchedules(bookingTime time.Time, updatedBy string) (updatedItems []LoanPaymentScheduleLineItem) {
	updatedItems = make([]LoanPaymentScheduleLineItem, 0)
	for _, schedule := range lps.lineItems {
		if !schedule.IsCancelled() && schedule.IsPaid() {
			continue
		}
		schedule.isCancelled = true
		schedule.updatedAt = &bookingTime
		schedule.updatedBy = &updatedBy
		updatedItems = append(updatedItems, schedule)
	}
	return updatedItems
}

func (lps *LoanPaymentSchedule) ScheduleNumberInLoan(scheduleId uint64) int {
	slices.SortFunc(lps.lineItems, func(a, b LoanPaymentScheduleLineItem) int {
		isABeforeB := a.InstalmentDueDateUTC().Before(b.InstalmentDueDateUTC())
		if isABeforeB {
			return -1
		} else {
			return 1
		}
	})
	for index, schedule := range lps.lineItems {
		if schedule.Id() == scheduleId {
			return index + 1
		}
	}
	return -1
}

func (lps *LoanPaymentSchedule) IsScheduleLineItemPaid(scheduleId uint64) bool {
	for i := 0; i < len(lps.lineItems); i++ {
		if lps.lineItems[i].Id() == scheduleId &&
			!lps.lineItems[i].IsCancelled() &&
			lps.lineItems[i].IsPaid() {
			return true
		}
	}
	return false
}

func (lps *LoanPaymentSchedule) GetScheduleLineItem(scheduleId uint64) *LoanPaymentScheduleLineItem {
	for _, schedule := range lps.lineItems {
		if schedule.Id() == scheduleId {
			return &schedule
		}
	}
	return nil
}

func (lps *LoanPaymentSchedule) IsAnySchedulePaid() bool {
	for _, schedule := range lps.lineItems {
		if !schedule.IsCancelled() && schedule.IsPaid() {
			return true
		}
	}
	return false
}

func (lps *LoanPaymentSchedule) TotalDue() *money.Money {
	totalDue := uint64(0)
	for _, schedule := range lps.lineItems {
		if !schedule.IsCancelled() && !schedule.IsPaid() {
			duePrincipal := schedule.PrincipalDue()
			dueInterest := schedule.InterestDue()
			dueLateFee := schedule.LateFeeDue()
			totalDue += duePrincipal.UnitsOrZero() +
				dueInterest.UnitsOrZero() +
				dueLateFee.UnitsOrZero()
		}
	}
	return money.NewMoney(totalDue)
}

func (lps *LoanPaymentSchedule) PrincipalDue() *money.Money {
	totalPrincipalDue := uint64(0)
	for _, schedule := range lps.lineItems {
		if !schedule.IsCancelled() && !schedule.IsPaid() {
			duePrincipal := schedule.PrincipalDue()
			totalPrincipalDue += duePrincipal.UnitsOrZero()
		}
	}
	return money.NewMoney(totalPrincipalDue)
}

func (lps *LoanPaymentSchedule) InterestDue() *money.Money {
	totalInterestDue := uint64(0)
	for _, schedule := range lps.lineItems {
		if !schedule.IsCancelled() && !schedule.IsPaid() {
			interestDue := schedule.InterestDue()
			totalInterestDue += interestDue.UnitsOrZero()
		}
	}
	return money.NewMoney(totalInterestDue)
}

func (lps *LoanPaymentSchedule) LineItems() []LoanPaymentScheduleLineItem {
	return lps.lineItems
}

type LoanPaymentScheduleLineItem struct {
	id                    uint64       `db:"id"`
	loanId                string       `db:"loan_id"`
	instalmentDueDateUTC  time.Time    `db:"due_date"`
	loanBalance           money.Money  `db:"loan_balance"`
	gracePeriodEndDateUTC time.Time    `db:"grace_period_end_date"`
	paidDateUTC           *time.Time   `db:"paid_date"`
	principalDue          money.Money  `db:"due_principal"`
	interestDue           money.Money  `db:"due_interest"`
	lateFeeDue            money.Money  `db:"due_late_fee"`
	paidPrincipal         *money.Money `db:"paid_principal"`
	paidInterest          *money.Money `db:"paid_interest"`
	paidLateFee           *money.Money `db:"paid_late_fee"`
	refId                 *string      `db:"ref_id"`
	updatedAt             *time.Time   `db:"updated_at"`
	updatedBy             *string      `db:"updated_by"`
	isCancelled           bool         `db:"is_cancelled"`
}

func (l LoanPaymentScheduleLineItem) InstalmentDueDateUTC() time.Time {
	return l.instalmentDueDateUTC
}

func (l LoanPaymentScheduleLineItem) GracePeriodEndDate() time.Time {
	return l.gracePeriodEndDateUTC
}

func (l LoanPaymentScheduleLineItem) LoanBalance() money.Money {
	return l.loanBalance
}

func (l LoanPaymentScheduleLineItem) PrincipalDue() money.Money {
	return l.principalDue
}

func (l LoanPaymentScheduleLineItem) InterestDue() money.Money {
	return l.interestDue
}

func (l LoanPaymentScheduleLineItem) LateFeeDue() money.Money {
	return l.lateFeeDue
}

func (l LoanPaymentScheduleLineItem) RefId() *string {
	return l.refId
}

func (l LoanPaymentScheduleLineItem) PaidDate() *time.Time {
	return l.paidDateUTC
}

func (l LoanPaymentScheduleLineItem) PaidPrincipal() *money.Money {
	return l.paidPrincipal
}

func (l LoanPaymentScheduleLineItem) PaidInterest() *money.Money {
	return l.paidInterest
}

func (l LoanPaymentScheduleLineItem) PaidLateFee() *money.Money {
	return l.paidLateFee
}

func (l LoanPaymentScheduleLineItem) Id() uint64 {
	return l.id
}

func (l LoanPaymentScheduleLineItem) LoanId() string {
	return l.loanId
}

func (l LoanPaymentScheduleLineItem) IsCancelled() bool {
	return l.isCancelled
}

func (l LoanPaymentScheduleLineItem) IsPaid() bool {
	// Comment: We only allow either all dues are paid or nothing is paid
	// Once this behavior is not needed in case of partial payments, we
	// will need to refactor this method
	isLateFeePaidInFull := l.paidLateFee != nil && l.lateFeeDue.Eq(l.paidLateFee)
	isInterestPaidInFull := l.paidInterest != nil && l.interestDue.Eq(l.paidInterest)
	isPrincipalPaidInFull := l.paidPrincipal != nil && l.principalDue.Eq(l.paidPrincipal)

	return isLateFeePaidInFull &&
		isInterestPaidInFull &&
		isPrincipalPaidInFull &&
		l.paidDateUTC != nil &&
		l.refId != nil
}

func (l LoanPaymentScheduleLineItem) PaidByRefId(paymentRefId string) bool {
	return *l.refId == paymentRefId
}
