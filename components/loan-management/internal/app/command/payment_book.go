package command

import (
	"context"
	"errors"
	"fmt"
	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	gljob "github.com/btechlabs/lms/internal/domain/accounting/gl/job"
	sljob "github.com/btechlabs/lms/internal/domain/accounting/subledger/job"
	loanaccountjob "github.com/btechlabs/lms/internal/domain/loan_account/job"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
	"strings"
)

var (
	errPaymentAlreadyProcessed = errors.New("payment already processed")
)

func (c *Commands) BookPayment(ctx context.Context, cmd *types.BookPaymentCmd) (*types.CmdProcessorResult, error) {
	log := logging.WithContext(ctx)
	ctx, span := otelx.NewSpanFromContext(ctx, "commands#BookPayment")
	defer span.End()

	// validate the commands for bad requests
	if err := cmd.Validate(); err != nil {
		return nil, errors.Join(cqrs.ErrCommandValidationFailed, err)
	}

	tx, err := c.driver.CreateLockedTransaction(ctx, cmd.PayorId, "BookPayment")
	if err != nil {
		return nil, err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	events, err := c.loadEvents(ctx, cmd.TransactionId, types.AggregateTypePayment, tx)
	if err != nil {
		return nil, err
	}
	if len(events) != 0 {
		return nil, errPaymentAlreadyProcessed
	}

	event := generatePaymentBookedEvent(ctx, cmd)
	err = c.saveEvent(ctx, *event, tx)
	if err != nil {
		return nil, err
	}

	// start the trigger for processing the payments
	paymentBookedEventPayload := event.Payload.(*pbevent.PaymentBookedEventPayload)
	err = c.publishEvent(ctx, func() river.JobArgs {
		return loanaccountjob.TriggerBookLoanDuesFromPayment{
			Header:            job.MessageHeaderFromContext(ctx),
			EventId:           event.Id,
			PaymentRegistryId: paymentBookedEventPayload.PaymentRegistryId,
			BookedAt:          event.CreatedAt.ToStdLibTime(),
			AppliedCurrency:   paymentBookedEventPayload.Amount.Currency,
			PaidUnits:         paymentBookedEventPayload.Amount.Units,
			PayorId:           paymentBookedEventPayload.PayorId,
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}
	log.Debug(fmt.Sprintf("payment booked trigger event published for payment registry id: %s", paymentBookedEventPayload.PaymentRegistryId))

	// publish the job to create sub-ledger entries
	err = c.publishEvent(ctx, func() river.JobArgs {
		return sljob.SlBookPayment{
			Header:                        job.MessageHeaderFromContext(ctx),
			EventId:                       event.Id,
			PaymentId:                     cmd.TransactionId,
			BookedAt:                      event.CreatedAt.ToStdLibTime(),
			AppliedCurrency:               string(cmd.Amount.Currency),
			PaidUnits:                     uint64(cmd.Amount.Amount),
			PayorId:                       cmd.PayorId,
			PaymentChannel:                strings.ToUpper(string(cmd.PaymentChannel)),
			PaymentChannelCollectionPoint: cmd.PaymentChannelCollectionPoint,
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}
	log.Debug(fmt.Sprintf("payment booked sub-ledger event published for payment registry id: %s", paymentBookedEventPayload.PaymentRegistryId))

	// this publishes the job to create general ledger entries
	err = c.publishEvent(ctx, func() river.JobArgs {
		return gljob.GlBookPayment{
			Header:                        job.MessageHeaderFromContext(ctx),
			EventId:                       event.Id,
			PaymentId:                     cmd.TransactionId,
			BookedAt:                      event.CreatedAt.ToStdLibTime(),
			AppliedCurrency:               string(cmd.Amount.Currency),
			PaidUnits:                     uint64(cmd.Amount.Amount),
			PayorId:                       cmd.PayorId,
			PaymentChannel:                strings.ToUpper(string(cmd.PaymentChannel)),
			PaymentChannelCollectionPoint: cmd.PaymentChannelCollectionPoint,
		}
	}, riverx.UniqueOptsByArgs(), tx)
	if err != nil {
		return nil, err
	}
	log.Debug(fmt.Sprintf("payment booked general ledger event published for payment registry id: %s", paymentBookedEventPayload.PaymentRegistryId))

	return &types.CmdProcessorResult{
		AggregateId:      event.AggregateId,
		AggregateVersion: event.AggregateVersion,
		AggregateType:    event.AggregateType,
	}, nil
}

func generatePaymentBookedEvent(_ context.Context, cmd *types.BookPaymentCmd) *cqrs.Event {
	event := cqrs.NewEvent(
		pbcommon.EventType_PAYMENT_BOOKED,
		cmd.CommandMetadata().GetCommandBookedAt(),
		cmd.CommandMetadata().GetCommandBookedBy(),
		cmd.TransactionId, // ensure the transactionID is used as aggregateID, do not change this
		types.AggregateTypePayment,
		cqrs.Version(1),
		cmd.CommandMetadata().GetCallingSystemId(),
		cmd.CommandMetadata().GetTraceId(),
		&pbevent.PaymentBookedEventPayload{
			PaymentRegistryId:             cmd.TransactionId,
			PaymentChannel:                pbevent.PaymentChannel(pbevent.PaymentChannel_value[strings.ToUpper(string(cmd.PaymentChannel))]),
			TransactionType:               pbevent.PaymentTransactionType_PAYMENT,
			PaymentChannelCollectionPoint: cmd.PaymentChannelCollectionPoint,
			ReversingTransactionId:        nil,
			PayorId:                       cmd.PayorId,
			Amount: &pbcommon.Money{
				Units:    uint64(cmd.Amount.Amount),
				Currency: string(cmd.Amount.Currency),
			},
		},
	)
	return event
}
