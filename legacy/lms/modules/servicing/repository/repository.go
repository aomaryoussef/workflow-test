package repository

import (
	"context"
	"errors"
	"time"

	"github.com/btechlabs/lms-lite/modules/servicing/domain"
)

var (
	ErrNoLoanFound            = errors.New("no loan found")
	ErrNoCommercialOfferFound = errors.New("no commercial offer found")
)

type ServicingRepository interface {
	CreateLoan(ctx context.Context, loan domain.Loan) (err error)
	BookPayment(ctx context.Context, psi *domain.LoanPaymentScheduleLineItem, updatedBy string) (err error)
	GetLoan(ctx context.Context, id string) (loan *domain.Loan, err error)
	CancelLoan(ctx context.Context, loanId string, bookingTime time.Time) (err error)
	ListLoansDueOn(ctx context.Context, dueDateStart time.Time, dueDateEnd time.Time) (loanIds []string, err error)
	InsertCommand(ctx context.Context, command domain.Command) (err error)
	GetCommercialOfferById(ctx context.Context, id string) (offer *domain.CommercialOffer, err error)
	GetCommercialOffersByBasketId(ctx context.Context, basketId string) (offers []domain.CommercialOffer, err error)
	InsertCommercialOffers(ctx context.Context, offers []domain.CommercialOffer) (err error)
	GetAllLoansForConsumer(ctx context.Context, consumerId string) ([]*domain.Loan, error)
	GetAllLoansForMerchant(ctx context.Context, merchantId string, loanIds []string) ([]*domain.MerchantLoan, error)
	EarlySettleLoan(
		ctx context.Context,
		loanId string,
		bookingTime time.Time,
		cancelledUnpaidSchedules []domain.LoanPaymentScheduleLineItem,
		newEarlyPaymentSchedule domain.LoanPaymentScheduleLineItem,
	) (err error)
}
