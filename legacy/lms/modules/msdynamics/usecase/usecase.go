package usecase

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	gaDto "github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/pkg/utils"

	"github.com/btechlabs/lms-lite/modules/msdynamics/domain"
	"github.com/btechlabs/lms-lite/modules/msdynamics/dto"
	"github.com/btechlabs/lms-lite/modules/msdynamics/repository"
	"github.com/btechlabs/lms-lite/pkg/logging"
)

type MSDynamicsUseCase interface {
	OpenMerchantAccount(ctx context.Context, input *dto.OpenMerchantAccountRequest) (response *dto.OpenMerchantAccountResponse, err error)
	NewMerchantInvoices(ctx context.Context, input *dto.NewMerchantInvoicesRequest) (dynamics *dto.DynamicsRequestResponse, err error)
	EndOfDayAggregates(ctx context.Context, input *dto.GeneralJournalEndOfDayAggregatesRequest) (dynamics *dto.DynamicsRequestResponse, err error)
	BookConsumerCollectionMyloTreasuryBTechStoreChannel(ctx context.Context, input domain.ConsumerCollectionBTechStoreChannel) (dynamics *dto.DynamicsRequestResponse, err error)
	BookConsumerCollectionMyloTreasuryFawryChannel(ctx context.Context, input domain.ConsumerCollectionFawryChannel) (dynamics *dto.DynamicsRequestResponse, err error)
	BookConsumerCollectionBtechTreasury(ctx context.Context, input domain.ConsumerCollectionBTechStoreChannel) (dynamics *dto.DynamicsRequestResponse, err error)
	BookCollectionBtechTreasury(ctx context.Context, input domain.ConsumerCollectionToTreasury) (dynamics *dto.DynamicsRequestResponse, err error)
	BookCollectionMyloTreasury(ctx context.Context, input domain.ConsumerCollectionToTreasury) (dynamics *dto.DynamicsRequestResponse, err error)
	PostAggregatedCollectionsAtEndOfDay(ctx context.Context, input dto.PostAggregatedCollectionRequest) (dynamics *dto.DynamicsRequestResponse, err error)
	PostAggregatedLoanCancellationsAtEndOfDay(ctx context.Context, input gaDto.EndOfDayLoanCancellationsAggregate) (dynamics *dto.DynamicsRequestResponse, err error)
	PostCancelledInvoicesAccount(ctx context.Context, input gaDto.CancelledMerchantDisbursements) (dynamics *dto.DynamicsRequestResponse, err error)
}

type msDynamicsUseCase struct {
	repo repository.MSDynamicsRepository
}

func NewMSDynamicsUseCase(repo repository.MSDynamicsRepository) MSDynamicsUseCase {
	return &msDynamicsUseCase{repo: repo}
}

func (m *msDynamicsUseCase) OpenMerchantAccount(ctx context.Context, input *dto.OpenMerchantAccountRequest) (response *dto.OpenMerchantAccountResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	correlationId := logging.ExtractCorrelationId(ctx)
	if correlationId == "" {
		return nil, errors.New("msdynamics_usecase#OpenMerchantAccount - correlation id is required")
	}
	logger.Infof("Start open merchant account in GA")

	if input.LMSId == 0 {
		err = fmt.Errorf("There is no merchant account number input for global id %s, can't open account, check if LMS merchant account creation was successful and returned the id!", input.GlobalId)
		logger.Errorf("Error with input for open merchant account in GA", err)
		return nil, err
	}

	builder := &domain.MerchantAccountBuilder{}
	builder.Id = utils.GenerateDynamicsMerchantID(input.LMSId) // padded using the auto-increment field of party_account table
	builder.GlobalId = input.GlobalId
	builder.City = input.City
	builder.CurrencyCode = input.CurrencyCode
	builder.Group = input.Group
	builder.Location = input.Location
	builder.Name = input.Name
	builder.SalesTaxGroup = input.SalesTaxGroup
	builder.SearchName = input.SearchName
	builder.State = input.State
	builder.Street = input.Street
	builder.StreetNumber = input.StreetNumber
	builder.WithholdingTaxGroupCode = input.WithholdingTaxGroupCode
	builder.ZipCode = input.ZipCode
	builder.MerchantBankAccountNumber = input.MerchantBankAccountNumber
	builder.MerchantBankAddress = input.MerchantBankAddress
	builder.MerchantBankBranchName = input.MerchantBankBranchName
	builder.MerchantBankIBAN = input.MerchantBankIBAN
	builder.MerchantBankName = input.MerchantBankName
	builder.MerchantBankSwiftCode = input.MerchantBankSwiftCode
	builder.TaxRegistrationNumber = input.TaxRegistrationNumber
	builder.BeneficiaryBankAddress = input.BeneficiaryBankAddress
	builder.BeneficiaryBankName = input.BeneficiaryBankName

	account := builder.Build()
	savedAccount, err := m.repo.OpenMerchantAccount(ctx, correlationId, &account)
	if err != nil {
		logger.Errorf("Error during call to GA service: %s", err)
		return nil, err
	}

	response = &dto.OpenMerchantAccountResponse{
		RequestNumber:    correlationId,
		GeneralAccountId: account.Id(),
		GlobalId:         savedAccount.GlobalId(),
	}
	logger.Infof("Finished open merchant account in GA")
	return response, nil
}

func (m *msDynamicsUseCase) NewMerchantInvoices(ctx context.Context, input *dto.NewMerchantInvoicesRequest) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	correlationId := logging.ExtractCorrelationId(ctx)
	logger.Infof("Start new merchant invoices in GA")
	invoices := []*domain.MerchantInvoice{}
	// convert input to domain model
	for _, i := range input.MerchantDisbursements {
		builder := domain.NewMerchantInvoiceBuilder()
		builder.AccountId = utils.GenerateDynamicsMerchantID(i.MerchantAccountId)
		builder.OffsetAccount = fmt.Sprintf("230202012|%s|MISC", builder.AccountId) //TODO get from config
		builder.Amount = i.Amount
		builder.CurrencyCode = i.CurrencyCode
		builder.InvoiceId = fmt.Sprintf("INV-%010d", i.InvoiceId)
		builder.InvoiceDate = input.InvoiceDate
		builder.Description = fmt.Sprintf("Invoice of merchant %s for date range %s to %s", i.MerchantGlobalId, input.DisbursementStartTime, input.DisbursementEndTime)

		invoice := builder.Build()
		invoices = append(invoices, &invoice)
	}

	if len(invoices) == 0 {
		logger.Info("msdynamics_usecase#NewMerchantInvoices - no merchant invoices to post at end of day")
		return
	}

	// call repo
	dynamics, err = m.repo.NewMerchantInvoices(ctx, correlationId, invoices)
	if err != nil {
		logger.Errorf("Error during call to GA service: %s", err)
		return
	}

	return
}

func (m *msDynamicsUseCase) EndOfDayAggregates(ctx context.Context, input *dto.GeneralJournalEndOfDayAggregatesRequest) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	correlationId := logging.ExtractCorrelationId(ctx)
	logger.Infof("Start end of day journal entries in GA")
	logger.Infof("Using map: %s", m.repo.GetChartofAccountsMap())

	journals := []*domain.GeneralJournal{}
	for _, j := range m.repo.GetChartofAccountsMap().Journals {
		for _, tr := range input.TransactionTypes {
			if j.LMSTransactionType == tr.Type {
				logger.Infof("Mapping %s journal", j.Name)
				builder := domain.NewGeneralJournalBuilder()
				builder.JournalName = j.Name
				builder.TransactionType = j.GeneralLedgerTransactionType
				builder.TransactionDate = input.DayEnd
				builder.JournalReference = correlationId

				for _, jl := range j.JournalLines {
					for _, trl := range tr.Changes {
						if jl.LMSAccountName == trl.AccountName {
							if jl.SubAccountFormat != "" {
								if strings.Contains(jl.SubAccountFormat, "{MERCHANT_ID}") &&
									jl.LMSAccountName == "MerchantDue" &&
									j.LMSTransactionType == "PURCHASING_FROM_MERCHANT" {
									logger.Infof("Mapping %s account with %d sub-accounts", jl.GeneralLedgerAccountId, len(input.MerchantTransactions))
									// iterate on merchants too and add as sub-account
									for _, m := range input.MerchantTransactions {
										mlBuilder := getJournalEntryLine(jl, m)
										builder.Entries = append(builder.Entries, *mlBuilder)
									}
									break
								} else if strings.Contains(jl.SubAccountFormat, "{MERCHANT_ID}") &&
									jl.LMSAccountName == "MerchantDue" &&
									j.LMSTransactionType == "ADMIN_FEE" {
									// calculate admin fee deductibles per merchant sub-accounts and map from input
									for _, m := range input.MerchantAdminFees {
										mafBuilder := getJournalEntryLineNegated(jl, m)
										builder.Entries = append(builder.Entries, *mafBuilder)
									}
									break
								}
								// TODO: else if, when different breakdowns needed to sub-account, add here the mapping
							}
							logger.Infof("Mapping %s account from %s", jl.GeneralLedgerAccountId, trl.AccountName)
							lineBuilder := domain.NewGeneralJournalEntryBuilder()
							lineBuilder.Account = jl.GeneralLedgerAccountId
							if jl.GeneralLedgerAccountDescription != "" {
								lineBuilder.Description = jl.GeneralLedgerAccountDescription
							}

							if trl.BalanceChange > 0 {
								lineBuilder.Amount = trl.BalanceChange
								lineBuilder.Direction = "Debit"
							} else {
								lineBuilder.Amount = trl.BalanceChange * -1
								lineBuilder.Direction = "Credit"
							}

							builder.Entries = append(builder.Entries, *lineBuilder)
							break
						}
					}
				}

				journalLine := builder.Build()
				journals = append(journals, &journalLine)
				logger.Infof("Appended journal with %s", j.Name)
				break
			}
		}
	}

	if len(journals) == 0 {
		logger.Info("msdynamics_usecase#EndOfDayAggregates - no journal entries to post at end of day")
		return
	}

	// send to repo as input
	dynamics, err = m.repo.SaveGeneralJournalEntries(ctx, correlationId, journals)
	if err != nil {
		logger.Errorf("Error during call to GA service: %s", err)
		return
	}
	return
}

func (m *msDynamicsUseCase) BookConsumerCollectionMyloTreasuryBTechStoreChannel(ctx context.Context, input domain.ConsumerCollectionBTechStoreChannel) (dynamics *dto.DynamicsRequestResponse, err error) {
	err = input.Validate()
	if err != nil {
		return
	}
	dynamics, err = m.repo.BookConsumerCollectionMyloTreasuryBTechStoreChannel(ctx, input)
	if err != nil {
		return
	}

	return
}

func (m *msDynamicsUseCase) BookConsumerCollectionMyloTreasuryFawryChannel(ctx context.Context, input domain.ConsumerCollectionFawryChannel) (dynamics *dto.DynamicsRequestResponse, err error) {
	err = input.Validate()
	if err != nil {
		return
	}
	dynamics, err = m.repo.BookConsumerCollectionMyloTreasuryFawryChannel(ctx, input)
	if err != nil {
		return
	}

	return
}

func (m *msDynamicsUseCase) BookConsumerCollectionBtechTreasury(ctx context.Context, input domain.ConsumerCollectionBTechStoreChannel) (dynamics *dto.DynamicsRequestResponse, err error) {
	err = input.Validate()
	if err != nil {
		return
	}
	dynamics, err = m.repo.BookConsumerCollectionBTechTreasury(ctx, input)
	if err != nil {
		return
	}

	return
}

func (m *msDynamicsUseCase) BookCollectionBtechTreasury(ctx context.Context, input domain.ConsumerCollectionToTreasury) (dynamics *dto.DynamicsRequestResponse, err error) {
	err = input.Validate()
	if err != nil {
		return
	}
	dynamics, err = m.repo.BookCollectionBTechTreasury(ctx, input)
	if err != nil {
		return
	}

	return
}

func (m *msDynamicsUseCase) BookCollectionMyloTreasury(ctx context.Context, input domain.ConsumerCollectionToTreasury) (dynamics *dto.DynamicsRequestResponse, err error) {
	err = input.Validate()
	if err != nil {
		return
	}
	dynamics, err = m.repo.BookCollectionMyloTreasury(ctx, input)
	if err != nil {
		return
	}

	return
}

func (m *msDynamicsUseCase) PostAggregatedCollectionsAtEndOfDay(ctx context.Context, input dto.PostAggregatedCollectionRequest) (dynamics *dto.DynamicsRequestResponse, err error) {
	dynamics, err = m.repo.PostAggregatedCollectionsAtEndOfDay(ctx, input)
	if err != nil {
		return
	}

	return
}

func (m *msDynamicsUseCase) PostAggregatedLoanCancellationsAtEndOfDay(ctx context.Context, input gaDto.EndOfDayLoanCancellationsAggregate) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)

	startTime, err := time.Parse(time.RFC3339, input.StartTime)
	if err != nil {
		return nil, fmt.Errorf("msdynamics_usecase#PostAggregatedLoanCancellationsAtEndOfDay - parsing start time %s failed with error: %v", input.StartTime, err)
	}
	endTime, err := time.Parse(time.RFC3339, input.EndTime)
	if err != nil {
		return nil, fmt.Errorf("msdynamics_usecase#PostAggregatedLoanCancellationsAtEndOfDay - parsing end time %s failed with error: %v", input.EndTime, err)
	}
	startTimeUTC, err := time.Parse(time.RFC3339, input.StartTimeUTC)
	if err != nil {
		return nil, fmt.Errorf("msdynamics_usecase#PostAggregatedLoanCancellationsAtEndOfDay - parsing start time UTC %s failed with error: %v", input.StartTimeUTC, err)
	}
	endTimeUTC, err := time.Parse(time.RFC3339, input.EndTimeUTC)
	if err != nil {
		return nil, fmt.Errorf("msdynamics_usecase#PostAggregatedLoanCancellationsAtEndOfDay - parsing end time %s failed with error: %v", input.EndTimeUTC, err)
	}

	palcr := repository.PostAggregatedLoanCancellationRequest{
		ReferenceId:  input.ReferenceId,
		StartTime:    startTime,
		EndTime:      endTime,
		StartTimeUTC: startTimeUTC,
		EndTimeUTC:   endTimeUTC,
		AggregatedMerchantLoanCancellationRecords: make([]repository.AggregatedMerchantLoanCancellationRecord, 0),
	}

	for _, cancelledLoan := range input.LoanCancellationRecords {
		// Remove the IF condition and send all loan cancellation aggregations
		// and not just unpaid merchant disbursements
		// See: https://btechlabs.slack.com/archives/C06AWL83K17/p1715695953468829
		merchantLevelAggregate := repository.AggregatedMerchantLoanCancellationRecord{
			MerchantGlobalId: cancelledLoan.MerchantGlobalAccountId,
			MerchantId:       cancelledLoan.MerchantAccountId,
			// 1. Loan activation reversed
			MerchantDueDebit:      cancelledLoan.MerchantDueDebit,
			MurabhaPurchaseCredit: cancelledLoan.MurabhaPurchaseCredit,
			// 2. Loan & interest reversed
			MurabhaPurchaseDebit:             cancelledLoan.MurabhaPurchaseDebit,
			MurabhaPrincipalReceivableCredit: cancelledLoan.MurabhaPrincipalReceivableCredit,
			MurabhaUnearnedRevenueDebit:      cancelledLoan.MurabhaUnearnedRevenueDebit,
			MurabhaInterestReceivableCredit:  cancelledLoan.MurabhaInterestReceivableCredit,
			DoubtfulAllowanceDebit:           cancelledLoan.DoubtfulAllowanceDebit,
			DoubtfulAllowanceCredit:          cancelledLoan.DoubtfulAllowanceCredit,
			// 3. Admin fee reversed
			AdminFeeDebit:     cancelledLoan.AdminFeeDebit,
			TaxDueDebit:       cancelledLoan.TaxDueDebit,
			MerchantDueCredit: cancelledLoan.MerchantDueCredit,
			// Out of scope: Interest due (in case first installment due sent to dynamics )
		}
		palcr.AggregatedMerchantLoanCancellationRecords = append(
			palcr.AggregatedMerchantLoanCancellationRecords,
			merchantLevelAggregate,
		)
	}

	if len(palcr.AggregatedMerchantLoanCancellationRecords) == 0 {
		logger.Infof("msdynamics_usecase#PostAggregatedLoanCancellationsAtEndOfDay - no aggregated unpaid loan cancellations to post at end of day for: %s", endTime.Format(time.RFC3339))
		return
	}

	dynamics, err = m.repo.PostAggregatedLoanCancellationsAtEndOfDay(ctx, palcr)
	if err != nil {
		return
	}

	return
}

func (m *msDynamicsUseCase) PostCancelledInvoicesAccount(ctx context.Context, input gaDto.CancelledMerchantDisbursements) (dynamics *dto.DynamicsRequestResponse, err error) {
	dynamics, err = m.repo.PostCancelledInvoicesAccount(ctx, input)
	if err != nil {
		return
	}
	return
}

func formatSubAccountName(formatString string, glAccountId string, merchantAccountId string) string {
	return strings.ReplaceAll(
		strings.ReplaceAll(formatString,
			"{GL_ACCOUNT_ID}", glAccountId),
		"{MERCHANT_ID}", merchantAccountId)
}

func getJournalEntryLine(jl repository.ChartOfAccountsJournalLine, m dto.MerchantTransactionLine) *domain.GeneralJournalEntryBuilder {
	builder := domain.NewGeneralJournalEntryBuilder()

	builder.Account = formatSubAccountName(jl.SubAccountFormat,
		jl.GeneralLedgerAccountId,
		utils.GenerateDynamicsMerchantID(m.MerchantId),
	)

	if m.Amount > 0 {
		builder.Amount = m.Amount
		builder.Direction = "Credit"
	} else {
		builder.Amount = m.Amount * -1
		builder.Direction = "Debit"
	}

	return builder
}

func getJournalEntryLineNegated(jl repository.ChartOfAccountsJournalLine, m dto.MerchantTransactionLine) *domain.GeneralJournalEntryBuilder {
	builder := domain.NewGeneralJournalEntryBuilder()

	builder.Account = formatSubAccountName(jl.SubAccountFormat,
		jl.GeneralLedgerAccountId,
		utils.GenerateDynamicsMerchantID(m.MerchantId),
	)

	if m.Amount < 0 {
		builder.Amount = m.Amount * -1
		builder.Direction = "Credit"
	} else {
		builder.Amount = m.Amount
		builder.Direction = "Debit"
	}

	return builder
}
