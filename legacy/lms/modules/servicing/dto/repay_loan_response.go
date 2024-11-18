package dto

import (
	"time"
)

type RepayLoanResponse struct {
	LoanId                     string    `json:"loan_id"`
	ScheduleNumberInLoan       int       `json:"schedule_number_in_loan"`
	ScheduleId                 *string   `json:"schedule_id,omitempty"`
	CollectedAsEarlySettlement bool      `json:"collected_as_early_settlement"`
	PaymentReferenceId         string    `json:"payment_reference_id"`
	BookedAt                   time.Time `json:"booked_at"`
	TotalAmountPaid            uint64    `json:"total_amount_paid"`
	TotalLateFeePaid           uint64    `json:"total_late_fee_paid"`
	TotalInterestPaid          uint64    `json:"total_interest_paid"`
	TotalPrincipalPaid         uint64    `json:"total_principal_paid"`
	TotalLateFeeDue            uint64    `json:"total_late_fee_due"`
	TotalInterestDue           uint64    `json:"total_interest_due"`
	TotalPrincipalDue          uint64    `json:"total_principal_due"`
}
