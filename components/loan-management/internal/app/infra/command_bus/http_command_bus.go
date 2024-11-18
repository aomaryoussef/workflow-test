package command_bus

import (
	"context"
	"errors"
	"github.com/btechlabs/lms/internal/app/command"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
)

var (
	ErrNoCommandHandlerRegistered = errors.New("no handler registered for command")
	ErrCommandValidationFailure   = errors.New("command validation failed")
)

type HttpCommandBus struct {
	commands *command.Commands
}

func NewHttpCommandBus(commands *command.Commands) *HttpCommandBus {
	return &HttpCommandBus{commands: commands}
}

func (b *HttpCommandBus) Dispatch(ctx context.Context, cmd cqrs.Command) (*types.CmdProcessorResult, error) {
	if err := cmd.Validate(); err != nil {
		return nil, errors.Join(ErrCommandValidationFailure, err)
	}

	switch cmd.Type() {
	// Financial Product Command Dispatchers
	case cqrs.CmdTypeFinancialProductCreate:
		return b.commands.CreateFinancialProduct(ctx, cmd.(*types.CreateFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductUpdate:
		return b.commands.UpdateFinancialProduct(ctx, cmd.(*types.UpdateFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductApprove:
		return b.commands.ApproveFinancialProduct(ctx, cmd.(*types.ApproveFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductPublish:
		return b.commands.PublishFinancialProduct(ctx, cmd.(*types.PublishFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductUnpublish:
		return b.commands.UnpublishFinancialProduct(ctx, cmd.(*types.UnpublishFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductDelete:
		return b.commands.DeleteFinancialProduct(ctx, cmd.(*types.DeleteFinancialProductCmd))

	// Loan Account Command Dispatchers
	case cqrs.CmdTypeLoanAccountCreate:
		return b.commands.CreateLoanAccount(ctx, cmd.(*types.CreateLoanAccountCmd))
	case cqrs.CmdTypeLoanAccountActivate:
		return b.commands.ActivateLoanAccount(ctx, cmd.(*types.ActivateLoanAccountCmd))
	case cqrs.CmdTypeLoanAccountCancel:
		return b.commands.CancelLoanAccount(ctx, cmd.(*types.CancelLoanAccountCmd))
	case cqrs.CmdTypeLoanAccountEarlySettle:
		return b.commands.EarlySettleLoanAccount(ctx, cmd.(*types.EarlySettleLoanAccountCmd))

		// Payment Command Dispatchers
	case cqrs.CmdTypePaymentProcess:
		return b.commands.BookPayment(ctx, cmd.(*types.BookPaymentCmd))
	default:
		return nil, ErrNoCommandHandlerRegistered
	}
}
