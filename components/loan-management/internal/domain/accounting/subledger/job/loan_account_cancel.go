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

var _ job.JobArgsWithHeader = (*SlLoanCancellation)(nil)

type SlLoanCancellation struct {
	Header                           job.MessageHeader `json:"header"`
	EventId                          string            `json:"event_id"`
	LoanId                           string            `json:"loan_id"`
	LenderSource                     string            `json:"loan_book"`
	MerchantId                       string            `json:"merchant_id"`
	ConsumerId                       string            `json:"consumer_id"`
	BookedAt                         time.Time         `json:"booked_at"`
	AppliedCurrency                  string            `json:"applied_currency"`
	PrincipalUnits                   uint64            `json:"principal_units"`
	TotalInterestReceivableUnits     uint64            `json:"total_interest_receivable_units"`
	AdminFeeCollectedByMerchantUnits uint64            `json:"admin_fee_collected_by_merchant_units"`
	VATCollectedByMerchantUnits      uint64            `json:"vat_collected_by_merchant_units"`
	BadDebtAllowanceUnits            uint64            `json:"bad_debt_allowance_units"`
}

func (a SlLoanCancellation) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a SlLoanCancellation) Kind() string {
	return types.JobTypeSLPostLoanCancellation.String()
}

func (sl *SubledgerJobHandler) PostLoanCancellation(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(SlLoanCancellation)
	log.Info(fmt.Sprintf("cancellation start for loanId: %s and eventId: %s", request.LoanId, request.EventId))

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

	postings := entriesLoanCancellation(request)
	err = storage.SaveJournal(ctx, tx, *postings)
	if err != nil {
		return err
	}

	log.Info(fmt.Sprintf("journal saved successful for loanId: %s and eventId: %s", request.LoanId, request.EventId))

	return nil
}

func entriesLoanCancellation(la SlLoanCancellation) *model.JournalPosting {
	posting := &model.JournalPosting{
		LinkedEntityId:   la.LoanId,
		LinkedEntityType: types.AggregateTypeLoanAccount.String(),
		LenderSource:     la.LenderSource,
		EventId:          la.EventId,
		EventType:        pbcommon.EventType_LOAN_ACCOUNT_CANCELED.String(),
		BookedAt:         la.BookedAt,
		TransactionGroups: []model.JournalTransactionGroup{
			{
				TransactionGroup: 1,
				Transactions: []model.JournalTransaction{
					model.NewJournalTransaction(model.CostCenterMylo, model.AccountTreasury, common.DoubtfulAccount.SubLedgerAccount, common.Credit, la.BadDebtAllowanceUnits),
					model.NewJournalTransaction(model.CostCenterMylo, model.AccountTreasury, common.DoubtfulReceivableAccount.SubLedgerAccount, common.Debit, la.BadDebtAllowanceUnits),
				},
			},
			{
				TransactionGroup: 2,
				Transactions: []model.JournalTransaction{
					model.NewJournalTransaction(model.CostCenterLoan, la.LoanId, common.MurabahaPrincipalReceivableAccount.SubLedgerAccount, common.Credit, la.PrincipalUnits),
					model.NewJournalTransaction(model.CostCenterMylo, model.AccountTreasury, common.MurabahaPurchaseAccount.SubLedgerAccount, common.Debit, la.PrincipalUnits),

					model.NewJournalTransaction(model.CostCenterLoan, la.LoanId, common.MurabahaInterestReceivableAccount.SubLedgerAccount, common.Credit, la.TotalInterestReceivableUnits),
					model.NewJournalTransaction(model.CostCenterMylo, model.AccountTreasury, common.MurabahaUnearnedRevenueAccount.SubLedgerAccount, common.Debit, la.TotalInterestReceivableUnits),

					model.NewJournalTransaction(model.CostCenterMerchant, la.MerchantId, common.MerchantDueAccount.SubLedgerAccount, common.Credit, la.VATCollectedByMerchantUnits+la.AdminFeeCollectedByMerchantUnits),
					model.NewJournalTransaction(model.CostCenterMylo, model.AccountTreasury, common.AdminFeeReceivableAccount.SubLedgerAccount, common.Debit, la.AdminFeeCollectedByMerchantUnits),
					model.NewJournalTransaction(model.CostCenterMylo, model.AccountTreasury, common.VatFeeReceivableAccount.SubLedgerAccount, common.Debit, la.VATCollectedByMerchantUnits),
				},
			},
			{
				TransactionGroup: 3,
				Transactions: []model.JournalTransaction{
					model.NewJournalTransaction(model.CostCenterMylo, model.AccountTreasury, common.MurabahaPurchaseAccount.SubLedgerAccount, common.Credit, la.PrincipalUnits),
					model.NewJournalTransaction(model.CostCenterMerchant, la.MerchantId, common.MerchantDueAccount.SubLedgerAccount, common.Debit, la.PrincipalUnits),
				},
			},
		},
	}
	return posting
}
