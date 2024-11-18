package job

import (
	"context"
	"errors"
	"fmt"
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

var _ job.JobArgsWithHeader = (*GlRevenueRecognition)(nil)

type GlRevenueRecognition struct {
	Header                   job.MessageHeader `json:"header"`
	EventId                  string            `json:"event_id"`
	LoanId                   string            `json:"loan_id"`
	LenderSource             string            `json:"lender_source"`
	BookedAt                 time.Time         `json:"booked_at"`
	InstalmentScheduleNumber uint32            `json:"instalment_schedule_number"`
	RevenueUnits             uint64            `json:"revenue_units"`
	AppliedCurrency          string            `json:"applied_currency"`
}

func (a GlRevenueRecognition) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a GlRevenueRecognition) Kind() string {
	return types.JobTypeGLRevenueRecognition.String()
}

func (gl *GeneralLedgerERPJobHandler) PostRevenueRecognition(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	if gl.integrationDisabled {
		log.Info("integration is disabled, will skip")
		return nil
	}

	request := args.(GlRevenueRecognition)
	log.Info(fmt.Sprintf("revenue recognition start for loanId: %s and eventId: %s", request.LoanId, request.EventId))

	tx, err := gl.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	exitingRecord, err := storage.GetReconciliation(ctx, tx, request.LoanId, request.EventId)
	if err != nil {
		return err
	}
	if exitingRecord != nil {
		log.Info(fmt.Sprintf("reconciliation already exists by loanId: %s and eventId: %s, will skip", request.LoanId, request.EventId))
		return nil
	}

	postings, err := entriesInterestRevenueRecognition(request)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to create postings data for new loan created: %s", err.Error()))
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

	log.Info(fmt.Sprintf("reconciliation successful for loanId: %s and eventId: %s with dynamics response code: %d", request.LoanId, request.EventId, res.StatusCode()))

	postingResponse := res.JSON200
	if postingResponse == nil {
		return errors.New(fmt.Sprintf("dynamics response code: %d yet posting response is nil", res.StatusCode()))
	}

	glReconciliationWm := storage.GlReconciliation{
		LinkedEntityId:   request.LoanId,
		LinkedEntityType: types.AggregateTypeLoanAccount.String(),
		LinkedEventId:    request.EventId,
		LinkedEventType:  pbcommon.EventType_LOAN_ACCOUNT_INTEREST_REVENUE_RECOGNIZED.String(),
		TransactionDate:  request.BookedAt.UnixMilli(),
		ProcessedJobId:   1,
		RawRequest:       *postings,
		RawResponse:      *postingResponse,
	}

	err = storage.SaveReconciliation(ctx, tx, glReconciliationWm)
	if err != nil {
		return err
	}

	log.Info(fmt.Sprintf("reconciliation record saved for loanId: %s and eventId: %s", request.LoanId, request.EventId))

	return nil
}

func entriesInterestRevenueRecognition(la GlRevenueRecognition) (*dynamicsgen.PostJournalEntries, error) {
	ledgerName, err := ledgerNameFromLenderSource(la.LenderSource)
	if err != nil {
		return nil, err
	}

	commonComment := fmt.Sprintf("revenue recognition loan_id: %s and instalment: %d", la.LoanId, la.InstalmentScheduleNumber)

	postingRequest := &dynamicsgen.PostingRequest{
		Request: dynamicsgen.DynamicsPostingModel{
			DataAreaId:        *ledgerName,
			IntegrationPoint:  EmptyString,
			MyloRequestNumber: fmt.Sprintf("event_id:%s", la.EventId),
			GeneralJournalList: []dynamicsgen.GeneralJournal{
				{
					EnteredBy:                 commonComment,
					HeaderResponseStatus:      EmptyString,
					HeaderResponseDescription: EmptyString,
					JournalName:               fmt.Sprintf("%s%s", JournalPrefixInterestRevenue, extractLast2DigitsFromYear(la.BookedAt)),
					MyloJournalReference:      EmptyString,
					MyloTransType:             "Due",
					TransDate:                 transformToDynamicsDateFmt(la.BookedAt),
					JournalLines: []dynamicsgen.JournalLine{
						newJournalLine(dynamicsgen.Debit, la.RevenueUnits, common.MurabahaUnearnedRevenueAccount.GeneralLedgerAccount, "Interest revenue recognition"),
						newJournalLine(dynamicsgen.Credit, la.RevenueUnits, common.InterestRevenueAccount.GeneralLedgerAccount, "Interest revenue recognition"),
					},
				},
			},
		},
	}
	filterJournalLinesWithNoAmount(postingRequest)
	return postingRequest, nil
}
