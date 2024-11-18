package migrate

import (
	"github.com/btechlabs/lms/config"
	migratedb "github.com/btechlabs/lms/migration/db"
	"github.com/btechlabs/lms/pkg/logging"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/spf13/cobra"
	"os"
)

func newMigrateCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "migrate [commands] [flags]",
		Short: "Migrate commands for managing database migrations.",
	}

	migrateUpCmd := &cobra.Command{
		Use:   "up",
		Short: "Apply all available migrations upwards",
		Run: func(cmd *cobra.Command, args []string) {
			ctx := cmd.Context()
			c := config.LoadConfig()
			logging.InitLoggerOpts(c)

			err := migratedb.Migrate(ctx, c, migratedb.MigrateUp)
			if err != nil {
				exitWithErr()
			}
		},
	}
	migrateDownCmd := &cobra.Command{
		Use:   "down",
		Short: "Rollback defined migration steps downwards",
		Run: func(cmd *cobra.Command, args []string) {
			ctx := cmd.Context()
			c := config.LoadConfig()
			logging.InitLoggerOpts(c)

			err := migratedb.Migrate(ctx, c, migratedb.MigrateDown)
			if err != nil {
				exitWithErr()
			}
		},
	}

	cmd.AddCommand(migrateUpCmd, migrateDownCmd)

	return cmd
}

func RegisterRootCmd(parent *cobra.Command) {
	parent.AddCommand(newMigrateCmd())
}

func exitWithErr() {
	os.Exit(1)
}
