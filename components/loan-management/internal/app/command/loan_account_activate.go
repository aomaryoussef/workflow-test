package command

import (
	"context"
	"errors"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	gljob "github.com/btechlabs/lms/internal/domain/accounting/gl/job"
	sljob "github.com/btechlabs/lms/internal/domain/accounting/subledger/job"
	loanaccount "github.com/btechlabs/lms/internal/domain/loan_account/aggregate"
	loanaccountjob "github.com/btechlabs/lms/internal/domain/loan_account/job"
	"github.com/btechlabs/lms/internal/fincalc"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
)

func (c *Commands) ActivateLoanAccount(ctx context.Context, cmd *types.ActivateLoanAccountCmd) (*types.CmdProcessorResult, error) {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, "commands#ActivateLoanAccount")
	defer span.End()

	// validate the commands for bad requests
	if err := cmd.Validate(); err != nil {
		return nil, errors.Join(cqrs.ErrCommandValidationFailed, err)
	}

	tx, err := c.driver.CreateTransaction(ctx)
	if err != nil {
		return nil, err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	events, err := c.loadEvents(ctx, cmd.LoanId, types.AggregateTypeLoanAccount, tx)
	if err != nil {
		return nil, err
	}
	if len(events) == 0 {
		return nil, errors.New("loan account does not exist")
	}

	aggregate := newLoanAccountAggregate()
	aggregate.AppendEvents(events...)
	err = aggregate.Reduce()
	if err != nil {
		return nil, err
	}

	err = c.validateVersion(ctx, aggregate, cmd.IfMatch)
	if err != nil {
		return nil, err
	}

	event, err := aggregate.ApplyCommand(cmd)
	if err != nil {
		return nil, err
	}

	err = c.saveEvent(ctx, *event, tx)
	if err != nil {
		return nil, err
	}

	// apply the latest event to the aggregate
	aggregate.AppendEvents(*event)
	err = aggregate.Reduce()
	if err != nil {
		return nil, err
	}

	// this publishes the job to create a write model
	err = c.publishEvent(ctx, func() river.JobArgs {
		return loanaccountjob.ActivateLoanAccount{
			Header:   job.MessageHeaderFromContext(ctx),
			EventId:  event.Id,
			LoanId:   event.AggregateId,
			Version:  event.AggregateVersion,
			BookedAt: event.CreatedAt.ToStdLibTime(),
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}

	loanAccountAggregate := aggregate.(*loanaccount.LoanAccountAggregate)
	financedAmount := loanAccountAggregate.MonetaryLineItems.FinancedAmount()
	badDebtAllowance := fincalc.CalculateBadDebtAllowance(loanAccountAggregate.BadDebtFeeBasisPoints.Primitive(), financedAmount)

	// this publishes the job to create sub-ledger entries
	err = c.publishEvent(ctx, func() river.JobArgs {
		return sljob.SlLoanActivation{
			Header:                           job.MessageHeaderFromContext(ctx),
			EventId:                          event.Id,
			LoanId:                           event.AggregateId,
			LenderSource:                     loanAccountAggregate.LenderSource,
			MerchantId:                       loanAccountAggregate.MerchantId,
			ConsumerId:                       loanAccountAggregate.BorrowerId,
			BookedAt:                         event.CreatedAt.ToStdLibTime(),
			AppliedCurrency:                  financedAmount.Currency().Code,
			PrincipalUnits:                   financedAmount.Amount(),
			TotalInterestReceivableUnits:     money.AsPtr(loanAccountAggregate.AmmortisationLineItems.TotalInterestReceivable()).Amount(),
			AdminFeeCollectedByMerchantUnits: money.AsPtr(loanAccountAggregate.MonetaryLineItems.AdminFeeAmount()).Amount(),
			VATCollectedByMerchantUnits:      money.AsPtr(loanAccountAggregate.MonetaryLineItems.VatAmount()).Amount(),
			BadDebtAllowanceUnits:            badDebtAllowance.Amount(),
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}

	// this publishes the job to create general ledger entries
	err = c.publishEvent(ctx, func() river.JobArgs {
		return gljob.GlLoanActivation{
			Header:                           job.MessageHeaderFromContext(ctx),
			EventId:                          event.Id,
			LoanId:                           event.AggregateId,
			LenderSource:                     loanAccountAggregate.LenderSource,
			MerchantCode:                     loanAccountAggregate.MerchantCode,
			BookedAt:                         event.CreatedAt.ToStdLibTime(),
			AppliedCurrency:                  loanAccountAggregate.MonetaryLineItems.FinancedAmount().Currency().Code,
			PrincipalUnits:                   financedAmount.Amount(),
			TotalInterestReceivableUnits:     money.AsPtr(loanAccountAggregate.AmmortisationLineItems.TotalInterestReceivable()).Amount(),
			AdminFeeCollectedByMerchantUnits: money.AsPtr(loanAccountAggregate.MonetaryLineItems.AdminFeeAmount()).Amount(),
			VATCollectedByMerchantUnits:      money.AsPtr(loanAccountAggregate.MonetaryLineItems.VatAmount()).Amount(),
			BadDebtAllowanceUnits:            badDebtAllowance.Amount(),
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}

	return &types.CmdProcessorResult{
		AggregateId:      event.AggregateId,
		AggregateVersion: event.AggregateVersion,
		AggregateType:    event.AggregateType,
	}, nil
}
