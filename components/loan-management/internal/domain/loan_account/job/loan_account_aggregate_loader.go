package job

import (
	"context"
	"github.com/btechlabs/lms/internal/app/infra/event_store"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/loan_account/aggregate"
	"github.com/btechlabs/lms/internal/types"
)

func (h *LoanAccountJobHandler) loadLoanAccountAggregate(ctx context.Context, loanId string, untilEventId string, tx sql_driver.Tx) (*aggregate.LoanAccountAggregate, error) {
	events, err := h.es.LoadEvents(
		ctx,
		event_store.NewEventStoreQuery(
			event_store.WithAggregateId(loanId),
			event_store.WithAggregateType(types.AggregateTypeLoanAccount.String()),
			event_store.WithToEventIdInclusive(untilEventId),
		),
		func() sql_driver.Tx {
			return tx
		},
	)
	if err != nil {
		return nil, err
	}

	a := aggregate.NewInitLoanAccountAggregate()
	a.AppendEvents(events...)
	err = a.Reduce()
	if err != nil {
		return nil, err
	}

	return a, nil
}

func (h *LoanAccountJobHandler) loadLoanAccountAggregates(ctx context.Context, loanIds []string, untilEventId string, tx sql_driver.Tx) ([]*aggregate.LoanAccountAggregate, error) {
	aggregates := make([]*aggregate.LoanAccountAggregate, 0)
	for _, loanId := range loanIds {
		a, err := h.loadLoanAccountAggregate(ctx, loanId, untilEventId, tx)
		if err != nil {
			return nil, err
		}
		aggregates = append(aggregates, a)
	}

	return aggregates, nil
}
