package middleware

import (
	"context"
	"github.com/btechlabs/lms/pkg/contextx"
	"net/http"
)

func ContextSetUp(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		userId := r.Header.Get("x-user-id")
		requestId := r.Header.Get("x-request-id")
		ctx = context.WithValue(ctx, contextx.ContextKeyUserId, userId)
		ctx = context.WithValue(ctx, contextx.ContextKeyRequestId, requestId)
		ctx = context.WithValue(ctx, contextx.ContextKeyCallingSystemId, "http-api")

		next.ServeHTTP(w, r.WithContext(ctx))
	}
	return http.HandlerFunc(fn)
}
