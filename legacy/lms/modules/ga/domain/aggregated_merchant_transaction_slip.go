package domain

type AggregatedMerchantTransactionSlip struct {
	MerchantAccountID  string   `db:"merchant_account_id"`
	PayableCurrency    string   `db:"payable_currency"`
	TotalUnits         int64    `db:"total_units"`
	TransactionSlipIDs []string `db:"transaction_slip_ids"`
}
