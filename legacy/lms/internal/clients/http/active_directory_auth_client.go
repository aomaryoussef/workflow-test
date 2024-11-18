package http_client

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	
	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/pkg/logging"
)

const (
	authUrl = "/oauth2/token"
)

type ActiveDirectoryAuth interface {
	Authorize(ctx context.Context, config config.EnvConfig) (*ActiveDirectoryAuthResponse, error)
}

type ActiveDirectoryAuthResponse struct {
	TokenType    string `json:"token_type"`
	ExpiresIn    string `json:"expires_in"`
	ExtExpiresIn string `json:"ext_expires_in"`
	ExpiresOn    string `json:"expires_on"`
	NotBefore    string `json:"not_before"`
	Resource     string `json:"resource"`
	AccessToken  string `json:"access_token"`
}

type ActiveDirectoryAuthClient struct {
	config config.EnvConfig
	client GetHttpClientFunc
}

func NewActiveDirectoryAuthClient(config config.EnvConfig) *ActiveDirectoryAuthClient {
	return &ActiveDirectoryAuthClient{
		config: config,
		client: GetCustomHttpClient,
	}
}

func (c *ActiveDirectoryAuthClient) Authorize(ctx context.Context) (*ActiveDirectoryAuthResponse, error) {
	logger := logging.LogHandle.WithContext(ctx)
	url := fmt.Sprintf("%s%s%s", c.config.ActiveDirectory.Url, c.config.ActiveDirectory.TenantId, authUrl)
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)
	err := writer.WriteField("grant_type", c.config.ActiveDirectory.GrantType)
	if err != nil {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - error writing field: %s with err: %v", "grant_type", err)
	}
	err = writer.WriteField("client_id", c.config.ActiveDirectory.ClientId)
	if err != nil {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - error writing field: %s with err: %v", "client_id", err)
	}
	err = writer.WriteField("client_secret", c.config.ActiveDirectory.ClientSecret)
	if err != nil {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - error writing field: %s with err: %v", "client_secret", err)
	}
	err = writer.WriteField("resource", c.config.ActiveDirectory.Resource)
	if err != nil {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - error writing field: %s with err: %v", "resource", err)
	}
	err = writer.Close()
	if err != nil {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - error closing writer with err: %v", err)
	}
	request, err := http.NewRequest(http.MethodGet, url, &requestBody)
	if err != nil {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - error creating request: %v", err)
	}
	
	request.Header.Set("Content-Type", writer.FormDataContentType())
	httpClient := c.client(ctx)
	response, err := httpClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - error sending request: %v", err)
	}
	defer func(Body io.ReadCloser) {
		e := Body.Close()
		if e != nil {
			logger.Errorf("active_directory_auth_client#authorize - error closing response requestBody: %v", e)
		}
	}(response.Body)
	
	responseBodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - authorize request responded with code: %d but error reading response body: %v", response.StatusCode, err)
	}
	
	if response.StatusCode != 200 {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - authorize request responded with code: %d and message: %s", response.StatusCode, string(responseBodyBytes))
	}
	
	var responseData ActiveDirectoryAuthResponse
	err = json.Unmarshal(responseBodyBytes, &responseData)
	if err != nil {
		return nil, fmt.Errorf("active_directory_auth_client#authorize - error decoding authz response with err: %v", err)
	}
	return &responseData, nil
}
