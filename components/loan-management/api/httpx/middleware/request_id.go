package middleware

import (
	"github.com/btechlabs/lms/pkg/uid"
	"net/http"
)

// RequestIDHeader is the name of the HTTP Header which contains the request id.
// Exported so that it can be changed by developers
var RequestIDHeader = "X-Request-Id"

// RequestID is a middleware that injects a request ID into the context of each
// request if there isn't one already there.
func RequestID(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		requestID := r.Header.Get(RequestIDHeader)
		if requestID == "" {
			requestID = uid.MustNewUUID()
		}
		r.Header.Set(RequestIDHeader, requestID)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
	return http.HandlerFunc(fn)
}
