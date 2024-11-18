package job

import (
	"context"
	"errors"
	"fmt"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/loan_account/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"time"
)

var _ job.JobArgsWithHeader = (*EarlySettleLoanAccount)(nil)

type EarlySettleLoanAccount struct {
	Header   job.MessageHeader `json:"header"`
	EventId  string            `json:"event_id"`
	BookedAt time.Time         `json:"booked_at"`
	LoanId   string            `json:"loan_id"`
	Version  cqrs.Version      `json:"version"`
}

func (a EarlySettleLoanAccount) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a EarlySettleLoanAccount) Kind() string {
	return types.JobTypeEarlySettleLoanAccount.String()
}

func (h *LoanAccountJobHandler) EarlySettleLoanAccount(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(EarlySettleLoanAccount)

	tx, err := h.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	la, err := loadLoanAccount(ctx, h.es, tx, request.LoanId, request.EventId)
	if err != nil {
		return err
	}
	earlySettlementEvent := la.Events()[len(la.Events())-1]

	// Update loan account wm state
	err = storage.UpdateLoanAccountEarlySettle(ctx, tx, storage.LoanAccountEarlySettleWriteModel{
		WriteModel: cqrs.WriteModel{
			Id:               la.Id,
			UpdatedByEventID: earlySettlementEvent.Id,
			UpdatedBy:        la.LastUpdatedBy,
			UpdatedAt:        la.LastUpdatedAtUTC.ToStdLibTime(),
			Version:          la.AggregateVersion.Primitive(),
		},
		State:    la.State().String(),
		SubState: la.SubState().String(),
	})
	if err != nil {
		log.Warn(fmt.Sprintf("failed to update loan account early settlement write model (states) with error: %s", err.Error()))
		return err
	}
	log.Debug(fmt.Sprintf("successfully updated early settlement write model (states) for loan account: %s", la.Id))

	// Cancel all schedules affected by early settlement
	for _, item := range la.AmmortisationLineItems {
		if item.Canceled && *item.CanceledReason == pbevent.LoanAccountSubState_EARLY_SETTLEMENT_REQUESTED.String() {
			err = cancelAmmortisationSchedule(ctx, la.Id, item, tx)
			if err != nil {
				log.Warn(fmt.Sprintf("failed to cancel ammortisation schedule for loan account: %s and schedule number: %d with error: %s", la.Id, item.ScheduleNumber, err.Error()))
				return err
			}
		}
	}
	log.Debug(fmt.Sprintf("successfully updated all cancelled schedules for loan account: %s", la.Id))

	// Add the last schedule
	lastSchedule := la.AmmortisationLineItems[len(la.AmmortisationLineItems)-1]
	if lastSchedule.IsPaid() || lastSchedule.Canceled {

		return errors.New("last schedule for loan should have been an early settlement schedule")
	}
	err = addAmmortisationSchedule(ctx, la.Id, la.LenderSource, request.BookedAt, lastSchedule, tx)
	if err != nil {
		log.Warn(fmt.Sprintf("last schedule for loan account: %s is either paid or canceled, should have been an early settlement schedule", la.Id))
		return err
	}
	log.Debug(fmt.Sprintf("successfully created last schedule for loan account: %s as early settlement schedule", la.Id))

	return nil
}
