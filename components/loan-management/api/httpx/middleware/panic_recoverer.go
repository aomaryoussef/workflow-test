package middleware

import (
	"fmt"
	"github.com/btechlabs/lms/api/httpx/errors"
	"github.com/btechlabs/lms/pkg/logging"
	"net/http"
)

// Recoverer is a middleware that recovers from panics, logs the panic (and a
// backtrace), and returns a HTTP 500 (Internal Server Error) status if
// possible. Recoverer prints a request ID if one is provided.
//
// Alternatively, look at https://github.com/go-chi/httplog middleware pkgs.
func Recoverer(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			ctx := r.Context()
			log := logging.WithContext(ctx)
			if rvr := recover(); rvr != nil {
				if rvr == http.ErrAbortHandler {
					// we don't recover http.ErrAbortHandler so the response
					// to the client is aborted, this should not be logged
					panic(rvr)
				}

				if r.Header.Get("Connection") != "Upgrade" {
					log.Error(fmt.Sprintf("panic: %v", rvr))
					errors.ErrInternalServerError(ctx, w)
					return
				}
			}
		}()

		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}
