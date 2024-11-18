package domain

type MerchantTransaction struct {
	merchantId       int
	merchantGlobalId string
	amount           int64
}

func (m *MerchantTransaction) MerchantId() int {
	return m.merchantId
}

func (m *MerchantTransaction) MerchantGlobalId() string {
	return m.merchantGlobalId
}

func (m *MerchantTransaction) Amount() int64 {
	return m.amount
}

// BUILDER

type MerchantTransactionBuilder struct {
	MerchantId       int    `db:"merchant_id"`
	MerchantGlobalId string `db:"merchant_global_id"`
	Amount           int64  `db:"amount"`
}

func NewMerchantTransactionBuilder() *MerchantTransactionBuilder {
	return &MerchantTransactionBuilder{}
}

func (m *MerchantTransactionBuilder) Build() MerchantTransaction {
	return MerchantTransaction{
		merchantId:       m.MerchantId,
		merchantGlobalId: m.MerchantGlobalId,
		amount:           m.Amount,
	}
}
