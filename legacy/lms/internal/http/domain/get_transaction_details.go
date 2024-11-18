package domain

import (
	"github.com/btechlabs/lms-lite/modules/ga/domain"
	"time"
)

type TransactionDetailsResponse struct {
	Id                       string    `json:"id"`
	LoanId                   string    `json:"loan_id"`
	MerchantAccountId        string    `json:"merchant_account_id"`
	CreatedAt                time.Time `json:"created_at"`
	UpdatedAt                time.Time `json:"updated_at"`
	CancelledForDisbursement bool      `json:"cancelled_for_disbursement"`
}

func MapFromDomainToTransactionDetailsResponse(transactionDetails *domain.MerchantTransactionSlip) *TransactionDetailsResponse {
	return &TransactionDetailsResponse{
		Id:                       transactionDetails.Id(),
		LoanId:                   transactionDetails.LoanId(),
		MerchantAccountId:        transactionDetails.MerchantAccountId(),
		CreatedAt:                transactionDetails.CreatedAt(),
		UpdatedAt:                transactionDetails.UpdatedAt(),
		CancelledForDisbursement: transactionDetails.IsCancelledForDisbursement(),
	}
}
