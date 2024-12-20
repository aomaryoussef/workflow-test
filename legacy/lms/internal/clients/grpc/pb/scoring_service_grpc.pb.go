// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             v4.25.0
// source: scoring_service.proto

package minicash_scoring

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

const (
	ScoringService_GetCreditLimit_FullMethodName = "/scoring.ScoringService/GetCreditLimit"
)

// ScoringServiceClient is the client API for ScoringService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ScoringServiceClient interface {
	// Get existing user credit limit.
	GetCreditLimit(ctx context.Context, in *GetCreditLimitRequest, opts ...grpc.CallOption) (*GetCreditLimitResponse, error)
}

type scoringServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewScoringServiceClient(cc grpc.ClientConnInterface) ScoringServiceClient {
	return &scoringServiceClient{cc}
}

func (c *scoringServiceClient) GetCreditLimit(ctx context.Context, in *GetCreditLimitRequest, opts ...grpc.CallOption) (*GetCreditLimitResponse, error) {
	out := new(GetCreditLimitResponse)
	err := c.cc.Invoke(ctx, ScoringService_GetCreditLimit_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ScoringServiceServer is the server API for ScoringService service.
// All implementations must embed UnimplementedScoringServiceServer
// for forward compatibility
type ScoringServiceServer interface {
	// Get existing user credit limit.
	GetCreditLimit(context.Context, *GetCreditLimitRequest) (*GetCreditLimitResponse, error)
	mustEmbedUnimplementedScoringServiceServer()
}

// UnimplementedScoringServiceServer must be embedded to have forward compatible implementations.
type UnimplementedScoringServiceServer struct {
}

func (UnimplementedScoringServiceServer) GetCreditLimit(context.Context, *GetCreditLimitRequest) (*GetCreditLimitResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetCreditLimit not implemented")
}
func (UnimplementedScoringServiceServer) mustEmbedUnimplementedScoringServiceServer() {}

// UnsafeScoringServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ScoringServiceServer will
// result in compilation errors.
type UnsafeScoringServiceServer interface {
	mustEmbedUnimplementedScoringServiceServer()
}

func RegisterScoringServiceServer(s grpc.ServiceRegistrar, srv ScoringServiceServer) {
	s.RegisterService(&ScoringService_ServiceDesc, srv)
}

func _ScoringService_GetCreditLimit_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetCreditLimitRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ScoringServiceServer).GetCreditLimit(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: ScoringService_GetCreditLimit_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ScoringServiceServer).GetCreditLimit(ctx, req.(*GetCreditLimitRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// ScoringService_ServiceDesc is the grpc.ServiceDesc for ScoringService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var ScoringService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "scoring.ScoringService",
	HandlerType: (*ScoringServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetCreditLimit",
			Handler:    _ScoringService_GetCreditLimit_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "scoring_service.proto",
}
