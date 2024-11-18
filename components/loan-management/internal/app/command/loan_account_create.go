package command

import (
	"context"
	"errors"
	"fmt"

	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	fpa "github.com/btechlabs/lms/internal/domain/financial_product/aggregate"
	loanaccount "github.com/btechlabs/lms/internal/domain/loan_account/aggregate"
	loanaccountjob "github.com/btechlabs/lms/internal/domain/loan_account/job"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/cqrs"
	appError "github.com/btechlabs/lms/pkg/errors"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
)

func (c *Commands) CreateLoanAccount(ctx context.Context, cmd *types.CreateLoanAccountCmd) (*types.CmdProcessorResult, error) {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, "commands#CreateLoanAccount")
	defer span.End()

	// validate the commands for bad requests
	if err := cmd.Validate(); err != nil {
		return nil, errors.Join(cqrs.ErrCommandValidationFailed, err)
	}

	tx, err := c.driver.CreateLockedTransaction(ctx, cmd.Borrower.BorrowerId, "CreateLoanAccount")
	if err != nil {
		return nil, err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	financialProduct, err := c.loadFinancialProduct(ctx, cmd.FinancialProductKey, tx)
	if err != nil {
		return nil, err
	}
	if financialProduct.State() != pbevent.FinancialProductState_PUBLISHED {
		return nil, fmt.Errorf("%w: financial product is not published, cannot create loan account", appError.ErrPreConditionsError)
	}
	financialProductTenor, err := financialProduct.GetTenorByKey(cmd.FinancialProductTenorKey)
	if err != nil {
		return nil, fmt.Errorf("loan with id: %s cannot be created with reason: %s", *cmd.LoanId, err.Error())
	}

	cmd.FinancialProduct = &types.FinancialProductData{
		FinancialProductId:            financialProduct.Id,
		FinancialProductTenorKey:      financialProductTenor.Key,
		DurationInDays:                financialProductTenor.DurationInDays,
		AppliedCurrency:               money.DefaultSystemCurrency,
		FlatRateBasisPoints:           financialProductTenor.Interest.Primitive(),
		InterestRoundingUp:            financialProduct.InstallmentRoundingType == fpa.RoundingTypeUp,
		AdminFeeRateBasisPoints:       financialProduct.AdminFeeBasisPoints.Primitive(),
		EarlySettlementFeeBasisPoints: financialProduct.EarlySettlementFeeBasisPoints.Primitive(),
		BadDebtFeeBasisPoints:         financialProduct.BadDebtProvisionBasisPoints.Primitive(),
		VatRateBasisPoints:            financialProduct.VatPercentBasisPoints().Primitive(),
		GracePeriodInDays:             financialProduct.GracePeriodInDays,
	}

	cmd.FinancialProductTenor = &types.FinancialProductTenorData{
		Key:                     financialProductTenor.Key,
		DurationInDays:          financialProductTenor.DurationInDays,
		InterestRateBasisPoints: financialProductTenor.Interest.Primitive(),
		AdminFeeBasisPoints:     financialProductTenor.AdminFeeBasisPoints.Primitive(),
	}

	aggregate := newLoanAccountAggregate()
	event, err := aggregate.ApplyCommand(cmd)
	if err != nil {
		return nil, err
	}

	// load any loan account that may exist with the same id
	existingLoanAccount, err := c.loadLoanAccount(ctx, event.AggregateId, tx)
	if !errors.Is(err, appError.ErrNotFound) {
		if err != nil {
			return nil, err
		}
	}
	// if loanAccount exists raise a conflict error
	if existingLoanAccount != nil {
		return nil, fmt.Errorf("%w: loan account already exists with the same ID", appError.ErrConflictError)
	}

	err = c.saveEvent(ctx, *event, tx)
	if err != nil {
		return nil, err
	}

	err = c.publishEvent(ctx, func() river.JobArgs {
		return loanaccountjob.CreateLoanAccount{
			Header:   job.MessageHeaderFromContext(ctx),
			EventId:  event.Id,
			BookedAt: event.CreatedAt.ToStdLibTime(),
			LoanId:   event.AggregateId,
			Version:  event.AggregateVersion,
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}

	return &types.CmdProcessorResult{
		AggregateType:    event.AggregateType,
		AggregateId:      event.AggregateId,
		AggregateVersion: event.AggregateVersion,
	}, nil
}

func (c *Commands) loadLoanAccount(ctx context.Context, key string, tx sql_driver.Tx) (*loanaccount.LoanAccountAggregate, error) {
	events, err := c.loadEvents(ctx, key, types.AggregateTypeLoanAccount, tx)
	if err != nil {
		return nil, err
	}
	if len(events) == 0 {
		return nil, fmt.Errorf("%w: loan account does not exist", appError.ErrNotFound)
	}

	aggregate := newLoanAccountAggregate()
	aggregate.AppendEvents(events...)
	err = aggregate.Reduce()
	if err != nil {
		return nil, err
	}

	return aggregate.(*loanaccount.LoanAccountAggregate), nil
}
