package domain

import (
	"time"

	"github.com/btechlabs/lms-lite/pkg/money"
)

type JournalAccount string

type JournalEntryDirection string

type JournalEntryTransactionType string

const (
	JournalMerchantDue                            JournalAccount = "MerchantDue"
	JournalAccountMurabhaLoanReceivable           JournalAccount = "MurabhaPrincipalReceivable" //Murabha (LoanReceivable)
	JournalAccountMurabhaInterestReceivable       JournalAccount = "MurabhaInterestReceivable"
	JournalAccountMurabhaLateFeeReceivable        JournalAccount = "MurabhaLateFeeReceivable"
	JournalAccountMerchantAccountsPayable         JournalAccount = "MerchantAccountsPayable"
	JournalAccountMurabhaPurchase                 JournalAccount = "MurabhaPurchase" //MurabhaPurchase (MerchantAccountsPayable)
	JournalAccountMurabhaUnearnedRevenue          JournalAccount = "MurabhaUnearnedRevenue"
	JournalAccountAdminFeeIncome                  JournalAccount = "AdminFeeIncome"
	JournalAccountAdminFeeReceivable              JournalAccount = "AdminFeeReceivable"
	JournalAccountInterestRevenue                 JournalAccount = "InterestRevenue"
	JournalAccountTaxDue                          JournalAccount = "TaxDue"
	JournalAllowanceDoubtful                      JournalAccount = "Doubtful"
	JournalAllowanceDoubtfulReceivable            JournalAccount = "DoubtfulReceivable"
	JournalAccountBtechCollections                JournalAccount = "BtechCollections"
	JournalAccountFawryCollections                JournalAccount = "FawryCollections"
	JournalAccountCustomerCollections             JournalAccount = "CustomerCollections"
	JournalAccountMurabhaEarlySettlementAllowance JournalAccount = "MurabhaEarlySettlementAllowance"

	JournalEntryDirectionDebit  JournalEntryDirection = "DEBIT"
	JournalEntryDirectionCredit JournalEntryDirection = "CREDIT"

	JournalEntryTypeLoanActivation            JournalEntryTransactionType = "LOAN_ACTIVATION"
	JournalEntryTypeLoanCancellation          JournalEntryTransactionType = "LOAN_CANCELLATION"
	JournalEntryTypePurchasingFromMerchant    JournalEntryTransactionType = "PURCHASING_FROM_MERCHANT"
	JournalEntryTypeSellToMerchant            JournalEntryTransactionType = "SELLING_TO_MERCHANT"
	JournalEntryTypeAdminFee                  JournalEntryTransactionType = "ADMIN_FEE"
	JournalEntryTypeReverseAdminFee           JournalEntryTransactionType = "REVERSE_ADMIN_FEE"
	JournalEntryTypeInterestEarned            JournalEntryTransactionType = "INTEREST_EARNED"
	JournalEntryTypeCollection                JournalEntryTransactionType = "COLLECTION"
	JournalEntryTypeCollectionEarlySettlement JournalEntryTransactionType = "COLLECTION_EARLY_SETTLEMENT"
)

type JournalEntry struct {
	account         JournalAccount
	transactionType JournalEntryTransactionType
	direction       JournalEntryDirection
	amount          *money.Money
	createdAt       time.Time
	createdBy       string
}

func NewJournalEntry(account JournalAccount, transactionType JournalEntryTransactionType, direction JournalEntryDirection, amount *money.Money) *JournalEntry {
	return &JournalEntry{
		account:         account,
		transactionType: transactionType,
		direction:       direction,
		amount:          amount,
	}
}

func (je *JournalEntry) Amount() *money.Money {
	return je.amount
}

func (je *JournalEntry) Type() JournalEntryTransactionType {
	return je.transactionType
}

func (je *JournalEntry) Direction() JournalEntryDirection {
	return je.direction
}

func (je *JournalEntry) Account() JournalAccount {
	return je.account
}

func (je *JournalEntry) CreatedAt() time.Time {
	return je.createdAt
}

func (je *JournalEntry) CreatedBy() string {
	return je.createdBy
}
