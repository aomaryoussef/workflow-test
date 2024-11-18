package http_client

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"
	
	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/pkg/logging"
)

var _ MSDynamicsClient = (*HttpMSDynamicsClient)(nil)

type HttpMSDynamicsClient struct {
	httpClient   GetHttpClientFunc
	config       config.EnvConfig
	authClient   *ActiveDirectoryAuthClient
	authResponse *ActiveDirectoryAuthResponse
}

func NewHttpMSDynamicsClient(config config.EnvConfig) *HttpMSDynamicsClient {
	return &HttpMSDynamicsClient{
		authClient: NewActiveDirectoryAuthClient(config),
		httpClient: GetCustomHttpClient,
		config:     config,
	}
}

func (c *HttpMSDynamicsClient) authorize(ctx context.Context) (string, error) {
	logger := logging.LogHandle.WithContext(ctx)
	if c.authResponse != nil {
		ts, err := strconv.ParseInt(c.authResponse.ExpiresOn, 10, 64)
		if err == nil {
			tokenExpires := time.Unix(ts, 0)
			if time.Now().Before(tokenExpires) {
				logger.Debugf("ms_dynamics_client_http#authorize - dynamics auth token is still alive, skipping auth")
				return c.authResponse.AccessToken, nil // auth token still live
			}
		}
	}
	authToken, err := c.authClient.Authorize(ctx)
	if err != nil {
		return "", err
	}
	logger.Debugf("ms_dynamics_client_http#authorize - dynamics auth token acquired and saved")
	c.authResponse = authToken
	return c.authResponse.AccessToken, nil
}

func (c *HttpMSDynamicsClient) MakeRequest(ctx context.Context, path string, payload []byte) ([]byte, error) {
	logger := logging.LogHandle.WithContext(ctx)
	accessToken, err := c.authorize(ctx)
	method := http.MethodPost
	url := fmt.Sprintf("%s%s", c.config.MicrosoftDynamics.Url, path)
	if err != nil {
		return nil, fmt.Errorf("ms_dynamics_client_http#MakeRequest - error authorizing request: %s with error: %v", url, err)
	}
	request, err := http.NewRequest(method, url, bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("ms_dynamics_client_http#MakeRequest - error creating request: %s with error: %v", url, err)
	}
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	
	httpClient := c.httpClient(ctx)
	response, err := httpClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("ms_dynamics_client_http#MakeRequest - error sending request: %s with error: %s", url, err.Error())
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			errMsg := fmt.Sprintf("ms_dynamics_client_http#MakeRequest - error closing response body: %s with error: %v", url, err)
			logger.Error(errMsg)
		}
	}(response.Body)
	
	responseBodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("ms_dynamics_client_http#MakeRequest - error reading response body for request: %s with error: %v", url, err)
	}
	
	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("ms_dynamics_client_http#MakeRequest - dynamics responded with status code: %d for request: %s", response.StatusCode, url)
	}
	
	return responseBodyBytes, nil
}
