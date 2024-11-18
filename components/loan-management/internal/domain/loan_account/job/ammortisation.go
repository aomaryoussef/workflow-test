package job

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/loan_account/aggregate"
	"github.com/btechlabs/lms/internal/domain/loan_account/storage"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/timex"
	"github.com/riverqueue/river"
	"log/slog"
	"time"
)

func addAmmortisationSchedule(
	ctx context.Context,
	loanId string,
	lenderSource string,
	createdAt time.Time,
	item aggregate.LoanAccountAmmortisationLineItem,
	tx sql_driver.Tx,
) error {
	log := logging.WithContext(ctx)
	riverClient, err := river.ClientFromContextSafely[sql_driver.Tx](ctx)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to get river client from context with error: %s", err.Error()))
		return err
	}
	appliedCurrency := item.PrincipalDue.Currency().Code
	// Instalment due date is always at the start of the day
	dueDateStartOfDay := timex.NewUtcTime(timex.TimeAsStartOfDay(item.InstalmentDueAt.InLocalTZ()))
	// Grace period end is always at the end of the day
	gracePeriodEndOfDay := timex.NewUtcTime(timex.TimeAsEndOfDay(item.GracePeriodDueAt.InLocalTZ()))
	totalDue := item.TotalDue()

	jobArgs := RevenueRecognitionTrigger{
		Header:                   job.MessageHeaderFromContext(ctx),
		LoanId:                   loanId,
		LenderSource:             lenderSource,
		BookedAt:                 dueDateStartOfDay.ToStdLibTime(),
		InstalmentScheduleNumber: item.ScheduleNumber,
		RevenueUnits:             item.InterestDue.Amount(),
		AppliedCurrency:          appliedCurrency,
		ShouldSnooze:             true,
	}
	revenueScheduleJob, err := riverClient.InsertTx(ctx, tx, jobArgs, &river.InsertOpts{ScheduledAt: dueDateStartOfDay.ToStdLibTime()})
	if err != nil {
		log.Warn(fmt.Sprintf("failed to insert revenue recognition job with error: %s", err.Error()))
		return err
	}
	log.Debug(fmt.Sprintf("enqueued job_type: %s for loan id: %s instalment schedule: %d", jobArgs.Kind(), loanId, item.ScheduleNumber), slog.Int64("job_id", revenueScheduleJob.Job.ID), slog.String("job_status", string(revenueScheduleJob.Job.State)))

	wm := storage.LoanAccountAmmortisationWriteModel{
		LoanAccountId:           loanId,
		InstalmentNumber:        item.ScheduleNumber,
		AppliedCurrency:         appliedCurrency,
		InstalmentDueDate:       dueDateStartOfDay.ToStdLibTime(),
		GracePeriodEndDate:      gracePeriodEndOfDay.ToStdLibTime(),
		LoanBalanceUnits:        item.LoanBalance.Amount(),
		PrincipalDue:            item.PrincipalDue.Amount(),
		InterestDue:             item.InterestDue.Amount(),
		CumulativeInterest:      item.CumulativeInterest.Amount(),
		VatDue:                  item.VatDue.Amount(),
		AdminFeeDue:             item.AdminFeeDue.Amount(),
		PenaltyDue:              item.PenaltyDue.Amount(),
		TotalInstalmentDue:      totalDue.Amount(),
		RevenueRecognitionJobId: revenueScheduleJob.Job.ID,
		Canceled:                false,
		CreatedAt:               createdAt,
	}
	err = storage.AddNewAmmortisationSchedule(ctx, tx, wm)
	if err != nil {
		return err
	}

	return nil
}

func cancelAmmortisationSchedule(ctx context.Context, loanId string, itemToBeCanceled aggregate.LoanAccountAmmortisationLineItem, tx sql_driver.Tx) error {
	log := logging.WithContext(ctx)
	riverClient, err := river.ClientFromContextSafely[sql_driver.Tx](ctx)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to get river client from context with error: %s", err.Error()))
		return err
	}

	scheduledJobId, err := storage.CancelAmmortisationSchedule(ctx, tx, storage.LoanAccountAmmortisationCancelationWriteModel{
		LoanAccountId:    loanId,
		InstalmentNumber: itemToBeCanceled.ScheduleNumber,
		CanceledAt:       itemToBeCanceled.CanceledAt.ToStdLibTime(),
		CanceledReason:   *itemToBeCanceled.CanceledReason,
	})
	if err != nil {
		log.Warn(fmt.Sprintf("failed to cancel ammortisation schedule with error: %s", err.Error()))
		return err
	}

	revenueScheduleJob, err := riverClient.JobCancelTx(ctx, tx, scheduledJobId)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to cancel revenue recognition job with error: %s", err.Error()))
		return err
	}
	log.Debug(fmt.Sprintf("canceled revenue recognition trigger job: %d for loan id: %s instalment schedule: %d", revenueScheduleJob.ID, loanId, itemToBeCanceled.ScheduleNumber))

	return nil
}
