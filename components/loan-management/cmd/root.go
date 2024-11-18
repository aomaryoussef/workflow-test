package cmd

import (
	"context"
	"github.com/btechlabs/lms/cmd/calc"
	"github.com/btechlabs/lms/cmd/migrate"
	"github.com/btechlabs/lms/cmd/start"
	"github.com/btechlabs/lms/cmd/utils"
	"github.com/btechlabs/lms/cmd/version"
	"github.com/spf13/cobra"
)

func newRootCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:           "lcli [commands] [flags]",
		Short:         "Loans commands line (lcli) tool for managing financial products and transactions",
		SilenceUsage:  false,
		SilenceErrors: false,
		Run:           utils.PrintHelp,
	}

	version.RegisterRootCmd(cmd)
	migrate.RegisterRootCmd(cmd)
	start.RegisterRootCmd(cmd)
	calc.RegisterRootCmd(cmd)

	return cmd
}

// ExecuteWithContext adds all child commands to the root commands
// and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to
// the rootCmd.
func ExecuteWithContext(ctx context.Context) {
	if err := newRootCmd().ExecuteContext(ctx); err != nil {
		panic(err)
	}
}
