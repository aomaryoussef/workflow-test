package job

import (
	"context"
	"errors"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/loan_account/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"time"
)

var _ job.JobArgsWithHeader = (*UpdateEarlySettlementDetails)(nil)

type UpdateEarlySettlementDetails struct {
	Header   job.MessageHeader `json:"header"`
	EventId  string            `json:"event_id"`
	LoanId   string            `json:"loan_id"`
	BookedAt time.Time         `json:"booked_at"`
	Version  cqrs.Version      `json:"version"`
}

func (d UpdateEarlySettlementDetails) MessageHeader() job.MessageHeader {
	return d.Header
}

func (d UpdateEarlySettlementDetails) Kind() string {
	return types.JobTypeUpdateEarlySettlementDetails.String()
}

// UpdateEarlySettlementDetails creates a write model (for efficient reads) of the early settlement details.
// This allows the systems to quickly determine if early settlement is available for a loan account without
// having to load the entire loan account aggregate.
//
// DO NOT CONFUSE THIS WITH THE WRITE MODEL WHERE THE COMMAND OF EARLY SETTLEMENT IS HANDLED.
//
// Parameters:
// - ctx: The context.Context instance for controlling cancellations and timeouts.
// - args: The job.JobArgsWithHeader instance containing the job arguments.
//
// Returns:
//   - An error if the transaction creation fails, the loan account loading fails, or the update operation fails.
//     On success, returns nil indicating the early settlement details were updated successfully.
func (h *LoanAccountJobHandler) UpdateEarlySettlementDetails(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(UpdateEarlySettlementDetails)

	tx, err := h.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	la, err := loadLoanAccount(ctx, h.es, tx, request.LoanId, request.EventId)
	if err != nil {
		return err
	}

	earlySettlementDetails := la.GetEarlySettlementDetails()
	wm := storage.LoanAccountEarlySettlementDetailsWriteModel{
		WriteModel: cqrs.WriteModel{
			Id:               la.Id,
			UpdatedByEventID: la.Events()[len(la.Events())-1].Id,
			UpdatedBy:        la.LastUpdatedBy,
			UpdatedAt:        la.LastUpdatedAtUTC.ToStdLibTime(),
			Version:          la.AggregateVersion.Primitive(),
		},
		AppliedCurrency: la.MonetaryLineItems.FinancedAmount().Currency().Code,
		Available:       earlySettlementDetails.IsEarlySettlementAvailable,
	}

	if earlySettlementDetails.IsEarlySettlementAvailable {
		if earlySettlementDetails.EarlySettlementPrincipalDue == nil {
			return errors.New("early settlement principal due is nil even though early settlement is available, contact dev team")
		}
		if earlySettlementDetails.InitialInterestReceivable == nil {
			return errors.New("early settlement initial interest receivable due is nil even though early settlement is available, contact dev team")
		}
		if earlySettlementDetails.EarlySettlementFeesDue == nil {
			return errors.New("early settlement fees due is nil even though early settlement is available, contact dev team")
		}

		wm.PrincipalDueUnits = earlySettlementDetails.EarlySettlementPrincipalDue.Amount()
		wm.InterestReceivableUnits = earlySettlementDetails.InitialInterestReceivable.Amount()
		wm.SettlementFeesDueUnits = earlySettlementDetails.EarlySettlementFeesDue.Amount()
	}

	err = storage.UpsertEarlySettlementDetails(ctx, tx, wm)
	if err != nil {
		return err
	}

	return nil
}
