package domain

type AccountBalanceChange struct {
	accountName     string
	balanceChange   int64
	transactionType string
}

func NewAccountBalanceChange(accountName string, balanceChange int64, transactionType string) AccountBalanceChange {
	return AccountBalanceChange{
		accountName:     accountName,
		balanceChange:   balanceChange,
		transactionType: transactionType,
	}
}

func (a *AccountBalanceChange) AccountName() string {
	return a.accountName
}

func (a *AccountBalanceChange) BalanceChange() int64 {
	return a.balanceChange
}

func (a *AccountBalanceChange) TransactionType() string {
	return a.transactionType
}

// BUILDER

type AccountBalanceChangeBuilder struct {
	AccountName     string `db:"account"`
	BalanceChange   int64  `db:"sum"`
	TransactionType string `db:"type"`
}

func NewAccountBalanceChangeBuilder() *AccountBalanceChangeBuilder {
	return &AccountBalanceChangeBuilder{}
}

func (a *AccountBalanceChangeBuilder) Build() AccountBalanceChange {
	return AccountBalanceChange{
		accountName:     a.AccountName,
		balanceChange:   a.BalanceChange,
		transactionType: a.TransactionType,
	}
}
