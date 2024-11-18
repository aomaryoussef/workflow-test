package dynamics

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/config"
	dynamicsgen "github.com/btechlabs/lms/gen/dynamics"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"net/http"
	"strconv"
	"sync"
	"time"
)

var (
	dynamicsAuthResponse *DynamicsAuthResponse
)

type DynamicsAuthResponse struct {
	*dynamicsgen.AuthoriseResponse
}

// IsTokenValid checks if the Dynamics authentication token is still valid.
// It compares the current epoch time with the token's expiry time.
// The token is considered valid if the current time is before the expiry time
// and there is at least a 5-second buffer before the token expires.
//
// Returns:
// - true if the token is valid.
// - false if the token is invalid or if there was an error parsing the expiry time.
func (dar *DynamicsAuthResponse) IsTokenValid() bool {
	epoch := time.Now().Unix()
	expiry, err := strconv.ParseInt(dar.ExpiresOn, 10, 64)
	if err != nil {
		return false
	}
	return epoch < expiry && epoch-expiry >= 5
}

type DynamicsClient struct {
	authClient       *dynamicsgen.ClientWithResponses
	authTenantId     string
	authClientId     string
	authClientSecret string
	authResource     string
	authGrantType    string

	ledgerClient *dynamicsgen.ClientWithResponses

	authLock sync.Mutex
}

func NewDynamicsClient(c config.Config) *DynamicsClient {
	httpClient := otelx.NewHttpClient(c.TelemetryConfig.Enabled)
	authClient, _ := dynamicsgen.NewClientWithResponses(
		c.GlConfig.Auth.Url,
		dynamicsgen.WithHTTPClient(&httpClient),
	)
	ledgerClient, _ := dynamicsgen.NewClientWithResponses(
		c.GlConfig.Ledger.Url,
		dynamicsgen.WithHTTPClient(&httpClient),
	)
	return &DynamicsClient{
		authClient:       authClient,
		authTenantId:     c.GlConfig.Auth.TenantId,
		authClientId:     c.GlConfig.Auth.ClientId,
		authClientSecret: c.GlConfig.Auth.ClientSecret,
		authResource:     c.GlConfig.Auth.Resource,
		authGrantType:    c.GlConfig.Auth.GrantType,

		ledgerClient: ledgerClient,
	}
}

// authorize attempts to obtain a new Dynamics authentication token if the current one is invalid or expired.
// It locks the authorization process to ensure that token requests are serialized, preventing multiple
// simultaneous token requests. If the current token is valid, it immediately returns without making a new request.
//
// This method first checks if a valid token exists by calling IsTokenValid on the global dynamicsAuthResponse.
// If the token is invalid or not present, it proceeds to request a new token using the Dynamics client's
// GetAccessTokenWithFormdataBodyWithResponse method, passing the necessary authentication details.
//
// Parameters:
// - ctx: The context.Context instance for controlling cancellations and timeouts.
//
// Returns:
//   - An error if the token request fails or if the Dynamics service responds with a non-OK status code.
//     On success, returns nil indicating the token has been successfully refreshed or is still valid.
func (d *DynamicsClient) authorize(ctx context.Context) error {
	d.authLock.Lock()
	defer d.authLock.Unlock()

	if dynamicsAuthResponse != nil && dynamicsAuthResponse.IsTokenValid() {
		return nil
	}

	log := logging.WithContext(ctx)
	// Authorise
	authResponse, err := d.authClient.GetAccessTokenWithFormdataBodyWithResponse(ctx, d.authTenantId, dynamicsgen.GetAccessTokenFormdataRequestBody{
		ClientId:     d.authClientId,
		ClientSecret: d.authClientSecret,
		GrantType:    d.authGrantType,
		Resource:     d.authResource,
	})
	if err != nil {
		return err
	}
	if authResponse.StatusCode() != http.StatusOK {
		log.Warn(fmt.Sprintf("failed to authorize with status code: %d and response: %s", authResponse.StatusCode(), string(authResponse.Body)))
		return errors.New("failed to authorize with ms-dynamics")
	}

	dynamicsAuthResponse = &DynamicsAuthResponse{
		authResponse.JSON200,
	}

	return nil
}

// PostJournalEntries attempts to post journal entries to the Dynamics ledger.
// It ensures that there is a valid Dynamics authentication token before making the request.
// If the current token is invalid or expired, it attempts to reauthorize.
//
// Parameters:
// - ctx: The context.Context instance for controlling cancellations and timeouts.
// - body: The request body containing the journal entries to be posted.
//
// Returns:
//   - A pointer to a PostJournalEntriesResponse containing the response from the Dynamics ledger,
//     or nil if an error occurs.
//   - An error if the authorization fails, the request to post journal entries fails,
//     or if the Dynamics service responds with a non-OK status code.
//
// Note:
// - If the authorization fails, it returns an error indicating the failure to authorize.
// - If the posting of journal entries fails, it returns an error with the status code and response body.
func (d *DynamicsClient) PostJournalEntries(ctx context.Context, body dynamicsgen.PostingRequest) (*dynamicsgen.PostJournalEntriesResponse, error) {
	if dynamicsAuthResponse == nil || !dynamicsAuthResponse.IsTokenValid() {
		err := d.authorize(ctx)
		if err != nil {
			return nil, err
		}
	}
	if dynamicsAuthResponse == nil {
		return nil, errors.New("dynamics#PostJournalEntries - failed to authorize with nil response")
	}

	// Post Journal Entries
	response, err := d.ledgerClient.PostJournalEntriesWithResponse(ctx, body, AddAuthInterceptor)
	if err != nil {
		return nil, err
	}
	if response.StatusCode() != http.StatusOK {
		return nil, fmt.Errorf("dynamics#PostJournalEntries - failed to post journal entries with status code: %d and response: %s", response.StatusCode(), string(response.Body))
	}

	return response, nil
}

func AddAuthInterceptor(_ context.Context, req *http.Request) error {
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", dynamicsAuthResponse.AccessToken))
	return nil
}
