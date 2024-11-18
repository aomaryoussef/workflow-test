package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"time"
	
	"github.com/MakeNowJust/heredoc"
	http_client "github.com/btechlabs/lms-lite/internal/clients/http"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/spf13/cobra"
)

var scheduledCmd = &cobra.Command{
	Use:   "scheduled [flags]",
	Short: "Run scheduled command(s), like end of day closing.",
	
	SilenceUsage:  true,
	SilenceErrors: false,
	
	Example: heredoc.Doc(`
		$ lms scheduled --eod`),
	Annotations: map[string]string{
		"help:feedback": heredoc.Doc(`
		Open an issue at https://github.com/btechlabs/lms-lite`),
	},
	Version: version,
	Run:     handleScheduledCmd,
}

func init() {
	rootCmd.AddCommand(scheduledCmd)
}

func handleScheduledCmd(cmd *cobra.Command, args []string) {
	ctx := cmd.Context()
	envConfig := loadEnvConfig()
	
	// Logging
	err := logging.InitLogger(envConfig.DebugLevel, envConfig.AppName, envConfig.Environment)
	if err != nil {
		log.Fatal("failed to init logger")
	}
	logger := logging.LogHandle.WithContext(ctx)
	
	currentTime := time.Now()
	logger.Infof("Starting scheduled command with args %s at %s", args, currentTime)
	
	if len(args) < 1 {
		logger.Fatal("At least one argument is mandatory for this command, see help for usage!")
		return
	}
	
	processName := ""
	dateStart := ""
	dateEnd := ""
	
	if args[0] == "eod" {
		processName = "end_of_day_closing" // TODO: make env variable
		yesterday := currentTime.AddDate(0, 0, -1)
		dateStart = fmt.Sprintf("%d-%02d-%02dT00:00:00Z", yesterday.Year(), yesterday.Month(), yesterday.Day())
		dateEnd = fmt.Sprintf("%d-%02d-%02dT00:00:00Z", currentTime.Year(), currentTime.Month(), currentTime.Day())
	}
	
	if args[0] == "merchant_disbursement" {
		processName = "ga_reporting_process" // TODO: make env variable
		var previousDay time.Time
		if len(args) == 1 {
			// to allow empty second argument
			previousDay = currentTime.AddDate(0, 0, -1)
		} else if args[1] == "wednesday" {
			previousDay = currentTime.AddDate(0, 0, -3) // yields sunday
		} else if args[1] == "sunday" {
			previousDay = currentTime.AddDate(0, 0, -4) // yields wednesday
		} else {
			// to allow any random second argument to fall back to daily schedule
			previousDay = currentTime.AddDate(0, 0, -1)
		}
		dateStart = fmt.Sprintf("%d-%02d-%02dT00:00:00Z", previousDay.Year(), previousDay.Month(), previousDay.Day())
		dateEnd = fmt.Sprintf("%d-%02d-%02dT00:00:00Z", currentTime.Year(), currentTime.Month(), currentTime.Day())
	}
	
	if processName == "" {
		logger.Fatalf("Unknown process in first argument: %s!", args[0])
		return
	}
	
	postBody, err := json.Marshal(map[string]any{
		"name": processName,
		"input": map[string]string{
			"date_range_start": dateStart,
			"date_range_end":   dateEnd,
		},
	})
	
	if err != nil {
		logger.Fatalf("Error marshalling post body: ", err)
		return
	}
	
	requestBody := bytes.NewBuffer(postBody)
	client := http_client.GetCustomHttpClient(ctx)
	resp, err := client.Post(envConfig.Orkes.Url+"/api/workflow", "application/json", requestBody)
	
	if err != nil {
		logger.Fatalf("Error posting to Conductor: ", err)
		return
	}
	
	defer resp.Body.Close()
	responseBody, err := io.ReadAll(resp.Body)
	
	if err != nil {
		logger.Fatalf("Error reading Conductor response: ", err)
		return
	}
	
	logger.Infof("Scheduled command finished with response %s", responseBody)
}
