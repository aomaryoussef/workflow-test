package riverx

import (
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/riverqueue/river"
)

func NewRiverClientForJobInserts(db *sql_driver.SqlDriver) *river.Client[sql_driver.Tx] {
	return newRiverClientWithOpts(db, &river.Config{})
}

func newRiverClientWithOpts(db *sql_driver.SqlDriver, opts *river.Config) *river.Client[sql_driver.Tx] {
	riverClient, err := river.NewClient[sql_driver.Tx](sql_driver.NewDriver(db), opts)
	if err != nil {
		panic(err)
	}

	return riverClient
}

type WorkerClientBuilder struct {
	workers                 []func(*river.Workers)
	db                      *sql_driver.SqlDriver
	defaultQueueConcurrency int
}

func NewWorkerClientBuilder() *WorkerClientBuilder {
	return &WorkerClientBuilder{
		workers: make([]func(*river.Workers), 0),
	}
}

func (b *WorkerClientBuilder) WithWorker(w func(*river.Workers)) *WorkerClientBuilder {
	b.workers = append(b.workers, w)
	return b
}

func (b *WorkerClientBuilder) WithSqlxDB(db *sql_driver.SqlDriver) *WorkerClientBuilder {
	b.db = db
	return b
}

func (b *WorkerClientBuilder) WithDefaultQueueConcurrency(concurrency int) *WorkerClientBuilder {
	b.defaultQueueConcurrency = concurrency
	return b
}

func (b *WorkerClientBuilder) Build() *river.Client[sql_driver.Tx] {
	workers := river.NewWorkers()
	for _, worker := range b.workers {
		worker(workers)
	}

	return newRiverClientWithOpts(b.db, &river.Config{
		Queues: map[string]river.QueueConfig{
			river.QueueDefault: {MaxWorkers: b.defaultQueueConcurrency},
		},
		Workers: workers,
	})
}
