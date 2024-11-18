package http_client

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"io"
	"net/http"
)

var (
	health_url = "health"
)

type Conductor interface {
	GetConductorHealth(ctx context.Context) (*ConductorHealthResponse, error)
}

type ConductorHealthResponse struct {
	Healthy bool `json:"healthy"`
}

type ConductorClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewConductorHttpClient(baseURL string) *ConductorClient {
	return &ConductorClient{
		BaseURL:    baseURL,
		HTTPClient: &http.Client{},
	}
}

func (c *ConductorClient) GetConductorHealth(ctx context.Context) (*ConductorHealthResponse, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/%s", c.BaseURL, health_url), nil)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("failed to create conductor health request: %v", err)
		return nil, err
	}
	logging.LogHandle.WithContext(ctx).Info("send conductor health request")
	response, err := c.HTTPClient.Do(req)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("failed to send request: %v", err)
		return nil, err
	}
	defer response.Body.Close()
	logging.LogHandle.WithContext(ctx).Info("received conductor health response")
	
	responseBodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("failed to get response body: %v", err)
		return nil, err
	}
	if response.StatusCode != http.StatusOK {
		logging.LogHandle.WithContext(ctx).Errorf("received status code %d: %s", response.StatusCode, responseBodyBytes)
		return nil, fmt.Errorf("received status code %d: %s", response.StatusCode, responseBodyBytes)
	}
	conductorHealthResponse := &ConductorHealthResponse{}
	err = json.Unmarshal(responseBodyBytes, conductorHealthResponse)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("failed to unmarshal response body: %v", err)
		return nil, err
	}
	return conductorHealthResponse, nil
}
