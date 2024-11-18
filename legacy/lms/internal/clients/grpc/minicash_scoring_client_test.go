package grpc

import (
	"context"
	"errors"
	pb "github.com/btechlabs/lms-lite/internal/clients/grpc/pb"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"google.golang.org/grpc"
	"testing"
)

type MockScoringServiceClient struct {
	mock.Mock
}

func (m *MockScoringServiceClient) GetCreditLimit(ctx context.Context, in *pb.GetCreditLimitRequest, opts ...grpc.CallOption) (*pb.GetCreditLimitResponse, error) {
	args := m.Called(ctx, in, opts)
	return args.Get(0).(*pb.GetCreditLimitResponse), args.Error(1)
}

func (m *MockScoringServiceClient) Close() error {
	args := m.Called()
	return args.Error(0)
}

func TestCreditService_GetCreditLimit(t *testing.T) {
	tests := []struct {
		name         string
		request      *pb.GetCreditLimitRequest
		mockResponse *pb.GetCreditLimitResponse
		mockError    error
		expectedResp *pb.GetCreditLimitResponse
		expectedErr  error
	}{
		{
			name: "Success",
			request: &pb.GetCreditLimitRequest{
				MobileNumber: "1234567890",
			},
			mockResponse: &pb.GetCreditLimitResponse{
				UserExists:  true,
				CreditLimit: 1000,
			},
			expectedResp: &pb.GetCreditLimitResponse{
				UserExists:  true,
				CreditLimit: 1000,
			},
			expectedErr: nil,
		},
		{
			name: "Success with user not exists",
			request: &pb.GetCreditLimitRequest{
				MobileNumber: "1234567890",
			},
			mockResponse: &pb.GetCreditLimitResponse{},
			expectedResp: &pb.GetCreditLimitResponse{
				UserExists:  false,
				CreditLimit: 0,
			},
			expectedErr: nil,
		},
		{
			name: "Error",
			request: &pb.GetCreditLimitRequest{
				MobileNumber: "1234567890",
			},
			mockResponse: nil,
			mockError:    errors.New("Test error"),
			expectedResp: nil,
			expectedErr:  errors.New("Test error"),
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			mockScoringClient := new(MockScoringServiceClient)
			client := &Client{
				conn:          nil,
				scoringClient: mockScoringClient,
			}

			mockScoringClient.On("GetCreditLimit", mock.Anything, test.request, mock.Anything).
				Return(test.mockResponse, test.mockError)

			response, err := client.CreditService().GetCreditLimit(context.Background(), test.request)

			assert := assert.New(t)
			assert.Equal(test.expectedResp, response)
			assert.Equal(test.expectedErr, err)
		})
	}
}
