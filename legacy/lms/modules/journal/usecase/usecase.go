package usecase

import (
	"context"
	"math"
	"time"

	"github.com/btechlabs/lms-lite/modules/journal/dto"

	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/modules/journal/domain"
	"github.com/btechlabs/lms-lite/modules/journal/repository"
	"github.com/btechlabs/lms-lite/pkg/money"
)

type JournalUseCase interface {
	GetAllJournalTransactionsForLoan(ctx context.Context, loanId string) (transactions []domain.JournalTransaction, err error)
	BookActivateLoan(ctx context.Context, loanId string, correlationId string, principalAmount uint64, interestAmount uint64, bookingDate time.Time, adminFee uint64) (err error)
	BookCancelLoan(ctx context.Context, loanId string, correlationId string, principalAmount uint64, interestAmount uint64, bookingDate time.Time, adminFee uint64) (err error)
	BookInterestEarned(ctx context.Context, loanId string, correlationId string, amount uint64, bookingDate time.Time) (err error)
	BookPaymentReceived(ctx context.Context, inputModel dto.BookPaymentReceivedRequest) (err error)
	BookEarlySettlementReceived(ctx context.Context, inputModel dto.BookEarlySettlementReceivedRequest) (err error)
}

type journalUseCase struct {
	repo               repository.JournalRepository
	vatPercentage      uint
	doubtfulPercentage uint
}

func NewJournalUseCase(repo repository.JournalRepository, conf config.EnvConfig) JournalUseCase {
	return &journalUseCase{
		repo:               repo,
		vatPercentage:      conf.VatPercentage,
		doubtfulPercentage: conf.DoubtfulPercentage,
	}
}

func (u *journalUseCase) GetAllJournalTransactionsForLoan(ctx context.Context, loanId string) (transactions []domain.JournalTransaction, err error) {
	transactions, err = u.repo.GetAllForLoan(ctx, loanId)
	if err != nil {
		return nil, err
	}

	return transactions, nil
}

func (u *journalUseCase) BookActivateLoan(ctx context.Context, loanId string, correlationId string, principalAmount uint64, interestAmount uint64, bookingDate time.Time, adminFee uint64) (err error) {
	transactionId, err := u.repo.GetLatestTransactionIdForLoan(ctx, loanId)
	if err != nil {
		return err
	}

	// TODO: rewrite all calcs using decimal package or math/big
	adminFeeBeforeVAT := uint64(math.Round(float64(adminFee) / (float64(100+u.vatPercentage) / 100)))
	doubtfulAllowance := uint64(math.Round(float64(principalAmount) * (float64(u.doubtfulPercentage) / 100)))

	transaction1 := domain.NewJournalTransaction(transactionId+1, []domain.JournalEntry{
		*domain.NewJournalEntry(domain.JournalAccountMurabhaPurchase, domain.JournalEntryTypePurchasingFromMerchant, domain.JournalEntryDirectionDebit, money.NewMoney(principalAmount)),
		*domain.NewJournalEntry(domain.JournalMerchantDue, domain.JournalEntryTypePurchasingFromMerchant, domain.JournalEntryDirectionCredit, money.NewMoney(principalAmount)),
	}, bookingDate, loanId, correlationId)

	transaction2 := domain.NewJournalTransaction(transactionId+2, []domain.JournalEntry{
		*domain.NewJournalEntry(domain.JournalAccountMurabhaLoanReceivable, domain.JournalEntryTypeLoanActivation, domain.JournalEntryDirectionDebit, money.NewMoney(principalAmount)),
		*domain.NewJournalEntry(domain.JournalAccountMurabhaPurchase, domain.JournalEntryTypeLoanActivation, domain.JournalEntryDirectionCredit, money.NewMoney(principalAmount)),
		*domain.NewJournalEntry(domain.JournalAccountMurabhaInterestReceivable, domain.JournalEntryTypeLoanActivation, domain.JournalEntryDirectionDebit, money.NewMoney(interestAmount)),
		*domain.NewJournalEntry(domain.JournalAccountMurabhaUnearnedRevenue, domain.JournalEntryTypeLoanActivation, domain.JournalEntryDirectionCredit, money.NewMoney(interestAmount)),
		*domain.NewJournalEntry(domain.JournalMerchantDue, domain.JournalEntryTypeAdminFee, domain.JournalEntryDirectionDebit, money.NewMoney(adminFee)),
		*domain.NewJournalEntry(domain.JournalAccountAdminFeeReceivable, domain.JournalEntryTypeAdminFee, domain.JournalEntryDirectionCredit, money.NewMoney(adminFeeBeforeVAT)),
		*domain.NewJournalEntry(domain.JournalAccountTaxDue, domain.JournalEntryTypeAdminFee, domain.JournalEntryDirectionCredit, money.NewMoney(adminFee-adminFeeBeforeVAT)),
	}, bookingDate, loanId, correlationId)

	transaction3 := domain.NewJournalTransaction(transactionId+3, []domain.JournalEntry{
		*domain.NewJournalEntry(domain.JournalAllowanceDoubtful, domain.JournalEntryTypeLoanActivation, domain.JournalEntryDirectionDebit, money.NewMoney(doubtfulAllowance)),
		*domain.NewJournalEntry(domain.JournalAllowanceDoubtfulReceivable, domain.JournalEntryTypeLoanActivation, domain.JournalEntryDirectionCredit, money.NewMoney(doubtfulAllowance)),
	}, bookingDate, loanId, correlationId)

	err = transaction1.Verify()
	if err != nil {
		return err
	}

	err = transaction2.Verify()
	if err != nil {
		return err
	}

	err = transaction3.Verify()
	if err != nil {
		return err
	}

	err = u.repo.InsertJournalsTransactions(ctx, *transaction1, *transaction2, *transaction3)
	if err != nil {
		return err
	}

	return nil
}

func (u *journalUseCase) BookCancelLoan(ctx context.Context, loanId string, correlationId string, principalAmount uint64, interestAmount uint64, bookingDate time.Time, adminFee uint64) (err error) {
	transactionId, err := u.repo.GetLatestTransactionIdForLoan(ctx, loanId)
	if err != nil {
		return err
	}

	// TODO: rewrite all calcs using decimal package or math/big
	adminFeeBeforeVAT := uint64(math.Round(float64(adminFee) / (float64(100+u.vatPercentage) / 100)))
	doubtfulAllowance := uint64(math.Round(float64(principalAmount) * (float64(u.doubtfulPercentage) / 100)))

	transaction1 := domain.NewJournalTransaction(transactionId+1, []domain.JournalEntry{
		*domain.NewJournalEntry(domain.JournalAllowanceDoubtful, domain.JournalEntryTypeLoanCancellation, domain.JournalEntryDirectionCredit, money.NewMoney(doubtfulAllowance)),
		*domain.NewJournalEntry(domain.JournalAllowanceDoubtfulReceivable, domain.JournalEntryTypeLoanCancellation, domain.JournalEntryDirectionDebit, money.NewMoney(doubtfulAllowance)),
	}, bookingDate, loanId, correlationId)

	transaction2 := domain.NewJournalTransaction(transactionId+2, []domain.JournalEntry{
		*domain.NewJournalEntry(domain.JournalMerchantDue, domain.JournalEntryTypeReverseAdminFee, domain.JournalEntryDirectionCredit, money.NewMoney(adminFee)),
		*domain.NewJournalEntry(domain.JournalAccountAdminFeeReceivable, domain.JournalEntryTypeReverseAdminFee, domain.JournalEntryDirectionDebit, money.NewMoney(adminFeeBeforeVAT)),
		*domain.NewJournalEntry(domain.JournalAccountTaxDue, domain.JournalEntryTypeReverseAdminFee, domain.JournalEntryDirectionDebit, money.NewMoney(adminFee-adminFeeBeforeVAT)),
	}, bookingDate, loanId, correlationId)

	transaction3 := domain.NewJournalTransaction(transactionId+3, []domain.JournalEntry{
		*domain.NewJournalEntry(domain.JournalAccountMurabhaLoanReceivable, domain.JournalEntryTypeLoanCancellation, domain.JournalEntryDirectionCredit, money.NewMoney(principalAmount)),
		*domain.NewJournalEntry(domain.JournalAccountMurabhaPurchase, domain.JournalEntryTypeLoanCancellation, domain.JournalEntryDirectionDebit, money.NewMoney(principalAmount)),
		*domain.NewJournalEntry(domain.JournalAccountMurabhaInterestReceivable, domain.JournalEntryTypeLoanCancellation, domain.JournalEntryDirectionCredit, money.NewMoney(interestAmount)),
		*domain.NewJournalEntry(domain.JournalAccountMurabhaUnearnedRevenue, domain.JournalEntryTypeLoanCancellation, domain.JournalEntryDirectionDebit, money.NewMoney(interestAmount)),
	}, bookingDate, loanId, correlationId)

	transaction4 := domain.NewJournalTransaction(transactionId+4, []domain.JournalEntry{
		*domain.NewJournalEntry(domain.JournalMerchantDue, domain.JournalEntryTypeSellToMerchant, domain.JournalEntryDirectionDebit, money.NewMoney(principalAmount)),
		*domain.NewJournalEntry(domain.JournalAccountMurabhaPurchase, domain.JournalEntryTypeSellToMerchant, domain.JournalEntryDirectionCredit, money.NewMoney(principalAmount)),
	}, bookingDate, loanId, correlationId)

	err = transaction1.Verify()
	if err != nil {
		return err
	}

	err = transaction2.Verify()
	if err != nil {
		return err
	}

	err = transaction3.Verify()
	if err != nil {
		return err
	}

	err = transaction4.Verify()
	if err != nil {
		return err
	}

	err = u.repo.InsertJournalsTransactions(ctx, *transaction1, *transaction2, *transaction3, *transaction4)
	if err != nil {
		return err
	}

	return nil
}

func (u *journalUseCase) BookInterestEarned(ctx context.Context, loanId string, correlationId string, amount uint64, bookingDate time.Time) (err error) {
	transactionId, err := u.repo.GetLatestTransactionIdForLoan(ctx, loanId)
	if err != nil {
		return err
	}

	transaction := domain.NewJournalTransaction(transactionId+1, []domain.JournalEntry{
		*domain.NewJournalEntry(domain.JournalAccountMurabhaUnearnedRevenue, domain.JournalEntryTypeInterestEarned, domain.JournalEntryDirectionDebit, money.NewMoney(amount)),
		*domain.NewJournalEntry(domain.JournalAccountInterestRevenue, domain.JournalEntryTypeInterestEarned, domain.JournalEntryDirectionCredit, money.NewMoney(amount)),
	}, bookingDate, loanId, correlationId)

	err = transaction.Verify()
	if err != nil {
		return err
	}

	err = u.repo.InsertJournalTransaction(ctx, *transaction)
	if err != nil {
		return err
	}

	return nil
}

func (u *journalUseCase) BookPaymentReceived(ctx context.Context, inputModel dto.BookPaymentReceivedRequest) (err error) {
	transactionId, err := u.repo.GetLatestTransactionIdForLoan(ctx, inputModel.LoanId)
	if err != nil {
		return
	}
	accountToDebit := domain.JournalAccountBtechCollections
	// check if the payment method is Fawry, then debit Fawry account, else debit BtechCollections account
	if inputModel.CollectionMethod == dto.FAWRY {
		accountToDebit = domain.JournalAccountFawryCollections
	}

	transaction1 := domain.NewJournalTransaction(
		transactionId+1,
		[]domain.JournalEntry{
			*domain.NewJournalEntry(accountToDebit, domain.JournalEntryTypeCollection, domain.JournalEntryDirectionDebit, &inputModel.TotalAmountPaid),
			*domain.NewJournalEntry(domain.JournalAccountCustomerCollections, domain.JournalEntryTypeCollection, domain.JournalEntryDirectionCredit, &inputModel.TotalAmountPaid),
		},
		inputModel.BookedAt,
		inputModel.LoanId,
		inputModel.CorrelationId,
	)

	transaction2 := domain.NewJournalTransaction(
		transactionId+2,
		[]domain.JournalEntry{
			*domain.NewJournalEntry(domain.JournalAccountCustomerCollections, domain.JournalEntryTypeCollection, domain.JournalEntryDirectionDebit, &inputModel.TotalAmountPaid),
			*domain.NewJournalEntry(domain.JournalAccountMurabhaLoanReceivable, domain.JournalEntryTypeCollection, domain.JournalEntryDirectionCredit, inputModel.TotalPrincipalPaid),
			*domain.NewJournalEntry(domain.JournalAccountMurabhaInterestReceivable, domain.JournalEntryTypeCollection, domain.JournalEntryDirectionCredit, inputModel.TotalInterestPaid),
		},
		inputModel.BookedAt,
		inputModel.LoanId,
		inputModel.CorrelationId,
	)

	err = transaction1.Verify()
	if err != nil {
		return
	}

	err = transaction2.Verify()
	if err != nil {
		return
	}

	// 2. Persist in Database
	err = u.repo.InsertJournalsTransactions(ctx, *transaction1, *transaction2)
	if err != nil {
		return
	}
	return
}

func (u *journalUseCase) BookEarlySettlementReceived(ctx context.Context, inputModel dto.BookEarlySettlementReceivedRequest) (err error) {
	transactionId, err := u.repo.GetLatestTransactionIdForLoan(ctx, inputModel.LoanId)
	if err != nil {
		return
	}
	accountToDebit := domain.JournalAccountBtechCollections
	// check if the payment method is Fawry, then debit Fawry account, else debit BtechCollections account
	if inputModel.CollectionMethod == dto.FAWRY {
		accountToDebit = domain.JournalAccountFawryCollections
	}

	deltaInInterest := inputModel.InterestReceivableDelta()

	transaction1 := domain.NewJournalTransaction(
		transactionId+1,
		[]domain.JournalEntry{
			*domain.NewJournalEntry(accountToDebit, domain.JournalEntryTypeCollectionEarlySettlement, domain.JournalEntryDirectionDebit, &inputModel.TotalAmountPaid),
			*domain.NewJournalEntry(domain.JournalAccountCustomerCollections, domain.JournalEntryTypeCollectionEarlySettlement, domain.JournalEntryDirectionCredit, &inputModel.TotalAmountPaid),
		},
		inputModel.BookedAt,
		inputModel.LoanId,
		inputModel.CorrelationId,
	)

	transaction2 := domain.NewJournalTransaction(
		transactionId+2,
		[]domain.JournalEntry{
			*domain.NewJournalEntry(domain.JournalAccountCustomerCollections, domain.JournalEntryTypeCollectionEarlySettlement, domain.JournalEntryDirectionDebit, &inputModel.TotalAmountPaid),
			*domain.NewJournalEntry(domain.JournalAccountMurabhaEarlySettlementAllowance, domain.JournalEntryTypeCollectionEarlySettlement, domain.JournalEntryDirectionDebit, deltaInInterest),
			*domain.NewJournalEntry(domain.JournalAccountMurabhaLoanReceivable, domain.JournalEntryTypeCollectionEarlySettlement, domain.JournalEntryDirectionCredit, &inputModel.TotalPrincipalPaid),
			*domain.NewJournalEntry(domain.JournalAccountMurabhaInterestReceivable, domain.JournalEntryTypeCollectionEarlySettlement, domain.JournalEntryDirectionCredit, &inputModel.TotalInitialInterestDue),
		},
		inputModel.BookedAt,
		inputModel.LoanId,
		inputModel.CorrelationId,
	)

	transaction3 := domain.NewJournalTransaction(
		transactionId+3,
		[]domain.JournalEntry{
			*domain.NewJournalEntry(domain.JournalAccountMurabhaUnearnedRevenue, domain.JournalEntryTypeCollectionEarlySettlement, domain.JournalEntryDirectionDebit, &inputModel.TotalInitialInterestDue),
			*domain.NewJournalEntry(domain.JournalAccountMurabhaEarlySettlementAllowance, domain.JournalEntryTypeCollectionEarlySettlement, domain.JournalEntryDirectionCredit, deltaInInterest),
			*domain.NewJournalEntry(domain.JournalAccountInterestRevenue, domain.JournalEntryTypeCollectionEarlySettlement, domain.JournalEntryDirectionCredit, &inputModel.TotalInterestPaid),
		},
		inputModel.BookedAt,
		inputModel.LoanId,
		inputModel.CorrelationId,
	)

	err = transaction1.Verify()
	if err != nil {
		return
	}

	err = transaction2.Verify()
	if err != nil {
		return
	}

	err = transaction3.Verify()
	if err != nil {
		return
	}

	// 2. Persist in Database
	err = u.repo.InsertJournalsTransactions(ctx, *transaction1, *transaction2, *transaction3)
	if err != nil {
		return
	}
	return
}
