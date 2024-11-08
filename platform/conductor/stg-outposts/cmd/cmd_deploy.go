package cmd

import (
	"github.com/MakeNowJust/heredoc"
	"github.com/btechlabs/mylo-workflow-orchestrator/internal"
	"github.com/spf13/cobra"
)

var deployCmd = &cobra.Command{
	Use:   "deploy [flags]",
	Short: "Deploys workflows together with the related task definitions",

	SilenceUsage:  true,
	SilenceErrors: true,

	Example: heredoc.Doc(`
		$ workflows deploy`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/ol-workflow-orchestrator`),
	},
	Version: version,

	Run: handleDeployCmd,
}

func init() {
	rootCmd.AddCommand(deployCmd)
	deployCmd.Flags().StringP("config-dir", "c", internal.DefaultConfigDirPath, "Config file")
}

func handleDeployCmd(cmd *cobra.Command, args []string) {
	ctx := cmd.Context()
	configDir, _ := cmd.Flags().GetString("config-dir")
	envConfig := internal.LoadConfig(configDir)
	internal.Migrate(ctx, configDir, envConfig)
}
