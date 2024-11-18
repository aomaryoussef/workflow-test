package job

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/config"
	dynamicsgen "github.com/btechlabs/lms/gen/dynamics"
	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/accounting/common"
	"github.com/btechlabs/lms/internal/domain/accounting/gl/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"net/http"
	"time"
)

var _ job.JobArgsWithHeader = (*GlBookPayment)(nil)

type GlBookPayment struct {
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

func (a GlBookPayment) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a GlBookPayment) Kind() string {
	return types.JobTypeGLBookPayment.String()
}

func (gl *GeneralLedgerERPJobHandler) BookPayment(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	if gl.integrationDisabled {
		log.Info("integration is disabled, will skip")
		return nil
	}

	request := args.(GlBookPayment)
	log.Info(fmt.Sprintf("book payment / collection for payment reference: %s and eventId: %s", request.PaymentId, request.EventId))

	tx, err := gl.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	exitingRecord, err := storage.GetReconciliation(ctx, tx, request.PaymentId, request.EventId)
	if err != nil {
		return err
	}
	if exitingRecord != nil {
		log.Info(fmt.Sprintf("payment already exists by payment ID: %s and eventId: %s, will skip", request.PaymentId, request.EventId))
		return nil
	}

	postings, err := entriesBookPaymentsReceived(request)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to create postings data for new payment received: %s", err.Error()))
		return err
	}
	res, err := gl.client.PostJournalEntries(ctx, *postings)
	if err != nil {
		log.Warn(fmt.Sprintf("error in sending or receiving response from ms-dynamics: %s", err.Error()))
		return err
	}

	if res.StatusCode() != http.StatusOK {
		return errors.New(fmt.Sprintf("dynamics response code: %d", res.StatusCode()))
	}

	log.Info(fmt.Sprintf("reconciliation successful for paymentId: %s and eventId: %s with dynamics response code: %d", request.PaymentId, request.EventId, res.StatusCode()))

	postingResponse := res.JSON200
	if postingResponse == nil {
		return errors.New(fmt.Sprintf("dynamics response code: %d yet posting response is nil", res.StatusCode()))
	}

	glReconciliationWm := storage.GlReconciliation{
		LinkedEntityId:   request.PaymentId,
		LinkedEntityType: types.AggregateTypePayment.String(),
		LinkedEventId:    request.EventId,
		LinkedEventType:  pbcommon.EventType_PAYMENT_BOOKED.String(),
		TransactionDate:  request.BookedAt.UnixMilli(),
		ProcessedJobId:   1,
		RawRequest:       *postings,
		RawResponse:      *postingResponse,
	}

	err = storage.SaveReconciliation(ctx, tx, glReconciliationWm)
	if err != nil {
		return err
	}
	return nil
}

func entriesBookPaymentsReceived(bp GlBookPayment) (*dynamicsgen.PostJournalEntries, error) {
	ledgerName, err := ledgerNameFromLenderSource(config.LenderSourceMylo)
	if err != nil {
		return nil, err
	}

	commonComment := fmt.Sprintf("payment received: %d cents from channel: %s", bp.PaidUnits, bp.PaymentChannel)

	postingRequest := &dynamicsgen.PostingRequest{
		Request: dynamicsgen.DynamicsPostingModel{
			DataAreaId:        *ledgerName,
			IntegrationPoint:  EmptyString,
			MyloRequestNumber: fmt.Sprintf("event_id:%s", bp.EventId),
			GeneralJournalList: []dynamicsgen.GeneralJournal{
				{
					EnteredBy:                 commonComment,
					HeaderResponseStatus:      EmptyString,
					HeaderResponseDescription: EmptyString,
					JournalName:               fmt.Sprintf("%s%s", JournalPrefixPaymentsReceived, extractLast2DigitsFromYear(bp.BookedAt)),
					MyloJournalReference:      EmptyString,
					MyloTransType:             "Collection",
					TransDate:                 transformToDynamicsDateFmt(bp.BookedAt),
					JournalLines: []dynamicsgen.JournalLine{
						newJournalLine(dynamicsgen.Debit, bp.PaidUnits, common.BTTDPaymentPayableAccount.GeneralLedgerAccount, "Accounts Payable for Payments"),
						newJournalLine(dynamicsgen.Credit, bp.PaidUnits, common.ConsumerPaymentReceivableAccount.GeneralLedgerAccount, "Accounts Receivable after Payments"),
					},
				},
			},
		},
	}
	filterJournalLinesWithNoAmount(postingRequest)
	return postingRequest, nil
}
