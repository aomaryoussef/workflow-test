package job

import (
	"context"
	"fmt"
	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/accounting/common"
	"github.com/btechlabs/lms/internal/domain/accounting/subledger/model"
	"github.com/btechlabs/lms/internal/domain/accounting/subledger/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"time"
)

var _ job.JobArgsWithHeader = (*SlBookPayment)(nil)

type SlBookPayment struct {
	Header                        job.MessageHeader `json:"header"`
	EventId                       string            `json:"event_id"`
	PaymentId                     string            `json:"payment_id"`
	BookedAt                      time.Time         `json:"booked_at"`
	AppliedCurrency               string            `json:"applied_currency"`
	PaidUnits                     uint64            `json:"paid_units"`
	PayorId                       string            `json:"payor_id"`
	PaymentChannel                string            `json:"payment_channel"`
	PaymentChannelCollectionPoint string            `json:"payment_channel_collection_point"`
}

func (a SlBookPayment) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a SlBookPayment) Kind() string {
	return types.JobTypeBookPayment.String()
}

func (sl *SubledgerJobHandler) BookPayment(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(SlBookPayment)

	tx, err := sl.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	journalExists, err := storage.JournalEntriesExists(ctx, tx, request.PaymentId, request.EventId)
	if err != nil {
		return err
	}
	if journalExists {
		log.Info(fmt.Sprintf("journal already exists by paymentId: %s and eventId: %s, will skip", request.PaymentId, request.EventId))
		return nil
	}

	postings := entriesBookPayment(request)
	err = storage.SaveJournal(ctx, tx, *postings)
	if err != nil {
		return err
	}

	log.Info(fmt.Sprintf("journal saved successful for paymentId: %s and eventId: %s", request.PaymentId, request.EventId))

	return nil
}

func entriesBookPayment(bk SlBookPayment) *model.JournalPosting {
	posting := &model.JournalPosting{
		LinkedEntityId:   bk.PaymentId,
		LinkedEntityType: types.AggregateTypePayment.String(),
		LenderSource:     model.LenderSourcePayments,
		EventId:          bk.EventId,
		EventType:        pbcommon.EventType_PAYMENT_BOOKED.String(),
		BookedAt:         bk.BookedAt,
		TransactionGroups: []model.JournalTransactionGroup{
			{
				TransactionGroup: 1,
				Transactions: []model.JournalTransaction{
					model.NewJournalTransaction(model.CostCenterWorld, bk.PaymentChannel, bk.PaymentChannelCollectionPoint, common.Debit, bk.PaidUnits),
					model.NewJournalTransaction(model.CostCenterConsumer, bk.PayorId, model.AccountWallet, common.Credit, bk.PaidUnits),
				},
			},
		},
	}
	return posting
}
