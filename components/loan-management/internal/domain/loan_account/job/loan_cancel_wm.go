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

var _ job.JobArgsWithHeader = (*CancelLoanAccount)(nil)

type CancelLoanAccount struct {
	Header   job.MessageHeader `json:"header"`
	EventId  string            `json:"event_id"`
	BookedAt time.Time         `json:"booked_at"`
	LoanId   string            `json:"loan_id"`
	Version  cqrs.Version      `json:"version"`
}

func (a CancelLoanAccount) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a CancelLoanAccount) Kind() string {
	return types.JobTypeCancelLoanAccount.String()
}

func (h *LoanAccountJobHandler) CancelLoanAccount(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(CancelLoanAccount)

	tx, err := h.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	la, err := loadLoanAccount(ctx, h.es, tx, request.LoanId, request.EventId)
	if err != nil {
		return err
	}
	cancellationEvent := la.Events()[len(la.Events())-1]

	// Update loan account wm state
	err = storage.UpdateLoanAccountCancel(ctx, tx, storage.LoanAccountCancelWriteModel{
		WriteModel: cqrs.WriteModel{
			Id:               la.Id,
			UpdatedByEventID: cancellationEvent.Id,
			UpdatedBy:        la.LastUpdatedBy,
			UpdatedAt:        la.LastUpdatedAtUTC.ToStdLibTime(),
			Version:          la.AggregateVersion.Primitive(),
		},
		State:    la.State().String(),
		SubState: la.SubState().String(),
	})
	if err != nil {
		log.Warn(fmt.Sprintf("failed to update loan account cancel write model (states) with error: %s", err.Error()))
		return err
	}
	log.Debug(fmt.Sprintf("successfully updated cancel write model (states) for loan account: %s", la.Id))

	// Cancel all schedules
	for _, item := range la.AmmortisationLineItems {
		err = cancelAmmortisationSchedule(ctx, la.Id, item, tx)
		if err != nil {
			log.Warn(fmt.Sprintf("failed to cancel ammortisation schedule for loan account: %s and schedule number: %d with error: %s", la.Id, item.ScheduleNumber, err.Error()))
			return err
		}
	}
	log.Debug(fmt.Sprintf("successfully updated all cancelled schedules for loan account: %s", la.Id))

	return nil
}
