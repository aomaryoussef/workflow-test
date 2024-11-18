package domain

import (
	"time"

	"github.com/btechlabs/lms-lite/modules/servicing/domain"
)

type GetAllLoansForMerchantResponse struct {
	Loans []MerchantLoan `json:"loans"`
}

type MerchantLoan struct {
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
	TransactionStatus       string                 `json:"transaction_status"`
	PaymentStatus           string                 `json:"payment_status"`
	TransactionID           string                 `json:"transaction_id"`
	CommercialOfferID       string                 `json:"commercial_offer_id"`
	EarlySettlementDetails  EarlySettlementDetails `json:"early_settlement_details"`
}

func MapToMerchantLoanFromDomain(loans []*domain.MerchantLoan) *GetAllLoansForMerchantResponse {
	response := &GetAllLoansForMerchantResponse{}
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

		earlySettlementDetails := loan.EarlySettlementDetails()
		mappedLoan := MerchantLoan{
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
			TransactionStatus:       loan.TransactionStatus(),
			PaymentStatus:           loan.PaymentStatus(),
			TransactionID:           loan.TransactionId(),
			CommercialOfferID:       loan.CommercialOfferId(),
			EarlySettlementDetails: EarlySettlementDetails{
				IsEarlySettlementAvailable: earlySettlementDetails.IsEarlySettlementAvailable,
			},
		}
		if earlySettlementDetails.IsEarlySettlementAvailable {
			// Only the total amount due is returned to the merchant
			mappedLoan.EarlySettlementDetails.EarlySettlementTotalAmountDue = MapFromDomainMoney(earlySettlementDetails.EarlySettlementTotalAmountDue())
			// This is a conscious choice of not returning the principal and fees due in the merchant loan response
			// The principal and fees due are sensitive information for the consumer and should not be exposed to the
			// merchant thereby giving our internal calculations away. Make sure to NOT CHANGE THESE nil values
			mappedLoan.EarlySettlementDetails.EarlySettlementPrincipalDue = nil
			mappedLoan.EarlySettlementDetails.EarlySettlementFeesDue = nil
		}

		response.Loans = append(response.Loans, mappedLoan)

	}
	return response
}
