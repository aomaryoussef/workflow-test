package utils

import "github.com/spf13/cobra"

func PrintHelp(cmd *cobra.Command, _ []string) {
	err := cmd.Help()
	if err != nil {
		panic(err)
	}
}
