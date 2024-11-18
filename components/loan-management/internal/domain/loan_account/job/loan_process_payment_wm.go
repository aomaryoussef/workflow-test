package job

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/loan_account/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"time"
)

var _ job.JobArgsWithHeader = (*ProcessPaymentLoanAccount)(nil)

type ProcessPaymentLoanAccount struct {
	Header                   job.MessageHeader `json:"header"`
	EventId                  string            `json:"event_id"`
	BookedAt                 time.Time         `json:"booked_at"`
	LoanId                   string            `json:"loan_id"`
	Version                  cqrs.Version      `json:"version"`
	InstalmentScheduleNumber uint32            `json:"instalment_schedule_number"`
	AppliedCurrency          string            `json:"applied_currency"`
	PaidUnits                uint64            `json:"paid_units"`
	PaymentReferenceId       string            `json:"payment_reference_id"`
}

func (a ProcessPaymentLoanAccount) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a ProcessPaymentLoanAccount) Kind() string {
	return types.JobTypeBookLoanDuesFromPayment.String()
}

func (h *LoanAccountJobHandler) ProcessPaymentForLoan(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(ProcessPaymentLoanAccount)

	tx, err := h.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	// Update loan account payment wm
	err = storage.AddNewLoanAccountPayment(ctx, tx, storage.LoanAccountPaymentWriteModel{
		LoanAccountId:               request.LoanId,
		AmmortisationLineItemNumber: request.InstalmentScheduleNumber,
		UpdatedByEventID:            request.EventId,
		AppliedCurrency:             request.AppliedCurrency,
		PaidUnits:                   request.PaidUnits,
		PaymentReferenceId:          request.PaymentReferenceId,
		BookedAt:                    request.BookedAt,
	})
	if err != nil {
		log.Warn(fmt.Sprintf("failed to update loan account payment write model (states) with error: %s", err.Error()))
		return err
	}
	log.Debug(fmt.Sprintf("successfully updated loan account payment write model for loan account: %s and payment reference: %s", request.LoanId, request.PaymentReferenceId))

	return nil
}
