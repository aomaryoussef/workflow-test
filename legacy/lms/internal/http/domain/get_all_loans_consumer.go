package domain

import (
	"time"

	"github.com/btechlabs/lms-lite/modules/servicing/domain"
)

type GetAllLoansForConsumerResponse struct {
	Loans []Loan `json:"loans"`
}

type Loan struct {
	ID                      string                 `json:"loan_id"`
	CorrelationID           string                 `json:"correlation_id"`
	ConsumerID              string                 `json:"consumer_id"`
	MerchantId              string                 `json:"merchant_id"`
	FinancialProductKey     string                 `json:"financial_product_key"`
	FinancialProductVersion string                 `json:"financial_product_version"`
	AdminFee                *Money                 `json:"admin_fee"`
	Statuses                []LoanStatus           `json:"statuses"`
	CurrentStatus           LoanStatus             `json:"current_status"`
	BookedAt                time.Time              `json:"booked_at"`
	CreatedAt               time.Time              `json:"created_at"`
	CreatedBy               string                 `json:"created_by"`
	PaymentSchedule         []LoanPaymentSchedule  `json:"payment_schedule"`
	CommercialOfferID       string                 `json:"commercial_offer_id"`
	EarlySettlementDetails  EarlySettlementDetails `json:"early_settlement_details"`
}

type LoanStatus struct {
	StatusType string    `json:"status_type"`
	CreatedAt  time.Time `json:"created_at"`
}

type LoanPaymentSchedule struct {
	ID                 uint64     `json:"id"`
	LoanID             string     `json:"loan_id"`
	InstalmentDueDate  time.Time  `json:"due_date"`
	GracePeriodEndDate time.Time  `json:"grace_period_end_date"`
	LoanBalance        *Money     `json:"loan_balance"`
	PrincipalDue       *Money     `json:"principal_due"`
	InterestDue        *Money     `json:"interest_due"`
	LateFeeDue         *Money     `json:"late_fee_due"`
	PaidDate           *time.Time `json:"paid_date"`
	PaidPrincipal      *Money     `json:"paid_principal"`
	PaidInterest       *Money     `json:"paid_interest"`
	PaidLateFee        *Money     `json:"paid_late_fee"`
	IsCancelled        bool       `json:"is_cancelled"`
}

func MapToConsumerLoanFromDomain(loans []*domain.Loan) *GetAllLoansForConsumerResponse {
	response := &GetAllLoansForConsumerResponse{}

	for _, loan := range loans {
		statuses := loan.Statuses()
		loanStatuses := make([]LoanStatus, len(statuses))
		for i, status := range statuses {
			loanStatuses[i] = LoanStatus{
				StatusType: string(status.StatusType()),
				CreatedAt:  status.CreatedAtUTC(),
			}
		}

		loanCurrentStatus := loan.CurrentStatus()
		currentStatus := LoanStatus{
			StatusType: string(loanCurrentStatus.StatusType()),
			CreatedAt:  loanCurrentStatus.CreatedAtUTC(),
		}

		schedule := loan.PaymentSchedule()
		paymentSchedule := make([]LoanPaymentSchedule, len(schedule.LineItems()))
		for i, schedule := range schedule.LineItems() {
			loanBalance := schedule.LoanBalance()
			principalDue := schedule.PrincipalDue()
			interestDue := schedule.InterestDue()
			lateFeeDue := schedule.LateFeeDue()
			paymentSchedule[i] = LoanPaymentSchedule{
				ID:                 schedule.Id(),
				LoanID:             schedule.LoanId(),
				InstalmentDueDate:  schedule.InstalmentDueDateUTC(),
				GracePeriodEndDate: schedule.GracePeriodEndDate(),
				LoanBalance:        MapFromDomainMoney(&loanBalance),
				PrincipalDue:       MapFromDomainMoney(&principalDue),
				InterestDue:        MapFromDomainMoney(&interestDue),
				LateFeeDue:         MapFromDomainMoney(&lateFeeDue),
				PaidDate:           schedule.PaidDate(),
				PaidPrincipal:      MapFromDomainMoney(schedule.PaidPrincipal()),
				PaidInterest:       MapFromDomainMoney(schedule.PaidInterest()),
				PaidLateFee:        MapFromDomainMoney(schedule.PaidLateFee()),
				IsCancelled:        schedule.IsCancelled(),
			}
		}

		earlySettlementDetails := loan.EarlySettlementDetails()
		mappedLoan := Loan{
			ID:                      loan.Id(),
			CorrelationID:           loan.CorrelationId(),
			ConsumerID:              loan.ConsumerId(),
			MerchantId:              loan.MerchantId(),
			FinancialProductKey:     loan.FinancialProductKey(),
			FinancialProductVersion: loan.FinancialProductVersion(),
			AdminFee:                MapFromDomainMoney(loan.AdminFee()),
			Statuses:                loanStatuses,
			CurrentStatus:           currentStatus,
			BookedAt:                loan.BookedAt(),
			CreatedAt:               loan.CreatedAt(),
			CreatedBy:               loan.CreatedBy(),
			PaymentSchedule:         paymentSchedule,
			CommercialOfferID:       loan.CommercialOfferId(),
			EarlySettlementDetails: EarlySettlementDetails{
				IsEarlySettlementAvailable: earlySettlementDetails.IsEarlySettlementAvailable,
			},
		}
		if earlySettlementDetails.IsEarlySettlementAvailable {
			mappedLoan.EarlySettlementDetails.EarlySettlementTotalAmountDue = MapFromDomainMoney(earlySettlementDetails.EarlySettlementTotalAmountDue())
			mappedLoan.EarlySettlementDetails.EarlySettlementPrincipalDue = MapFromDomainMoney(earlySettlementDetails.EarlySettlementPrincipalDue)
			mappedLoan.EarlySettlementDetails.EarlySettlementFeesDue = MapFromDomainMoney(earlySettlementDetails.EarlySettlementFeesDue)
		}
		response.Loans = append(response.Loans, mappedLoan)
	}

	return response
}
