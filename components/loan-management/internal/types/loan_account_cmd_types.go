package types

import (
	"context"
	"log/slog"
	"time"

	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/timex"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
)

var _ cqrs.Command = (*CreateLoanAccountCmd)(nil)

type CreateLoanAccountCmd struct {
	cqrs.BaseCommand
	api.CreateLoanAccount
	FinancialProduct      *FinancialProductData
	FinancialProductTenor *FinancialProductTenorData
	Logger                *slog.Logger
}

type FinancialProductData struct {
	FinancialProductId            string
	FinancialProductTenorKey      string
	AppliedCurrency               string
	DurationInDays                uint32
	FlatRateBasisPoints           uint32
	AdminFeeRateBasisPoints       uint32
	EarlySettlementFeeBasisPoints uint32
	BadDebtFeeBasisPoints         uint32
	VatRateBasisPoints            uint32
	InterestRoundingUp            bool
	GracePeriodInDays             uint32
}

type FinancialProductTenorData struct {
	Key                     string
	DurationInDays          uint32
	InterestRateBasisPoints uint32
	AdminFeeBasisPoints     uint32
}

func NewCreateLoanAccountCmd(ctx context.Context, model api.CreateLoanAccount) *CreateLoanAccountCmd {
	return &CreateLoanAccountCmd{
		BaseCommand:       cqrs.NewBaseCommand(ctx, cqrs.CmdTypeLoanAccountCreate, timex.NewUtcTime(model.BookingTimeUtc)),
		CreateLoanAccount: model,
		Logger:            logging.WithContext(ctx),
	}
}

func (c *CreateLoanAccountCmd) Validate() error {
	return nil
}

var _ cqrs.Command = (*ActivateLoanAccountCmd)(nil)

type ActivateLoanAccountCmd struct {
	cqrs.BaseCommand
	api.ActivateLoanAccountParams
	LoanId string
}

func NewActivateLoanAccountCmd(ctx context.Context, loanId string, params api.ActivateLoanAccountParams, model api.ActivateLoanAccountRequest) *ActivateLoanAccountCmd {
	return &ActivateLoanAccountCmd{
		BaseCommand:               cqrs.NewBaseCommand(ctx, cqrs.CmdTypeLoanAccountActivate, timex.NewUtcTime(model.ActivatedAtUtc)),
		ActivateLoanAccountParams: params,
		LoanId:                    loanId,
	}
}

func (a *ActivateLoanAccountCmd) Validate() error {
	return nil
}

var _ cqrs.Command = (*CancelLoanAccountCmd)(nil)

type CancelLoanAccountCmd struct {
	cqrs.BaseCommand
	api.CancelLoanAccount
	api.CancelLoanAccountParams
	LoanId string
}

func NewCancelLoanAccountCmd(ctx context.Context, loanId string, params api.CancelLoanAccountParams, model api.CancelLoanAccount) *CancelLoanAccountCmd {
	return &CancelLoanAccountCmd{
		BaseCommand:             cqrs.NewBaseCommand(ctx, cqrs.CmdTypeLoanAccountCancel, timex.NewUtcTime(model.CancelledAtUtc)),
		CancelLoanAccountParams: params,
		CancelLoanAccount:       model,
		LoanId:                  loanId,
	}
}

func (c *CancelLoanAccountCmd) Validate() error {
	return nil
}

var _ cqrs.Command = (*EarlySettleLoanAccountCmd)(nil)

type EarlySettleLoanAccountCmd struct {
	cqrs.BaseCommand
	api.EarlySettleLoanAccountRequest
	api.EarlySettleLoanAccountParams
	LoanId string
}

func NewEarlySettleLoanAccountCmd(ctx context.Context, loanId string, params api.EarlySettleLoanAccountParams, model api.EarlySettleLoanAccountRequest) *EarlySettleLoanAccountCmd {
	return &EarlySettleLoanAccountCmd{
		BaseCommand:                   cqrs.NewBaseCommand(ctx, cqrs.CmdTypeLoanAccountEarlySettle, timex.NewUtcTime(model.BookedAtUtc)),
		EarlySettleLoanAccountRequest: model,
		EarlySettleLoanAccountParams:  params,
		LoanId:                        loanId,
	}
}

func (c *EarlySettleLoanAccountCmd) Validate() error {
	return nil
}

var _ cqrs.Command = (*RecogniseRevenueCmd)(nil)

type RecogniseRevenueCmd struct {
	cqrs.BaseCommand
	TracingCarrier           propagation.MapCarrier
	LoanId                   string
	LenderSource             string
	DueDate                  time.Time
	InstalmentScheduleNumber uint32
	RevenueUnits             uint64
	AppliedCurrency          string
}

func NewRecogniseRevenueCmd(ctx context.Context) *RecogniseRevenueCmd {
	mapCarrier := propagation.MapCarrier{}
	propagator := otel.GetTextMapPropagator()
	propagator.Inject(ctx, mapCarrier)

	return &RecogniseRevenueCmd{
		BaseCommand:    cqrs.NewBaseCommand(ctx, cqrs.CmdTypeLoanAccountRevenueRecognition, timex.NewUtcTimeNow()),
		TracingCarrier: mapCarrier,
	}
}

func (r *RecogniseRevenueCmd) Validate() error {
	return nil
}

var _ cqrs.Command = (*ApplyLoanPaymentCmd)(nil)

type ApplyLoanPaymentCmd struct {
	cqrs.BaseCommand
	TracingCarrier           propagation.MapCarrier
	LoanId                   string
	BorrowerId               string
	InstalmentScheduleNumber uint32
	AppliedCurrency          string
	PaidUnits                uint64
	PaymentReferenceId       string
	PaymentDate              time.Time
}

func NewApplyLoanPaymentCmd(ctx context.Context) *ApplyLoanPaymentCmd {
	mapCarrier := propagation.MapCarrier{}
	propagator := otel.GetTextMapPropagator()
	propagator.Inject(ctx, mapCarrier)

	return &ApplyLoanPaymentCmd{
		BaseCommand:    cqrs.NewBaseCommand(ctx, cqrs.CmdTypeLoanAccountPaymentProcess, timex.NewUtcTimeNow()),
		TracingCarrier: mapCarrier,
	}
}

func (r *ApplyLoanPaymentCmd) Validate() error {
	return nil
}
