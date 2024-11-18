package middleware

import "net/http"

func TraceHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		for key, values := range r.Header {
			w.Header()[key] = values
		}

		next.ServeHTTP(w, r)
	})
}
