package start

import (
	"github.com/btechlabs/lms/api/httpx"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/spf13/cobra"
)

var httpCmd = &cobra.Command{
	Use:   "http",
	Short: "Starts the application in http mode with available endpoints, default is both commands and query mode",
	Run:   startHttpMode,
}

func startHttpMode(cmd *cobra.Command, _ []string) {
	ctx := cmd.Context()

	conf := config.LoadConfig()
	logging.InitLoggerOpts(conf)

	err := httpx.StartHttpServer(ctx, conf)
	if err != nil {
		panic(err)
	}
}
