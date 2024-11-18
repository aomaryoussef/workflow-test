package job

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/event_store"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	loanaccount "github.com/btechlabs/lms/internal/domain/loan_account/aggregate"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/logging"
)

type LoanAccountJobHandler struct {
	db            *sql_driver.SqlDriver
	es            event_store.EventStore[sql_driver.Tx]
	rpcServerAddr string
}

func NewLoanAccountJobHandler(
	db *sql_driver.SqlDriver,
	es event_store.EventStore[sql_driver.Tx],
	rpcServerAddr string,
) *LoanAccountJobHandler {
	return &LoanAccountJobHandler{db: db, es: es, rpcServerAddr: rpcServerAddr}
}

func loadLoanAccount(ctx context.Context, es event_store.EventStore[sql_driver.Tx], tx sql_driver.Tx, loanId string, eventId string) (*loanaccount.LoanAccountAggregate, error) {
	log := logging.WithContext(ctx)

	log.Debug(fmt.Sprintf("loading events for loan account aggregate with id: %s linked to event: %s", loanId, eventId))

	events, err := es.LoadEvents(
		ctx,
		event_store.NewEventStoreQuery(
			event_store.WithAggregateType(types.AggregateTypeLoanAccount.String()),
			event_store.WithAggregateId(loanId),
			event_store.WithToEventIdInclusive(eventId),
		),
		func() sql_driver.Tx { return tx },
	)
	if err != nil {
		return nil, err
	}
	la := loanaccount.NewInitLoanAccountAggregate()
	la.AppendEvents(events...)
	err = la.Reduce()
	if err != nil {
		return nil, err
	}
	log.Debug(fmt.Sprintf("reduced loan account aggregate with id: %s and version: %d", loanId, la.AggregateVersion.Primitive()))

	return la, nil
}
