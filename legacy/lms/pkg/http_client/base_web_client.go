package http_client

import (
	"context"
	"fmt"
	"io"
	"net/http"
)

type BaseWebClient struct {
	Host     string
	Port     int
	Protocol string
	Client   http.Client
}

// GetBaseUrl returns the URL prefix of the web client.
//
// It concatenates the protocol, host, and port of the web client into a URL prefix string.
// The web client's protocol, host, and port are accessed through its fields.
// The URL prefix is constructed using the Sprintf function from the fmt package.
// It returns the URL prefix as a string.
func (c *BaseWebClient) GetBaseUrl() string {
	return fmt.Sprintf("%s://%s:%d", c.Protocol, c.Host, c.Port)
}

// GetResponseBody reads the response body from an HTTP response and returns it along with any error encountered.
//
// The function takes in a pointer to a http.Response object as its parameter and returns a []byte and an error.
func (c *BaseWebClient) GetResponseBody(resp *http.Response) ([]byte, error) {
	body, err := io.ReadAll(resp.Body)
	return body, err
}

// MakeRequest makes an HTTP request using the provided context and request object.
//
// It takes the following parameters:
// - ctx: The context.Context object used to control the request's lifecycle.
// - req: The http.Request object containing the details of the request.
//
// It returns the following:
// - resp: The http.Response object representing the response of the request.
// - err: An error object representing any error that occurred during the request.
func (c *BaseWebClient) MakeRequest(ctx context.Context, req *http.Request) (*http.Response, error) {
	resp, err := c.Client.Do(req)
	return resp, err
}
