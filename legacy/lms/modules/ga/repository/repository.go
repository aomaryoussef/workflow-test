package repository

import (
	"context"
	"github.com/btechlabs/lms-lite/modules/ga/dto"
	"time"

	"github.com/btechlabs/lms-lite/modules/ga/domain"
)

type AggregateMerchantPaymentsInput struct {
	TimeStart        time.Time
	TimeEnd          time.Time
	CurrentTime      time.Time
	IntegrationPoint domain.IntegrationPointType
	JournalName      string
	AccountType      domain.AccountType
	Account          string
	InvoiceNumber    string
}

type AggregateEndOfDayInput struct {
	TimeStart time.Time
	TimeEnd   time.Time
}

type GaRepository interface {
	GetMerchantTransactionSlipForLoan(ctx context.Context, loanId string) (*domain.MerchantTransactionSlip, error)
	InsertMerchantTransactionSlip(ctx context.Context, mts domain.MerchantTransactionSlip) error
	CancelMerchantDisbursementSlip(ctx context.Context, mts domain.MerchantTransactionSlip, bookingTime time.Time) error
	AggregateMerchantPayments(ctx context.Context, input AggregateMerchantPaymentsInput) ([]domain.MerchantPayment, error)
	AggregateBooks(ctx context.Context, input AggregateEndOfDayInput) ([]domain.AccountBalanceChange, error)
	ListJournalEntryIDs(ctx context.Context, input AggregateEndOfDayInput) (res []domain.JournalEntryForRead, err error)
	AggregateMerchantTransactionsAtEndOfDay(ctx context.Context, input AggregateEndOfDayInput) ([]domain.MerchantTransaction, error)
	AggregateAdminFeesPerMerchantAtEndOfDay(ctx context.Context, input AggregateEndOfDayInput) ([]domain.MerchantTransaction, error)
	UpdateDisbursementStatus(ctx context.Context, input *domain.UpdateDisbursementStatusInput) error
	GetMerchantTransactionById(ctx context.Context, transactionId string) (*domain.MerchantTransactionSlip, error)
	AggregateCollectionsAtEndOfDay(ctx context.Context, input AggregateEndOfDayInput) (aggregate *dto.EndOfDayCollectionsAggregate, err error)
	AggregateLoanCancellationsAtEndOfDay(ctx context.Context, input AggregateEndOfDayInput) (aggregate *domain.AggregatedLoanCancellationRecords, err error)
	GetMerchantCancelledDisbursements(ctx context.Context, startTime string, endTime string) ([]map[string]interface{}, error)
}
