package worker

import (
	"context"
	"time"

	"github.com/conductor-sdk/conductor-go/sdk/model"
)

type TaskFunction func(ctx context.Context, t *model.Task, tr *model.TaskResult) error

// TaskWorker defines a specific worker process
// for Conductor. Every conductor task must implement
// this interface
type TaskWorker interface {
	GetName() string
	GetTaskFunction() TaskFunction
	GetBatchSize() int
	GetPollInterval() time.Duration
}
