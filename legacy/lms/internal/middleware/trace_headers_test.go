package middleware

import (
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTraceHeadersMiddleware(t *testing.T) {
	testCases := []struct {
		name            string
		requestHeaders  map[string]string
		expectedHeaders map[string][]string
		expectedStatus  int
		expectedBody    string
	}{
		{
			name: "Headers copied successfully",
			requestHeaders: map[string]string{
				"Content-Type": "application/json",
			},
			expectedHeaders: map[string][]string{
				"Content-Type": []string{"application/json"},
			},
			expectedStatus: http.StatusOK,
			expectedBody:   "OK",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Create a handler that will be wrapped by the middleware
			handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				_, err := w.Write([]byte("OK"))
				if err != nil {
					log.Fatal("error writing response")
				}
			})

			// Wrap the handler with the middleware
			middlewareHandler := TraceHeaders(handler)

			// Create a mock request for testing
			req, err := http.NewRequest("GET", "/test", nil)
			if err != nil {
				t.Fatal(err)
			}

			// Set request headers
			for key, value := range tc.requestHeaders {
				req.Header.Set(key, value)
			}

			// Create a mock response recorder
			w := httptest.NewRecorder()

			// Call the middleware handler
			middlewareHandler.ServeHTTP(w, req)

			// Convert http.Header to map[string][]string for comparison
			actualHeaders := make(map[string][]string, len(w.Header()))
			for key, values := range w.Header() {
				actualHeaders[key] = values
			}

			// Use assert for easier and more readable assertions
			assert.Equal(t, tc.expectedHeaders, actualHeaders, "Headers are not copied as expected")
			assert.Equal(t, tc.expectedStatus, w.Code, "Unexpected status code")
			assert.Equal(t, tc.expectedBody, w.Body.String(), "Unexpected response body")
		})
	}
}
