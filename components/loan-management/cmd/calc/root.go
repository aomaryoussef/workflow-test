package calc

import (
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/spf13/cobra"
)

var calcCmd = &cobra.Command{
	Use:   "calc [commands] [flags]",
	Short: "calc commands for testing financial calculations.",
}

func RegisterRootCmd(parent *cobra.Command) {
	calcCmd.AddCommand(loanTermsCmd)
	parent.AddCommand(calcCmd)
}
