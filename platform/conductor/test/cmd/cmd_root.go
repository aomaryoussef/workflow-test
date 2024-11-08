package cmd

import (
	"context"
	"fmt"
	"github.com/MakeNowJust/heredoc"
	"github.com/jedib0t/go-pretty/v6/table"
	"github.com/spf13/cobra"
	"os"
)

const (
	version = "0.0.1"
)

var rootCmd = &cobra.Command{
	Use:   "workflows <command> [flags]",
	Short: "OpenLoop command line tool for managing Conductor workflows",
	
	SilenceUsage:  true,
	SilenceErrors: true,
	
	Example: heredoc.Doc(`
		$ workflows deploy`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/ol-workflow-orchestrator`),
	},
	Version: version,
	
	Run: func(cmd *cobra.Command, args []string) {},
}
var versionCmd = &cobra.Command{
	Use:    "version",
	Hidden: true,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("workflows version: %s\n", version)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func ExecuteWithContext(ctx context.Context) {
	if err := rootCmd.ExecuteContext(ctx); err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
}

// printTable prints the headers and rows in a nice table format
// on console.
// The caller must ensure to pass the rightly formatted headers and row data
func printTable(headers []string, rows [][]string) {
	tbl := table.NewWriter()
	
	if headers != nil {
		var headerRow table.Row
		for _, header := range headers {
			headerRow = append(headerRow, header)
		}
		tbl.AppendHeader(headerRow)
	}
	for _, row := range rows {
		var dataRow table.Row
		for _, col := range row {
			dataRow = append(dataRow, col)
		}
		tbl.AppendRow(dataRow)
	}
	
	tbl.SetStyle(table.StyleLight)
	tbl.Style().Options.SeparateRows = true
	fmt.Println(tbl.Render())
}
