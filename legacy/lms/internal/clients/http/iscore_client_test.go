package http_client

import (
	"context"
	"errors"
	"github.com/stretchr/testify/mock"
	"testing"
)

type MockIscoreClient struct {
	mock.Mock
}

func (m *MockIscoreClient) GetIScore(ctx context.Context, nationalId string) (*IScoreResponse, error) {
	args := m.Called(ctx, nationalId)
	return args.Get(0).(*IScoreResponse), args.Error(1)
}

func TestGetIScore(t *testing.T) {
	// Create a mocked IScoreClient
	mockClient := new(MockIscoreClient)

	// Define test cases
	testCases := []struct {
		nationalID       string
		mockResponse     *IScoreResponse
		mockError        error
		expectedResponse *IScoreResponse
		expectedError    error
	}{
		// Test Case 1: Successful response
		{
			nationalID: "123456789",
			mockResponse: &IScoreResponse{
				SSN:             "123-45-6789",
				Score:           "750",
				ConfidenceScore: "750",
				StatusCode:      200,
			},
			mockError: nil,
			expectedResponse: &IScoreResponse{
				SSN:             "123-45-6789",
				Score:           "750",
				ConfidenceScore: "750",
				StatusCode:      200,
			},
			expectedError: nil,
		},

		// Test Case 2: Error marshalling request
		{
			nationalID:       "error_marshal",
			mockResponse:     nil,
			mockError:        errors.New("Test Error"),
			expectedResponse: nil,
			expectedError:    errors.New("Test Error"),
		},

		// Test Case 3: Error creating request
		{
			nationalID:       "error_request",
			mockResponse:     nil,
			mockError:        errors.New("Test Error"),
			expectedResponse: nil,
			expectedError:    errors.New("Test Error"),
		},

		// Test Case 4: Error sending request
		{
			nationalID:       "error_send",
			mockResponse:     nil,
			mockError:        errors.New("Test Error"),
			expectedResponse: nil,
			expectedError:    errors.New("Test Error"),
		},

		// Test Case 5: Non-OK status code
		{
			nationalID: "non_ok_status",
			mockResponse: &IScoreResponse{
				StatusCode: 404,
			},
			mockError:        errors.New("Received non-OK status code 404"),
			expectedResponse: nil,
			expectedError:    errors.New("Received non-OK status code 404"),
		},

		// Test Case 6: Successful response with different data
		{
			nationalID: "custom_data",
			mockResponse: &IScoreResponse{
				SSN:             "987-65-4321",
				Score:           "700",
				ConfidenceScore: "700",
				StatusCode:      200,
			},
			mockError: nil,
			expectedResponse: &IScoreResponse{
				SSN:             "987-65-4321",
				Score:           "700",
				ConfidenceScore: "700",
				StatusCode:      200,
			},
			expectedError: nil,
		},
	}

	for _, tc := range testCases {
		// Set up mock expectations
		mockClient.On("GetIScore", mock.Anything, tc.nationalID).Return(tc.mockResponse, tc.mockError)

		// Call the GetIScore function
		result, err := mockClient.GetIScore(context.Background(), tc.nationalID)

		// Check the result
		if err != nil && err.Error() != tc.expectedError.Error() {
			t.Errorf("Expected error: %v, got: %v", tc.expectedError, err)
		}
		if (result == nil && tc.expectedResponse != nil) ||
			(result != nil && tc.expectedResponse != nil && *result != *tc.expectedResponse) {
			t.Errorf("Expected response to match, got: %+v", result)
		}

		// Reset mock expectations for the next test case
		mockClient.AssertExpectations(t)
	}
}
