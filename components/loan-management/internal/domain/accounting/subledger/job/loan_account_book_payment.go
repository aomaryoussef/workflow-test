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

var _ job.JobArgsWithHeader = (*SlLoanBookPayment)(nil)

type SlLoanBookPayment struct {
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

func (a SlLoanBookPayment) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a SlLoanBookPayment) Kind() string {
	return types.JobTypeSlLoanBookPayment.String()
}

func (sl *SubledgerJobHandler) BookLoanPayment(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(SlLoanBookPayment)

	tx, err := sl.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	journalExists, err := storage.JournalEntriesExists(ctx, tx, request.LoanAccountId, request.EventId)
	if err != nil {
		return err
	}
	if journalExists {
		log.Info(fmt.Sprintf("journal already exists by linkedEntityId: %s and eventId: %s, will skip", request.LoanAccountId, request.EventId))
		return nil
	}

	postings := &model.JournalPosting{
		LinkedEntityId:   request.LoanAccountId,
		LinkedEntityType: types.AggregateTypeLoanAccount.String(),
		LenderSource:     request.LenderSource,
		EventId:          request.EventId,
		EventType:        pbcommon.EventType_LOAN_ACCOUNT_PAYMENT_BOOKED.String(),
		BookedAt:         request.BookedAt,
		TransactionGroups: []model.JournalTransactionGroup{
			{
				TransactionGroup: 1,
				Transactions: []model.JournalTransaction{
					model.NewJournalTransaction(model.CostCenterConsumer, request.PayorId, model.AccountWallet, common.Debit, request.PaidUnits),
					model.NewJournalTransaction(model.CostCenterLoan, request.LoanAccountId, common.MurabahaPrincipalReceivableAccount.SubLedgerAccount, common.Credit, request.PaidToPrincipalUnits),
					model.NewJournalTransaction(model.CostCenterLoan, request.LoanAccountId, common.MurabahaInterestReceivableAccount.SubLedgerAccount, common.Credit, request.PaidToInterestUnits),
				},
			},
		},
	}
	err = storage.SaveJournal(ctx, tx, *postings)
	if err != nil {
		return err
	}

	log.Info(fmt.Sprintf("journal saved successful for book loan account payment loanId: %s and eventId: %s", request.LoanAccountId, request.EventId))

	return nil
}
