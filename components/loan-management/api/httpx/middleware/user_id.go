package middleware

import (
	httpxerrors "github.com/btechlabs/lms/api/httpx/errors"
	"net/http"
)

// UserIDHeader is the name of the HTTP Header which contains the user id
// of the authenticated user.
var UserIDHeader = "X-User-Id"

// UserId is a middleware that verifies the headers of the request
// which must contain the X-User-Id header.
func UserId(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		if r.Header.Get(UserIDHeader) == "" {
			httpxerrors.ErrMissingXUserId(ctx, w)
			return
		}

		next.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}
