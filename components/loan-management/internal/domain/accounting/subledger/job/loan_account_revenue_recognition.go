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

var _ job.JobArgsWithHeader = (*SlRevenueRecognition)(nil)

type SlRevenueRecognition struct {
	Header                   job.MessageHeader `json:"header"`
	EventId                  string            `json:"event_id"`
	LoanId                   string            `json:"loan_id"`
	LenderSource             string            `json:"lender_source"`
	BookedAt                 time.Time         `json:"booked_at"`
	InstalmentScheduleNumber uint32            `json:"instalment_schedule_number"`
	RevenueUnits             uint64            `json:"revenue_units"`
	AppliedCurrency          string            `json:"applied_currency"`
}

func (a SlRevenueRecognition) MessageHeader() job.MessageHeader {
	return a.Header
}

func (SlRevenueRecognition) Kind() string {
	return types.JobTypeSLRevenueRecognition.String()
}

func (sl *SubledgerJobHandler) PostRevenueRecognition(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(SlRevenueRecognition)

	tx, err := sl.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	journalExists, err := storage.JournalEntriesExists(ctx, tx, request.LoanId, request.EventId)
	if err != nil {
		return err
	}
	if journalExists {
		log.Info(fmt.Sprintf("journal already exists by loanId: %s and eventId: %s, will skip", request.LoanId, request.EventId))
		return nil
	}

	postings := entriesRevenueRecognition(request)
	err = storage.SaveJournal(ctx, tx, *postings)
	if err != nil {
		return err
	}

	log.Info(fmt.Sprintf("journal saved successful for loanId: %s and eventId: %s", request.LoanId, request.EventId))

	return nil
}

func entriesRevenueRecognition(rr SlRevenueRecognition) *model.JournalPosting {
	posting := &model.JournalPosting{
		LinkedEntityId:   rr.LoanId,
		LinkedEntityType: types.AggregateTypeLoanAccount.String(),
		LenderSource:     rr.LenderSource,
		EventId:          rr.EventId,
		EventType:        pbcommon.EventType_LOAN_ACCOUNT_INTEREST_REVENUE_RECOGNIZED.String(),
		BookedAt:         rr.BookedAt,
		TransactionGroups: []model.JournalTransactionGroup{
			{
				TransactionGroup: 1,
				Transactions: []model.JournalTransaction{
					model.NewJournalTransaction(model.CostCenterMylo, model.AccountTreasury, common.MurabahaUnearnedRevenueAccount.SubLedgerAccount, common.Debit, rr.RevenueUnits),
					model.NewJournalTransaction(model.CostCenterLoan, rr.LoanId, common.InterestRevenueAccount.SubLedgerAccount, common.Credit, rr.RevenueUnits),
				},
			},
		},
	}
	return posting
}
