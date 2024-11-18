package http_client

import (
	"context"
	"errors"
	"github.com/stretchr/testify/mock"
	"reflect"
	"testing"
)

type MockConductorClient struct {
	mock.Mock
}

func (m *MockConductorClient) GetConductorHealth(ctx context.Context) (*ConductorHealthResponse, error) {
	args := m.Called(ctx)
	return args.Get(0).(*ConductorHealthResponse), args.Error(1)
}

func TestConductorClient_GetConductorHealth(t *testing.T) {
	testCases := []struct {
		name             string
		mockResponse     *ConductorHealthResponse
		mockError        error
		expectedResponse *ConductorHealthResponse
		expectedError    error
	}{
		{
			name:             "successful response",
			mockResponse:     &ConductorHealthResponse{Healthy: true},
			mockError:        nil,
			expectedResponse: &ConductorHealthResponse{Healthy: true},
			expectedError:    nil,
		},
		{
			name:             "error response",
			mockResponse:     nil,
			mockError:        errors.New("test error"),
			expectedResponse: nil,
			expectedError:    errors.New("test error"),
		},
	}
	
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Create a mocked ConductorClient
			mockClient := new(MockConductorClient)
			// Set up mock expectations
			mockClient.On("GetConductorHealth", mock.Anything).Return(tc.mockResponse, tc.mockError)
			result, err := mockClient.GetConductorHealth(context.Background())
			// Validate expectations were met
			mockClient.AssertExpectations(t)
			if tc.expectedError != nil {
				if err == nil {
					t.Errorf("expected error: %v, got: nil", tc.expectedError)
				} else if err.Error() != tc.expectedError.Error() {
					t.Errorf("expected error: %v, got: %v", tc.expectedError, err)
				}
			}
			if tc.expectedError == nil {
				if err != nil {
					t.Errorf("expected error: nil, got: %v", err)
				}
				if !reflect.DeepEqual(result, tc.expectedResponse) {
					t.Errorf("expected response: %v, got: %v", tc.expectedResponse, result)
				}
			}
		})
	}
}
