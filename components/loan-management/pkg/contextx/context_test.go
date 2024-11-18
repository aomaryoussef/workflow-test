package contextx

import (
	"context"
	"github.com/stretchr/testify/assert"
	"net/http"
	"testing"
)

func TestContextFromHttpRequest(t *testing.T) {
	t.Run("when httpx request contains all defined headers, then the context will ensure setting them up", func(t *testing.T) {
		req, err := http.NewRequest("GET", "https://example.com", nil)
		if err != nil {
			t.Errorf("Error creating httpx request: %v", err)
		}
		req.Header.Set("request_id", "123")
		req.Header.Set("user_id", "456")
		req.Header.Set("calling_system_id", "789")

		expected := context.WithValue(context.Background(), ContextKeyRequestId, "123")
		expected = context.WithValue(expected, ContextKeyUserId, "456")
		expected = context.WithValue(expected, ContextKeyCallingSystemId, "789")

		actual := ContextFromHttpRequest(req)

		if actual.Value(ContextKeyRequestId) != expected.Value(ContextKeyRequestId) {
			t.Errorf("Expected %v, got %v", expected.Value(ContextKeyRequestId), actual.Value(ContextKeyRequestId))
		}
		if actual.Value(ContextKeyUserId) != expected.Value(ContextKeyUserId) {
			t.Errorf("Expected %v, got %v", expected.Value(ContextKeyUserId), actual.Value(ContextKeyUserId))
		}
		if actual.Value(ContextKeyCallingSystemId) != expected.Value(ContextKeyCallingSystemId) {
			t.Errorf("Expected %v, got %v", expected.Value(ContextKeyCallingSystemId), actual.Value(ContextKeyCallingSystemId))
		}
	})

	t.Run("when httpx request contains only request_id header, then the context will ensure setting only request_id", func(t *testing.T) {
		req, err := http.NewRequest("GET", "https://example.com", nil)
		if err != nil {
			t.Errorf("Error creating httpx request: %v", err)
		}
		req.Header.Set("request_id", "123")
		expected := context.WithValue(context.Background(), ContextKeyRequestId, "123")

		actual := ContextFromHttpRequest(req)
		if actual.Value(ContextKeyRequestId) != expected.Value(ContextKeyRequestId) {
			t.Errorf("Expected %v, got %v", expected.Value(ContextKeyRequestId), actual.Value(ContextKeyRequestId))
		}
		assert.Nil(t, actual.Value(ContextKeyUserId))
		assert.Nil(t, actual.Value(ContextKeyCallingSystemId))
	})

	t.Run("when httpx request contains only user_id header, then the context will ensure setting only user_id", func(t *testing.T) {
		req, err := http.NewRequest("GET", "https://example.com", nil)
		if err != nil {
			t.Errorf("Error creating httpx request: %v", err)
		}
		req.Header.Set("user_id", "456")
		expected := context.WithValue(context.Background(), ContextKeyUserId, "456")
		actual := ContextFromHttpRequest(req)
		if actual.Value(ContextKeyUserId) != expected.Value(ContextKeyUserId) {
			t.Errorf("Expected %v, got %v", expected.Value(ContextKeyUserId), actual.Value(ContextKeyUserId))
		}
		assert.Nil(t, actual.Value(ContextKeyRequestId))
		assert.Nil(t, actual.Value(ContextKeyCallingSystemId))
	})

	t.Run("when httpx request contains only calling_system_id header, then the context will ensure setting only calling_system_id", func(t *testing.T) {
		req, err := http.NewRequest("GET", "https://example.com", nil)
		if err != nil {
			t.Errorf("Error creating httpx request: %v", err)
		}
		req.Header.Set("calling_system_id", "456")
		expected := context.WithValue(context.Background(), ContextKeyCallingSystemId, "456")
		actual := ContextFromHttpRequest(req)
		if actual.Value(ContextKeyCallingSystemId) != expected.Value(ContextKeyCallingSystemId) {
			t.Errorf("Expected %v, got %v", expected.Value(ContextKeyCallingSystemId), actual.Value(ContextKeyCallingSystemId))
		}
		assert.Nil(t, actual.Value(ContextKeyRequestId))
		assert.Nil(t, actual.Value(ContextKeyUserId))
	})

	t.Run("when httpx request contains no headers, then the context will be empty", func(t *testing.T) {
		req, err := http.NewRequest("GET", "https://example.com", nil)
		if err != nil {
			t.Errorf("Error creating httpx request: %v", err)
		}
		actual := ContextFromHttpRequest(req)
		assert.Nil(t, actual.Value(ContextKeyRequestId))
		assert.Nil(t, actual.Value(ContextKeyUserId))
		assert.Nil(t, actual.Value(ContextKeyCallingSystemId))
	})
}
