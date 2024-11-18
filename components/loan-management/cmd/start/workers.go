package start

import (
	"fmt"
	"github.com/btechlabs/lms/api/worker"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/spf13/cobra"
)

const RiverQueueDefaultConcurrency = 100

var workerConcurrency int

var workersCmd = &cobra.Command{
	Use:   "workers",
	Short: "Starts the application in worker mode",
	Run: func(cmd *cobra.Command, args []string) {
		ctx := cmd.Context()
		conf := config.LoadConfig()
		logging.InitLoggerOpts(conf)

		err := worker.StartWorkers(ctx, conf, workerConcurrency)
		if err != nil {
			panic(err)
		}
	},
}

func init() {
	workersCmd.Flags().IntVarP(&workerConcurrency, "concurrency", "c", RiverQueueDefaultConcurrency, fmt.Sprintf("Number of workers to run concurrently (default: %d)", RiverQueueDefaultConcurrency))
}
