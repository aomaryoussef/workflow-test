package job

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/loan_account/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/riverqueue/river"
	"log/slog"
	"time"
)

var _ job.JobArgsWithHeader = (*ActivateLoanAccount)(nil)

type ActivateLoanAccount struct {
	Header   job.MessageHeader `json:"header"`
	EventId  string            `json:"event_id"`
	LoanId   string            `json:"loan_id"`
	BookedAt time.Time         `json:"booked_at"`
	Version  cqrs.Version      `json:"version"`
}

func (a ActivateLoanAccount) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a ActivateLoanAccount) Kind() string {
	return types.JobTypeActivateLoanAccount.String()
}

func (h *LoanAccountJobHandler) ActivateLoanAccount(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(ActivateLoanAccount)

	tx, err := h.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	riverClient, err := river.ClientFromContextSafely[sql_driver.Tx](ctx)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to get river client from context with error: %s", err.Error()))
		return err
	}

	la, err := loadLoanAccount(ctx, h.es, tx, request.LoanId, request.EventId)
	if err != nil {
		return err
	}

	activationEvent := la.Events()[len(la.Events())-1]
	wm := storage.LoanAccountActivateWriteModel{
		WriteModel: cqrs.WriteModel{
			Id:               la.Id,
			UpdatedByEventID: activationEvent.Id,
			UpdatedBy:        la.LastUpdatedBy,
			UpdatedAt:        la.LastUpdatedAtUTC.ToStdLibTime(),
			Version:          la.AggregateVersion.Primitive(),
		},
		State:            la.State().String(),
		SubState:         la.SubState().String(),
		LoanStartDate:    activationEvent.CreatedAt.ToStdLibTime(),
		LoanMaturityDate: la.AmmortisationLineItems[len(la.AmmortisationLineItems)-1].InstalmentDueAt.ToStdLibTime(),
	}

	err = storage.ActivateLoanAccount(ctx, tx, wm)
	if err != nil {
		if errors.Is(err, sql_driver.ErrVersionMismatchOptimisticLocking) {
			log.Warn(
				fmt.Sprintf("optimistic locking failed for loan account activate with ID: %s and new version: %d and new state: %s, retrying job",
					wm.Id,
					wm.Version,
					wm.State,
				),
			)
		}
		return err
	}

	for _, item := range la.AmmortisationLineItems {
		err = addAmmortisationSchedule(ctx, la.Id, la.LenderSource, request.BookedAt, item, tx)
		if err != nil {
			return err
		}
	}

	jobArgs := &UpdateEarlySettlementDetails{
		Header:   job.MessageHeaderFromContext(ctx),
		EventId:  la.Events()[len(la.Events())-1].Id,
		LoanId:   la.Id,
		BookedAt: la.Events()[len(la.Events())-1].CreatedAt.ToStdLibTime(),
		Version:  la.AggregateVersion,
	}
	result, err := riverClient.InsertTx(ctx, tx, jobArgs, riverx.UniqueOptsByArgs())
	if err != nil {
		return err
	}
	log.Debug(fmt.Sprintf("enqueued job_type: %s", jobArgs.Kind()), slog.Int64("job_id", result.Job.ID), slog.String("job_status", string(result.Job.State)))

	log.Debug(fmt.Sprintf("activated loan account with id: %s and version: %d", la.Id, la.AggregateVersion.Primitive()))

	return nil
}
