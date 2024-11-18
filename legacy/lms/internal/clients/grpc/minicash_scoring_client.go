package grpc

import (
	"context"
	pb "github.com/btechlabs/lms-lite/internal/clients/grpc/pb"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// CreditService defines the credit check methods.
type CreditService interface {
	GetCreditLimit(context.Context, *pb.GetCreditLimitRequest) (*pb.GetCreditLimitResponse, error)
}

// Client represents the gRPC client.
type Client struct {
	conn          *grpc.ClientConn
	scoringClient pb.ScoringServiceClient
}

// NewClient creates a new gRPC client with connection pooling.
func NewClient(addr string) (*Client, error) {
	conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		logging.LogHandle.WithContext(context.Background()).Fatalf("Failed to connect to grpc server: %v", err)
		return nil, err
	}

	return &Client{
		conn:          conn,
		scoringClient: pb.NewScoringServiceClient(conn),
	}, nil
}

// Close closes the underlying gRPC connection.
func (c *Client) Close() error {
	if c.conn != nil {
		return c.conn.Close()
	}
	return nil
}

// CreditService returns a CreditService instance for credit check capabilities.
func (c *Client) CreditService() CreditService {
	return &creditService{client: c.scoringClient}
}

type creditService struct {
	client pb.ScoringServiceClient
}

func (s *creditService) GetCreditLimit(ctx context.Context, req *pb.GetCreditLimitRequest) (*pb.GetCreditLimitResponse, error) {
	resp, err := s.client.GetCreditLimit(ctx, req)
	if err != nil {
		return nil, err
	}
	return resp, nil
}
