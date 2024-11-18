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

type GlLoanActivation struct {
	Header                           job.MessageHeader `json:"header"`
	EventId                          string            `json:"event_id"`
	LoanId                           string            `json:"loan_id"`
	LenderSource                     string            `json:"lender_source"`
	MerchantCode                     string            `json:"merchant_code"`
	BookedAt                         time.Time         `json:"booking_at"`
	AppliedCurrency                  string            `json:"applied_currency"`
	PrincipalUnits                   uint64            `json:"principal_units"`
	TotalInterestReceivableUnits     uint64            `json:"total_interest_receivable_units"`
	AdminFeeCollectedByMerchantUnits uint64            `json:"admin_fee_collected_by_merchant_units"`
	VATCollectedByMerchantUnits      uint64            `json:"vat_collected_by_merchant_units"`
	DoubtfulAllowanceUnits           uint64            `json:"doubtful_allowance_units"`
	BadDebtAllowanceUnits            uint64            `json:"bad_debt_allowance_units"`
}

func (a GlLoanActivation) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a GlLoanActivation) Kind() string {
	return types.JobTypeGLPostLoanActivation.String()
}

func (gl *GeneralLedgerERPJobHandler) PostLoanActivation(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	if gl.integrationDisabled {
		log.Info("integration is disabled, will skip")
		return nil
	}

	request := args.(GlLoanActivation)
	log.Info(fmt.Sprintf("reconciliation start for loanId: %s and eventId: %s", request.LoanId, request.EventId))

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

	postings, err := entriesLoanActivation(request)
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
		LinkedEventType:  pbcommon.EventType_LOAN_ACCOUNT_ACTIVATED.String(),
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

func entriesLoanActivation(la GlLoanActivation) (*dynamicsgen.PostJournalEntries, error) {
	ledgerName, err := ledgerNameFromLenderSource(la.LenderSource)
	if err != nil {
		return nil, err
	}

	commonComment := fmt.Sprintf("loan_id: %s", la.LoanId)

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
					JournalName:               fmt.Sprintf("%s%s", JournalPrefixLoanActivation, extractLast2DigitsFromYear(la.BookedAt)),
					MyloJournalReference:      EmptyString,
					MyloTransType:             "Loan activation",
					TransDate:                 transformToDynamicsDateFmt(la.BookedAt),
					JournalLines: []dynamicsgen.JournalLine{
						newJournalLine(dynamicsgen.Debit, la.PrincipalUnits, common.MurabahaPurchaseAccount.GeneralLedgerAccount, "Murabaha Purchase to Merchant"),
						newJournalLine(dynamicsgen.Credit, la.PrincipalUnits, common.MurabahaPrincipalReceivableAccount.GeneralLedgerAccount, "Murabaha Purchase from mylo Treasury"),
						newJournalLine(dynamicsgen.Debit, la.TotalInterestReceivableUnits, common.MurabahaInterestReceivableAccount.GeneralLedgerAccount, "Total interest receivable from mylo Treasury"),
						newJournalLine(dynamicsgen.Credit, la.TotalInterestReceivableUnits, common.MurabahaUnearnedRevenueAccount.GeneralLedgerAccount, "Total interest unearned revenue to mylo Treasury"),
						newJournalLine(dynamicsgen.Debit, la.DoubtfulAllowanceUnits, common.DoubtfulReceivableAccount.GeneralLedgerAccount, "Doubtful allowance (bad debt) receivable to mylo Treasury"),
						newJournalLine(dynamicsgen.Credit, la.DoubtfulAllowanceUnits, common.DoubtfulAccount.GeneralLedgerAccount, "Doubtful allowance (bad debt) from mylo Treasury"),
					},
				},
				{
					EnteredBy:                 commonComment,
					HeaderResponseStatus:      EmptyString,
					HeaderResponseDescription: EmptyString,
					JournalName:               fmt.Sprintf("%s%s", JournalPrefixFees, extractLast2DigitsFromYear(la.BookedAt)),
					MyloJournalReference:      EmptyString,
					MyloTransType:             "Admin Fees",
					TransDate:                 transformToDynamicsDateFmt(time.Now()),
					JournalLines: []dynamicsgen.JournalLine{
						newJournalLine(dynamicsgen.Debit, la.AdminFeeCollectedByMerchantUnits, common.AdminFeeReceivableAccount.GeneralLedgerAccount, "Admin fee collected by merchant to mylo Treasury"),
						newJournalLine(dynamicsgen.Debit, la.VATCollectedByMerchantUnits, common.VatFeeReceivableAccount.GeneralLedgerAccount, "VAT collected by merchant to mylo Treasury"),
						newJournalLine(dynamicsgen.Credit, la.AdminFeeCollectedByMerchantUnits+la.VATCollectedByMerchantUnits, fmt.Sprintf("%s|%s|MISC", common.MerchantDueAccount.GeneralLedgerAccount, la.MerchantCode), "Admin fee and VAT collected by merchant from mylo Treasury"),
					},
				},
				{
					EnteredBy:                 commonComment,
					HeaderResponseStatus:      EmptyString,
					HeaderResponseDescription: EmptyString,
					JournalName:               fmt.Sprintf("%s%s", JournalPrefixPurchase, extractLast2DigitsFromYear(la.BookedAt)),
					MyloJournalReference:      EmptyString,
					MyloTransType:             "Purchase",
					TransDate:                 transformToDynamicsDateFmt(time.Now()),
					JournalLines: []dynamicsgen.JournalLine{
						newJournalLine(dynamicsgen.Debit, la.PrincipalUnits, fmt.Sprintf("%s|%s|MISC", common.MerchantDueAccount.GeneralLedgerAccount, la.MerchantCode), "Pay to Merchant"),
						newJournalLine(dynamicsgen.Credit, la.PrincipalUnits, common.MurabahaPurchaseAccount.GeneralLedgerAccount, "Purchase from Merchant"),
					},
				},
			},
		},
	}
	filterJournalLinesWithNoAmount(postingRequest)
	return postingRequest, nil
}
