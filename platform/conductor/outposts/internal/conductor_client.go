package internal

import (
	"context"
	"errors"
	"fmt"
	"github.com/conductor-sdk/conductor-go/sdk/client"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/conductor-sdk/conductor-go/sdk/settings"
	"net/http"
)

type ConductorClient struct {
	baseClient *client.APIClient
}

func NewConductorClient(config EnvConfig) ConductorClient {
	c := client.NewAPIClient(
		&settings.AuthenticationSettings{},
		//settings.NewAuthenticationSettings("facf8cd9-e707-4185-b429-cb964db9aa4d", "OPgQh0Ivbr5Xk4ScbmCjB7vF3SYMztJRHZOBIH9uKC3PsfD2"),
		settings.NewHttpSettings(fmt.Sprintf("%s/api", config.ConductorConfig.BaseUrl)),
	)
	
	return ConductorClient{
		baseClient: c,
	}
}

func (c ConductorClient) createTasks(ctx context.Context, tasks []model.TaskDef) error {
	we := client.MetadataResourceApiService{
		APIClient: c.baseClient,
	}
	httpResponse, err := we.RegisterTaskDef(ctx, tasks)
	if err != nil {
		return err
	}
	
	if httpResponse.StatusCode != http.StatusOK {
		return errors.New(httpResponse.Status)
	}
	
	return nil
}

func (c ConductorClient) createWorkflow(ctx context.Context, workflow model.WorkflowDef) error {
	we := client.MetadataResourceApiService{
		APIClient: c.baseClient,
	}
	httpResponse, err := we.RegisterWorkflowDef(ctx, false, workflow)
	if err != nil {
		return err
	}
	
	if httpResponse.StatusCode != http.StatusOK {
		return errors.New(httpResponse.Status)
	}
	
	return nil
}

func (c ConductorClient) getWorkflowLatestVersion(ctx context.Context, workflowName string) (int32, error) {
	we := client.MetadataResourceApiService{
		APIClient: c.baseClient,
	}
	
	workflow, httpResponse, err := we.Get(ctx, workflowName, nil)
	if httpResponse != nil && (httpResponse.StatusCode == http.StatusNotFound || httpResponse.StatusCode == http.StatusForbidden) {
		return 0, nil
	}
	
	if httpResponse != nil && httpResponse.StatusCode != http.StatusOK {
		return -1, errors.New(fmt.Sprintf("conductor server responded with status code: %s", httpResponse.Status))
	}
	
	if err != nil {
		return -1, err
	}
	
	return workflow.Version, nil
}
