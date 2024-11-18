package httpx

import (
	"github.com/btechlabs/lms/pkg/logging"
	"net/http"
)

func (s *HttpServer) Ping(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	log := logging.WithContext(ctx)
	log.Info("Ping request received")

	_, err := w.Write([]byte("pong"))
	if err != nil {
		return
	}
}
