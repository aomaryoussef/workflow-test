package cmd

import (
	"context"
	"github.com/MakeNowJust/heredoc"
	"github.com/btechlabs/lms-lite/internal/http/handler"
	"github.com/btechlabs/lms-lite/internal/server"
	"github.com/btechlabs/lms-lite/modules"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/spf13/cobra"
	"log"
	"os"
	"os/signal"
	"syscall"
)

var startHttpServerCmd = &cobra.Command{
	Use:           "start-http-server",
	Short:         "Start HTTP server",
	SilenceUsage:  true,
	SilenceErrors: true,
	
	Example: heredoc.Doc(`
		$ lms start-http-server`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
			Open an issue at https://github.com/btechlabs/lms-lite`),
	},
	Version: version,
	Run:     handleStartHttpServerCmd,
}

func init() {
	rootCmd.AddCommand(startHttpServerCmd)
}

func handleStartHttpServerCmd(cmd *cobra.Command, args []string) {
	ctx := cmd.Context()
	// Env Config
	envConfig := loadEnvConfig()
	// Logging
	err := logging.InitLogger(envConfig.DebugLevel, envConfig.AppName, envConfig.Environment)
	if err != nil {
		log.Fatal("failed to init logger")
	}
	// Core App
	application := modules.NewApplication(envConfig)
	config := application.EnvConfig()
	router := handler.Handler(application)
	httpServer := server.NewHttpServer(config, router)
	
	go func() {
		logging.LogHandle.WithContext(ctx).Info("starting server")
		if err := httpServer.Run(); err != nil {
			logging.LogHandle.WithContext(ctx).Errorf("unable to start server", err)
			os.Exit(1)
		}
	}()
	
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, syscall.SIGTERM)
	
	sig := <-c
	
	logging.LogHandle.WithContext(ctx).Infof("received signal %s", sig)
	ctx, cancel := context.WithTimeout(ctx, config.HttpServer.WaitingTimeout)
	defer cancel()
	
	err = httpServer.Stop(ctx)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("unable to stop server gracefully", err)
	}
}
