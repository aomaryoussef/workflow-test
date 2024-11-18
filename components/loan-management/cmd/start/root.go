package start

import (
	"github.com/btechlabs/lms/cmd/utils"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "start [commands] [flags]",
	Short: "Starts the application in various modes",
	Run:   utils.PrintHelp,
}

func init() {
	rootCmd.AddCommand(workersCmd)
	rootCmd.AddCommand(httpCmd)
}

func RegisterRootCmd(parent *cobra.Command) {
	parent.AddCommand(rootCmd)
}
