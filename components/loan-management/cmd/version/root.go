package version

import (
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/spf13/cobra"
)

func newVersionCmd() *cobra.Command {
	return &cobra.Command{
		Use:    "version",
		Short:  "Shows the application version along with the build information",
		Hidden: true,
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Printf("application version: %s\n", config.Version)
		},
	}
}

func RegisterRootCmd(parent *cobra.Command) {
	parent.AddCommand(newVersionCmd())
}
