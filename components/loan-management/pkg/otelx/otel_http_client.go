package otelx

import (
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"net/http"
)

func NewHttpClient(enableTrace bool) http.Client {
	c := http.Client{}
	if enableTrace {
		c.Transport = otelhttp.NewTransport(http.DefaultTransport)
	}
	return c
}
