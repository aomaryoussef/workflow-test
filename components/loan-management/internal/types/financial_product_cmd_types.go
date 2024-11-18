package types

import (
	"context"
	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/timex"
)

var _ cqrs.Command = (*ApproveFinancialProductCmd)(nil)

type ApproveFinancialProductCmd struct {
	cqrs.BaseCommand
	api.ApproveFinancialProductParams
	Key string
}

func NewApproveFinancialProductCmd(ctx context.Context, key string, params api.ApproveFinancialProductParams) *ApproveFinancialProductCmd {
	return &ApproveFinancialProductCmd{
		BaseCommand:                   cqrs.NewBaseCommand(ctx, cqrs.CmdTypeFinancialProductApprove, timex.NewUtcTimeNow()),
		ApproveFinancialProductParams: params,
		Key:                           key,
	}
}

func (c *ApproveFinancialProductCmd) Validate() error {
	return nil
}

var _ cqrs.Command = (*CreateFinancialProductCmd)(nil)

type CreateFinancialProductCmd struct {
	cqrs.BaseCommand
	api.CreateFinancialProduct
}

func NewCreateFinancialProductCmd(ctx context.Context, model api.CreateFinancialProduct) *CreateFinancialProductCmd {
	c := &CreateFinancialProductCmd{
		BaseCommand:            cqrs.NewBaseCommand(ctx, cqrs.CmdTypeFinancialProductCreate, timex.NewUtcTimeNow()),
		CreateFinancialProduct: model,
	}
	return c
}

func (c *CreateFinancialProductCmd) Validate() error {
	// TODO Sid: Add
	return nil
}

var _ cqrs.Command = (*DeleteFinancialProductCmd)(nil)

type DeleteFinancialProductCmd struct {
	cqrs.BaseCommand
	api.DeleteFinancialProductParams
	Key string
}

func NewDeleteFinancialProductCmd(ctx context.Context, key string, params api.DeleteFinancialProductParams) *DeleteFinancialProductCmd {
	c := &DeleteFinancialProductCmd{
		BaseCommand:                  cqrs.NewBaseCommand(ctx, cqrs.CmdTypeFinancialProductDelete, timex.NewUtcTimeNow()),
		DeleteFinancialProductParams: params,
		Key:                          key,
	}
	return c
}

func (c *DeleteFinancialProductCmd) Validate() error {
	return nil
}

var _ cqrs.Command = (*PublishFinancialProductCmd)(nil)

type PublishFinancialProductCmd struct {
	cqrs.BaseCommand
	api.PublishFinancialProductParams
	Key string
}

func NewPublishFinancialProductCmd(ctx context.Context, key string, params api.PublishFinancialProductParams) *PublishFinancialProductCmd {
	c := &PublishFinancialProductCmd{
		BaseCommand:                   cqrs.NewBaseCommand(ctx, cqrs.CmdTypeFinancialProductPublish, timex.NewUtcTimeNow()),
		PublishFinancialProductParams: params,
		Key:                           key,
	}
	return c
}

func (c *PublishFinancialProductCmd) Validate() error {
	// TODO Sid: Add
	return nil
}

var _ cqrs.Command = (*UnpublishFinancialProductCmd)(nil)

type UnpublishFinancialProductCmd struct {
	cqrs.BaseCommand
	api.UnpublishFinancialProductParams
	Key string
}

func NewUnpublishFinancialProductCmd(ctx context.Context, key string, params api.UnpublishFinancialProductParams) *UnpublishFinancialProductCmd {
	c := &UnpublishFinancialProductCmd{
		BaseCommand:                     cqrs.NewBaseCommand(ctx, cqrs.CmdTypeFinancialProductUnpublish, timex.NewUtcTimeNow()),
		UnpublishFinancialProductParams: params,
		Key:                             key,
	}
	return c
}

func (c *UnpublishFinancialProductCmd) Validate() error {
	return nil
}

var _ cqrs.Command = (*UpdateFinancialProductCmd)(nil)

type UpdateFinancialProductCmd struct {
	cqrs.BaseCommand
	api.UpdateFinancialProduct
	api.UpdateFinancialProductParams
	Key string
}

func NewUpdateFinancialProductCmd(ctx context.Context, key string, params api.UpdateFinancialProductParams, model api.UpdateFinancialProduct) *UpdateFinancialProductCmd {
	c := &UpdateFinancialProductCmd{
		BaseCommand:                  cqrs.NewBaseCommand(ctx, cqrs.CmdTypeFinancialProductUpdate, timex.NewUtcTimeNow()),
		UpdateFinancialProduct:       model,
		UpdateFinancialProductParams: params,
		Key:                          key,
	}
	return c
}

func (c *UpdateFinancialProductCmd) Validate() error {
	// TODO Sid: Add
	return nil
}
