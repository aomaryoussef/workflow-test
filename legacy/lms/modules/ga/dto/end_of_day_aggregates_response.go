package dto

type EndOfDayAggregatesResponse struct {
	TransactionTypes     []TransactionTypeLine     `json:"transaction_types" mapstructure:"transaction_types"`
	MerchantTransactions []MerchantTransactionLine `json:"merchant_transactions" mapstructure:"merchant_transactions"`
	MerchantAdminFees    []MerchantTransactionLine `json:"merchant_admin_fees" mapstructure:"merchant_admin_fees"`
	JournalEntryIDs      []JournalEntry            `json:"journal_entry_ids" mapstructure:"journal_entry_ids"`
}

type AccountBalanceChange struct {
	AccountName   string `json:"account_name" mapstructure:"account_name"`
	BalanceChange int64  `json:"balance_change" mapstructure:"balance_change"`
}

type TransactionTypeLine struct {
	Type    string                 `json:"type" mapstructure:"type"`
	Changes []AccountBalanceChange `json:"changes" mapstructure:"changes"`
}

type MerchantTransactionLine struct {
	MerchantId       int    `json:"merchant_id" mapstructure:"merchant_id"`
	MerchantGlobalId string `json:"merchant_global_id" mapstructure:"merchant_global_id"`
	Amount           int64  `json:"amount" mapstructure:"amount"`
}

type JournalEntry struct {
	Id   int32  `json:"id" mapstructure:"id"`
	Type string `json:"type" mapstructure:"type"`
}
