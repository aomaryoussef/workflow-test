package cmd

import (
	"github.com/MakeNowJust/heredoc"
	"github.com/btechlabs/lms-lite/modules"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/workers"
	"github.com/spf13/cobra"
	"log"
)

var startWorkerCmd = &cobra.Command{
	Use:   "start-worker [flags]",
	Short: "Start conductor worker(s)",

	SilenceUsage:  true,
	SilenceErrors: true,

	Example: heredoc.Doc(`
		$ lms start-worker --all`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/lms-lite`),
	},
	Version: version,
	Run:     handleStartWorkersCmd,
}

func init() {
	rootCmd.AddCommand(startWorkerCmd)
	startWorkerCmd.Flags().BoolP("all", "a", false, "Start all workers")
	_ = financialProductAmmortisationCmd.MarkFlagRequired("all")
}

func handleStartWorkersCmd(cmd *cobra.Command, _ []string) {
	ctx := cmd.Context()
	// Env Config
	envConfig := loadEnvConfig()
	// Logging
	err := logging.InitLogger(envConfig.DebugLevel, envConfig.AppName, envConfig.Environment)
	if err != nil {
		log.Fatal("failed to init logger")
	}
	// Core App
	coreApp := modules.NewApplication(envConfig)

	err = workers.
		NewConductorWorkerManager(coreApp).
		RegisterWorkers().
		StartWorkers(ctx)

	if err != nil {
		logging.LogHandle.WithContext(ctx).Fatalf("error on start worker", err)
	}
}
