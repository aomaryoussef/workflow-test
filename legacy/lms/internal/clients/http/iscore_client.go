package http_client

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/btechlabs/lms-lite/pkg/http_client"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"net/http"
)

var (
	sendTransactionSlipUrl = "MC-Iscore/api/SBX/GetIScore"
)

type ScoreEngine interface {
	GetIScore(ctx context.Context, nationalId string) (*IScoreResponse, error)
}
type IScoreRequest struct {
	Userid     int    `json:"userid"`
	NationalID string `json:"nationalId"`
}
type IScoreResponse struct {
	SSN             string `json:"ssn"`
	Score           string `json:"score"`
	ConfidenceScore string `json:"confidenceScore"`
	StatusCode      int    `json:"statusCode"`
}

type IScoreClient struct {
	*http_client.BaseWebClient
}

func NewIScoreClient(protocol, host string, port int) *IScoreClient {
	return &IScoreClient{
		BaseWebClient: &http_client.BaseWebClient{
			Protocol: protocol,
			Host:     host,
			Port:     port,
		},
	}
}

func (i *IScoreClient) GetIScore(ctx context.Context, nationalId string) (*IScoreResponse, error) {
	fullUrl := fmt.Sprintf("%s/%s", i.GetBaseUrl(), sendTransactionSlipUrl)
	request := &IScoreRequest{
		Userid:     2,
		NationalID: nationalId,
	}
	iscorePayload, err := json.Marshal(request)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("failed to marshal request: %v", err)
		return nil, err
	}

	req, err := http.NewRequest(http.MethodPost, fullUrl, bytes.NewReader(iscorePayload))
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("failed to create request: %v", err)
		return nil, err
	}

	req.Header.Add("Content-Type", "application/json")

	logging.LogHandle.WithContext(ctx).Info("send IScore request")

	response, err := i.MakeRequest(ctx, req)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("failed to send request: %v", err)
		return nil, err
	}
	defer response.Body.Close()

	logging.LogHandle.WithContext(ctx).Info("received IScore response")

	responseBodyBytes, err := i.GetResponseBody(response)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("failed to get response body: %v", err)
		return nil, err
	}
	if response.StatusCode != http.StatusOK {
		logging.LogHandle.WithContext(ctx).Errorf("received status code %d: %s", response.StatusCode, responseBodyBytes)
		return nil, fmt.Errorf("received status code %d: %s", response.StatusCode, responseBodyBytes)
	}
	iscoreResponse := &IScoreResponse{}
	iscoreResponse.StatusCode = response.StatusCode
	err = json.Unmarshal(responseBodyBytes, iscoreResponse)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("failed to unmarshal response: %v", err)
		return nil, err
	}
	return iscoreResponse, err
}
