package worker

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"time"

	"github.com/btechlabs/lms/pkg/contextx"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
	"go.opentelemetry.io/otel/attribute"
)

type DecoratorWorker[T job.JobArgsWithHeader] struct {
	// An embedded WorkerDefaults sets up default methods to fulfill the rest of
	// the Worker interface:
	river.WorkerDefaults[T]
	Handler                   job.WorkerHandlerFunc
	LinearRetryBackoffSeconds int
}

func (w *DecoratorWorker[T]) Work(ctx context.Context, j *river.Job[T]) error {
	ctx = job.ContextFromMessageHeader(ctx, j.Args.MessageHeader())
	ctx = context.WithValue(ctx, contextx.ContextKeyCurrentAction, fmt.Sprintf("worker[%s]", j.Kind))
	ctx = context.WithValue(ctx, contextx.ContextKeyBackgroundJobId, j.ID)
	ctx = context.WithValue(ctx, contextx.ContextKeyBackgroundJobAttempt, j.Attempt)

	ctx, span := otelx.NewSpanFromJobContext(ctx, j.JobRow)
	defer span.End()

	log := logging.WithContext(ctx)
	log.Debug("start - worker execution")
	err := w.Handler(ctx, j.Args)
	if err != nil {
		if errors.Is(err, riverx.ErrSnoozeJob100Hours) {
			return river.JobSnooze(riverx.ErrSnoozeJob100Hours.SnoozeDelay)
		}

		span.SetAttributes(
			attribute.String("error", err.Error()),
		)
		log.Error(fmt.Sprintf("failed to handle worker[%s] with error: %s\n", j.Kind, err.Error()))
		return err
	}
	log.Debug("end - worker execution")
	return nil
}

// NextRetry returns the time when the job should be retried.
// If LinearRetryBackoffSeconds is set, it calculates the retry time based on this value.
// If LinearRetryBackoffSeconds is not set, it returns an empty time.Time, indicating that
// the job will be retried based on the client-level retry policy.
//
// Parameters:
// - j: A pointer to a river.Job instance containing the job details.
//
// Returns:
//   - A time.Time instance representing the next retry time. If LinearRetryBackoffSeconds is not set,
//     it returns an empty time.Time instance.
func (w *DecoratorWorker[T]) NextRetry(j *river.Job[T]) time.Time {
	if w.LinearRetryBackoffSeconds > 0 {
		return time.Now().Add(time.Duration(w.LinearRetryBackoffSeconds) * time.Second)
	}
	return time.Time{}
}
