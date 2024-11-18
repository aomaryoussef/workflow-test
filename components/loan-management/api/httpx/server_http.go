package httpx

import (
	"encoding/json"
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/internal/app/infra/command_bus"
	"github.com/btechlabs/lms/internal/app/query"
	"github.com/btechlabs/lms/pkg/cqrs"
	"log/slog"
	"net/http"
	"strconv"
)

var _ api.ServerInterface = (*HttpServer)(nil)

type HttpServer struct {
	log      *slog.Logger
	cfg      config.Config
	commands command_bus.HttpCommandBus
	queries  *query.Queries
}

// HttpServerOption provides options pattern for HttpServer
type HttpServerOption func(*HttpServer)

// NewHttpServer creates a new HttpServer
func NewHttpServer(opts ...HttpServerOption) *HttpServer {
	s := &HttpServer{}
	for _, opt := range opts {
		opt(s)
	}

	return s
}

// WithLogger sets the logger for the HttpServer
func WithLogger(l *slog.Logger) HttpServerOption {
	return func(s *HttpServer) {
		s.log = l
	}
}

// WithConfig sets the config for the HttpServer
func WithConfig(c config.Config) HttpServerOption {
	return func(s *HttpServer) {
		s.cfg = c
	}
}

// WithCommands sets the command bus for the HttpServer
func WithCommands(commands command_bus.HttpCommandBus) HttpServerOption {
	return func(s *HttpServer) {
		s.commands = commands
	}
}

// WithQueries sets the queries for the HttpServer
func WithQueries(queries *query.Queries) HttpServerOption {
	return func(s *HttpServer) {
		s.queries = queries
	}
}

func SendApiResponse(w http.ResponseWriter, response interface{}, statusCode int) {
	apiResponseJson, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "internal_server_error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_, err = w.Write(apiResponseJson)
	if err != nil {
		http.Error(w, "internal_server_error", http.StatusInternalServerError)
		return
	}
}

func addETagHeader(w http.ResponseWriter, etag uint64) {
	w.Header().Set("ETag", strconv.FormatUint(etag, 10))
}

func addLocationHeader(w http.ResponseWriter, location string) {
	w.Header().Set("Location", location)
}

func logCommandProcessFailure(log *slog.Logger, cmd cqrs.Command, err error) {
	log.Warn(fmt.Sprintf("failed to process command: %s with error: %s", cmd.Type().String(), err.Error()))
}
