package onboarding

import (
	"context"
	"time"

	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/conductor-sdk/conductor-go/sdk/model"
)

type GAOpenConsumerAccountTask struct {
	app app.Application
}

func NewGAOpenConsumerAccountTask(app app.Application) worker.TaskWorker {
	t := &GAOpenConsumerAccountTask{app: app}
	return t
}

func (d *GAOpenConsumerAccountTask) GetName() string {
	return "ga_open_consumer_account"
}

func (d *GAOpenConsumerAccountTask) GetTaskFunction() worker.TaskFunction {
	return d.taskFunction
}
func (d *GAOpenConsumerAccountTask) GetBatchSize() int {
	return 1
}
func (d *GAOpenConsumerAccountTask) GetPollInterval() time.Duration {
	return time.Millisecond
}

func (d *GAOpenConsumerAccountTask) taskFunction(ctx context.Context, t *model.Task, tr *model.TaskResult) error {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Start open consumer account on GA")

	// TODO: process input and map it to GA request

	// TODO: call GA http request

	// TODO: process response and map
	// TODO: fail task if response was failure
	// TODO: check for timeout, if timeout, return with retryable error on task result

	logger.Infof("Finished open consumer account on GA")
	return nil
}
