package notification

import (
	"context"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"time"
)

type NotifyCollectionBookingStatusTask struct {
	app app.Application
}

const (
	TaskNameAggregateCollection         = "notify_collection_booking_status"
	TaskBatchSizeAggregateCollection    = 1
	TaskPollIntervalAggregateCollection = 5 * time.Second
)

func NewNotifyCollectionBookingStatusTask(app app.Application) worker.TaskWorker {
	return &NotifyCollectionBookingStatusTask{app: app}
}

func (d *NotifyCollectionBookingStatusTask) GetName() string {
	return TaskNameAggregateCollection
}

func (d *NotifyCollectionBookingStatusTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *NotifyCollectionBookingStatusTask) GetBatchSize() int {
	return TaskBatchSizeAggregateCollection
}
func (d *NotifyCollectionBookingStatusTask) GetPollInterval() time.Duration {
	return TaskPollIntervalAggregateCollection
}

func (d *NotifyCollectionBookingStatusTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	// Will be implemented later
	tr.Status = model.CompletedTask
	return nil
}
