package graphql

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/money"
)

const (
	validateCommercialOfferQuery = `query($body: MyloCommercialOffersInput!) {
										validateMyloCommercialOffers(body: $body) {
											status
											rejection_reason
											offers_details {
												status
												rejection_reason
												offer_details {
													admin_fee {
														currency_code
														units
													}
													annual_interest_percentage
													down_payment {
														currency_code
														units
													}
													financed_amount {
														currency_code
														units
													}
													id
													interest_rate_per_tenure
													monthly_instalment {
														currency_code
														units
													}
													tenure
													total_amount {
														currency_code
														units
													}
												}
											} 
										}
									}`
)

type CreditRiskClient interface {
	FilterCommercialOffers(ctx context.Context, request *CommercialOffersRequest) (*CommercialOffersResponse, error)
}

type creditRiskClient struct {
	baseUrl   string
	authToken string
	client    *http.Client
}

func NewCreditRiskClient(baseUrl, authToken string) CreditRiskClient {
	return &creditRiskClient{
		baseUrl:   baseUrl,
		authToken: fmt.Sprintf("Bearer %s", authToken),
		client:    &http.Client{},
	}
}

type CommercialOffer struct {
	Status          RequestStatus `json:"status"`
	RejectionReason string        `json:"rejection_reason"`
	OfferDetails    OfferDetails  `json:"offer_details"`
}

type OfferDetails struct {
	Id                       string                   `json:"id"`
	Tenure                   string                   `json:"tenure"`
	AdminFee                 *money.SerializableMoney `json:"admin_fee"`
	FinancedAmount           *money.SerializableMoney `json:"financed_amount"`
	TotalAmount              *money.SerializableMoney `json:"total_amount"`
	AnnualInterestPercentage string                   `json:"annual_interest_percentage"`
	InterestRatePerTenure    string                   `json:"interest_rate_per_tenure"`
	DownPayment              *money.SerializableMoney `json:"down_payment"`
	MonthlyInstalment        *money.SerializableMoney `json:"monthly_instalment"`
	Status                   *RequestStatus           `json:"status,omitempty"`
}

type RequestStatus string

const (
	APPROVED_ACTIVE RequestStatus = "APPROVED_ACTIVE"
	DECLINED        RequestStatus = "DECLINED"
	UNAVAILABLE     RequestStatus = "UNAVAILABLE"
	INVALID         RequestStatus = "INVALID"
)

func (s RequestStatus) String() string {
	return string(s)
}

type GraphqlRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables"`
}

type CommercialOffersRequest struct {
	Request struct {
		SSN    string          `json:"ssn"`
		Offers []*OfferDetails `json:"offers_details"`
	} `json:"body"`
}

type CommercialOffersResponse struct {
	ResponseData struct {
		ValidatedOffers struct {
			Status          RequestStatus      `json:"status"`
			RejectionReason string             `json:"rejection_reason"`
			OffersDetails   []*CommercialOffer `json:"offers_details"`
		} `json:"validateMyloCommercialOffers"`
	} `json:"data"`
}

func (cr *creditRiskClient) callGraphql(ctx context.Context, query string, request interface{}, response interface{}) error {
	logger := logging.LogHandle.WithContext(ctx)

	jsonBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("error marshaling request: %s", err.Error())
		return fmt.Errorf("error marshaling request: %s", err.Error())
	}
	var variables map[string]interface{}
	if err := json.Unmarshal(jsonBytes, &variables); err != nil {
		logger.Errorf("error unmarshalling request(variables): %s", err.Error())
		return fmt.Errorf("error unmarshaling request(variables): %s", err.Error())
	}
	graphqlRequest := GraphqlRequest{
		Query:     query,
		Variables: variables,
	}
	graphqlBody, err := json.Marshal(graphqlRequest)
	if err != nil {
		return fmt.Errorf("error marshaling request body: %s", err.Error())
	}
	logger.Infof("Making GraphQL request: %s", string(graphqlBody))

	req, err := http.NewRequest(http.MethodPost, cr.baseUrl, bytes.NewBuffer(graphqlBody))
	if err != nil {
		return fmt.Errorf("error creating HTTP request: %s", err.Error())
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", cr.authToken)

	resp, err := cr.client.Do(req)
	if err != nil {
		return fmt.Errorf("error sending HTTP request: %s", err.Error())
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			logger.Errorf("error closing response body: %s", err.Error())
			return
		}
	}(resp.Body)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logger.Errorf("error reading response body: %s", err.Error())
		return fmt.Errorf("error reading response body: %s", err.Error())
	}

	if resp.StatusCode != http.StatusOK {
		logger.Errorf("status code: %d, status: %s", resp.StatusCode, resp.Status)
		return fmt.Errorf("status code: %d, status: %s", resp.StatusCode, resp.Status)
	}

	err = json.Unmarshal(body, &response)
	if err != nil {
		logger.Errorf("error unmarshalling response body: %s", err.Error())
		return fmt.Errorf("error unmarshalling response body: %s", err.Error())
	}

	responseBytes, err := json.Marshal(response)
	if err == nil {
		logger.Infof("Update Credit Limit GraphQL response: %s", string(responseBytes))
	}

	logger.Info("GraphQL request successful")
	return nil
}


func (cr *creditRiskClient) FilterCommercialOffers(ctx context.Context, request *CommercialOffersRequest) (*CommercialOffersResponse, error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("filtering commercial offers")
	response := CommercialOffersResponse{}
	err := cr.callGraphql(ctx, validateCommercialOfferQuery, request, &response)
	if err != nil {
		return nil, err
	}
	logger.Info("Client called filter commercial offers GraphQL successfully")
	return &response, nil
}

