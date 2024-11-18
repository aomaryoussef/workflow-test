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

var _ job.JobArgsWithHeader = (*GlLoanBookPayment)(nil)

type GlLoanBookPayment struct {
	Header               job.MessageHeader `json:"header"`
	EventId              string            `json:"event_id"`
	LoanAccountId        string            `json:"loan_account_id"`
	LenderSource         string            `json:"lender_source"`
	PayorId              string            `json:"payor_id"`
	BookedAt             time.Time         `json:"booked_at"`
	AppliedCurrency      string            `json:"applied_currency"`
	PaidUnits            uint64            `json:"paid_units"`
	PaidToPrincipalUnits uint64            `json:"paid_to_principal_units"`
	PaidToInterestUnits  uint64            `json:"paid_to_interest_units"`
	PaidToPenaltyUnits   uint64            `json:"paid_to_penalty_units"`
}

func (a GlLoanBookPayment) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a GlLoanBookPayment) Kind() string {
	return types.JobTypeGlLoanBookPayment.String()
}

func (gl *GeneralLedgerERPJobHandler) BookLoanPayment(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	if gl.integrationDisabled {
		log.Info("integration is disabled, will skip")
		return nil
	}

	request := args.(GlLoanBookPayment)
	log.Info(fmt.Sprintf("book payment start for loanId: %s and eventId: %s", request.LoanAccountId, request.EventId))

	tx, err := gl.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	exitingRecord, err := storage.GetReconciliation(ctx, tx, request.LoanAccountId, request.EventId)
	if err != nil {
		return err
	}
	if exitingRecord != nil {
		log.Info(fmt.Sprintf("reconciliation already exists by loanId: %s and eventId: %s, will skip", request.LoanAccountId, request.EventId))
		return nil
	}

	postings, err := entriesLoanAccountPayment(request)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to create postings data for loan payment: %s", err.Error()))
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

	log.Info(fmt.Sprintf("reconciliation successful for loanId: %s and eventId: %s with dynamics response code: %d", request.LoanAccountId, request.EventId, res.StatusCode()))

	postingResponse := res.JSON200
	if postingResponse == nil {
		return errors.New(fmt.Sprintf("dynamics response code: %d yet posting response is nil", res.StatusCode()))
	}

	glReconciliationWm := storage.GlReconciliation{
		LinkedEntityId:   request.LoanAccountId,
		LinkedEntityType: types.AggregateTypeLoanAccount.String(),
		LinkedEventId:    request.EventId,
		LinkedEventType:  pbcommon.EventType_LOAN_ACCOUNT_PAYMENT_BOOKED.String(),
		TransactionDate:  request.BookedAt.UnixMilli(),
		ProcessedJobId:   1,
		RawRequest:       *postings,
		RawResponse:      *postingResponse,
	}

	err = storage.SaveReconciliation(ctx, tx, glReconciliationWm)
	if err != nil {
		return err
	}

	log.Info(fmt.Sprintf("reconciliation record saved for loanId: %s and eventId: %s", request.LoanAccountId, request.EventId))

	return nil
}

func entriesLoanAccountPayment(bk GlLoanBookPayment) (*dynamicsgen.PostJournalEntries, error) {
	ledgerName, err := ledgerNameFromLenderSource(bk.LenderSource)
	if err != nil {
		return nil, err
	}

	commonComment := fmt.Sprintf("loan_id: %s", bk.LoanAccountId)

	postingRequest := &dynamicsgen.PostingRequest{
		Request: dynamicsgen.DynamicsPostingModel{
			DataAreaId:        *ledgerName,
			IntegrationPoint:  EmptyString,
			MyloRequestNumber: fmt.Sprintf("event_id:%s", bk.EventId),
			GeneralJournalList: []dynamicsgen.GeneralJournal{
				{
					EnteredBy:                 commonComment,
					HeaderResponseStatus:      EmptyString,
					HeaderResponseDescription: EmptyString,
					JournalName:               fmt.Sprintf("%s%s", JournalPrefixPaymentsReceived, extractLast2DigitsFromYear(bk.BookedAt)),
					MyloJournalReference:      EmptyString,
					MyloTransType:             "Collection",
					TransDate:                 transformToDynamicsDateFmt(bk.BookedAt),
					JournalLines: []dynamicsgen.JournalLine{
						newJournalLine(dynamicsgen.Debit, bk.PaidUnits, common.ConsumerPaymentReceivableAccount.GeneralLedgerAccount, "Received from Consumer"),
						newJournalLine(dynamicsgen.Credit, bk.PaidToPrincipalUnits, common.MurabahaPrincipalReceivableAccount.GeneralLedgerAccount, "Paid towards Principal"),
						newJournalLine(dynamicsgen.Credit, bk.PaidToInterestUnits, common.MurabahaInterestReceivableAccount.GeneralLedgerAccount, "Paid towards Interest"),
					},
				},
			},
		},
	}
	filterJournalLinesWithNoAmount(postingRequest)
	return postingRequest, nil
}
