package server

import (
	"context"
	"net/http"
	
	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/pkg/logging"
)

type HttpServer struct {
	server  *http.Server
	address string
}

func NewHttpServer(config config.EnvConfig, router http.Handler) *HttpServer {
	
	server := &http.Server{
		Addr:         config.HttpServer.ServerAddress,
		Handler:      router,
		ReadTimeout:  config.HttpServer.ReadTimeout,
		WriteTimeout: config.HttpServer.WriteTimeout,
		IdleTimeout:  config.HttpServer.IdleTimeout,
	}
	return &HttpServer{
		server:  server,
		address: config.HttpServer.ServerAddress,
	}
}

// Run starts the HTTP server.
func (s *HttpServer) Run() error {
	logging.LogHandle.Infof("Server listening on %s", s.address)
	return s.server.ListenAndServe()
}

// Stop gracefully stops the HTTP server.
func (s *HttpServer) Stop(ctx context.Context) error {
	logging.LogHandle.WithContext(ctx).Infof("Server shutting down")
	return s.server.Shutdown(ctx)
}
