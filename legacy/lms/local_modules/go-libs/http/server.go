package http

import (
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"
	"time"
)

const (
	MaxHeaderBytes = 1024
	DefaultPort    = 3000
)

type serverInfoContextKey string

var serverInfoKey serverInfoContextKey = "_serverInfo"

type HttpServerOption func(*HttpServer)

// HttpServer defines parameters for running
// an HTTP server. Currently, the bind address
// is 0.0.0.0:<port>. If no port is specified
// (:3000) is used.
//
// Usage:
//
//	func main() {
//	  srv := http.NewHttpServer(
//			http.WithAppName("test"),
//		 )
//		 go func() {
//			err := srv.Start(context.Background())
//			if err != nil && !errors.Is(err, http.ErrServerClosed) {
//				panic(err)
//			}
//		 }()
//
//		 stopCh, closeCh := createChannel()
//		 defer closeCh()
//		 log.Println("notified:", <-stopCh)
//
//		 ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
//		 defer cancel()
//
//		 if err := srv.Stop(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
//			panic(err)
//		 } else {
//			log.Println("application shutdown")
//		 }
//	}
//
//	func createChannel() (chan os.Signal, func()) {
//		stopCh := make(chan os.Signal, 1)
//		signal.Notify(stopCh, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)
//
//		return stopCh, func() {
//			close(stopCh)
//		}
//	}
type HttpServer struct {
	port        int          // Default 3000
	app         string       // Default my-hammerhead-app
	readTimeout int          // Default 5 Seconds
	handler     http.Handler // handler to invoke, http.DefaultServeMux if nil
	srv         *http.Server
}

func WithPort(port int) HttpServerOption {
	return func(h *HttpServer) {
		h.port = port
	}
}
func WithAppName(name string) HttpServerOption {
	return func(h *HttpServer) {
		h.app = name
	}
}
func WithReadTimeout(timeout int) HttpServerOption {
	return func(h *HttpServer) {
		h.readTimeout = timeout
	}
}
func WithHandler(handler http.Handler) HttpServerOption {
	return func(h *HttpServer) {
		h.handler = handler
	}
}

func NewHttpServer(opts ...HttpServerOption) (httpSrv *HttpServer) {
	httpSrv = &HttpServer{
		port: DefaultPort,
		app:  "my-hammerhead-app",
		srv:  &http.Server{},
	}
	for _, opt := range opts {
		opt(httpSrv)
	}
	return
}

func (s *HttpServer) Start(ctx context.Context) (err error) {
	s.srv.Addr = fmt.Sprintf(":%d", s.port)
	s.srv.Handler = s.handler
	s.srv.ReadTimeout = 5 * time.Second
	s.srv.MaxHeaderBytes = MaxHeaderBytes
	s.srv.BaseContext = func(l net.Listener) context.Context {
		ctx = context.Background()
		ctx = context.WithValue(ctx, serverInfoKey, s.app)
		return ctx
	}

	if err = s.srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return
	}

	return
}
func (s *HttpServer) Stop(ctx context.Context) (err error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	err = s.srv.Shutdown(ctx)
	return
}
