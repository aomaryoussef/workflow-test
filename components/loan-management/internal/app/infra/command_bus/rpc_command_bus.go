package command_bus

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/internal/app/command"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/contextx"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/logging"
	"go.opentelemetry.io/otel/propagation"
)

func contextFromRpcCmd(cmd cqrs.BaseCommand, mapCarrier propagation.MapCarrier) context.Context {
	ctx := context.Background()

	cmdMetadata := cmd.CommandMetadata()
	ctx = context.WithValue(ctx, contextx.ContextKeyUserId, cmdMetadata.CreatedBy)
	ctx = context.WithValue(ctx, contextx.ContextKeyTraceId, cmdMetadata.TraceId)
	ctx = context.WithValue(ctx, contextx.ContextKeyCallingSystemId, cmdMetadata.CallingSystemId)

	propagator := propagation.TraceContext{}
	ctx = propagator.Extract(ctx, mapCarrier)

	return ctx
}

type RpcCommandBus struct {
	commands *command.Commands
}

func NewRpcCommandBus(commands *command.Commands) *RpcCommandBus {
	return &RpcCommandBus{commands: commands}
}

func (b *RpcCommandBus) RecogniseInterestRevenue(cmd types.RecogniseRevenueCmd, result *types.CmdProcessorResult) error {
	ctx := contextFromRpcCmd(cmd.BaseCommand, cmd.TracingCarrier)
	log := logging.WithContext(ctx)

	result, err := b.commands.RecogniseInterestRevenue(ctx, cmd)
	if err != nil {
		log.Warn(fmt.Sprintf("could not recognise interest revenue for loan Id: %s and schedule number: %d, error: %s", cmd.LoanId, cmd.InstalmentScheduleNumber, err.Error()))
		return err
	}

	return nil
}

func (b *RpcCommandBus) ProcessLoanPayment(cmd types.ApplyLoanPaymentCmd, result *types.CmdProcessorResult) error {
	ctx := contextFromRpcCmd(cmd.BaseCommand, cmd.TracingCarrier)
	log := logging.WithContext(ctx)

	result, err := b.commands.ProcessLoanPayment(ctx, &cmd)
	if err != nil {
		log.Warn(fmt.Sprintf("could not apply payment for loan Id: %s and schedule number: %d, error: %s", cmd.LoanId, cmd.InstalmentScheduleNumber, err.Error()))
		return err
	}

	return nil
}
