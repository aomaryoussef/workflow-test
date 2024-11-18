package types

import (
	"context"
	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/timex"
)

var _ cqrs.Command = (*BookPaymentCmd)(nil)

type BookPaymentCmd struct {
	cqrs.BaseCommand
	api.PaymentProcessRequest
}

func NewPaymentProcessCmd(ctx context.Context, model api.PaymentProcessRequest) *BookPaymentCmd {
	return &BookPaymentCmd{
		BaseCommand:           cqrs.NewBaseCommand(ctx, cqrs.CmdTypePaymentProcess, timex.NewUtcTime(model.BookingTimeUtc)),
		PaymentProcessRequest: model,
	}
}

func (c *BookPaymentCmd) Validate() error {
	return nil
}
