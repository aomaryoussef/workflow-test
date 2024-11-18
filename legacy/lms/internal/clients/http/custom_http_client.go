package http_client

import (
	"bytes"
	"context"
	"io"
	"net/http"
	
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/motemen/go-loghttp"
)

type GetHttpClientFunc func(ctx context.Context) http.Client

func GetDefaultClient(ctx context.Context) http.Client {
	return http.Client{}
}

type nopCloser struct {
	io.ReadWriter
}

func (nopCloser) Close() error { return nil }

func GetCustomHttpClient(ctx context.Context) http.Client {
	logger := logging.LogHandle.WithContext(ctx)
	client := http.Client{
		Transport: &loghttp.Transport{
			LogRequest: func(req *http.Request) {
				logger.Debugf("%s %s", req.Method, req.URL)
				if req.Body != nil {
					buf := nopCloser{&bytes.Buffer{}}
					tee := io.TeeReader(req.Body, &buf)
					body, err := io.ReadAll(tee)
					req.Body = buf
					if err != nil {
						logger.Errorf("Error reading body of request with message ", err)
					} else {
						logger.Debugf("%s %s %s", req.Method, req.URL, body)
					}
				}
			},
			LogResponse: func(resp *http.Response) {
				if resp.Body != nil {
					buf := nopCloser{&bytes.Buffer{}}
					tee := io.TeeReader(resp.Body, &buf)
					body, err := io.ReadAll(tee)
					resp.Body = buf
					if err != nil {
						logger.Errorf("Error reading body of response with message ", err)
					} else {
						logger.Debugf("%d %s %s", resp.StatusCode, resp.Request.URL, body)
					}
				}
				logger.Debugf("%d %s", resp.StatusCode, resp.Request.URL)
			},
		},
	}
	
	return client
}
