package model

import (
	"github.com/btechlabs/lms/internal/domain/accounting/common"
	"time"
)

const (
	// Cost Center
	CostCenterWorld    = "world"
	CostCenterConsumer = "consumer"
	CostCenterMylo     = "mylo"
	CostCenterLoan     = "loan"
	CostCenterMerchant = "merchant"
	// Account
	AccountTreasury = "treasury"
	AccountWallet   = "wallet"
	// LenderSource for capturing payments
	LenderSourcePayments = "payments"
)

type JournalPosting struct {
	Id                uint64
	LinkedEntityId    string
	LinkedEntityType  string
	LenderSource      string
	EventId           string
	EventType         string
	TransactionGroups []JournalTransactionGroup
	BookedAt          time.Time
}

type JournalTransactionGroup struct {
	TransactionGroup uint16
	Transactions     []JournalTransaction
}

type JournalTransaction struct {
	CostCenter string
	Account    string
	SubAccount string
	Direction  common.JournalDirection
	Amount     uint64
}

func NewJournalTransaction(costCenter string, account string, subaccount string, direction common.JournalDirection, amount uint64) JournalTransaction {
	return JournalTransaction{
		CostCenter: costCenter,
		Account:    account,
		SubAccount: subaccount,
		Direction:  direction,
		Amount:     amount,
	}
}

func (jp *JournalPosting) IsBalanced() bool {
	debit := uint64(0)
	credit := uint64(0)
	for _, tg := range jp.TransactionGroups {
		for _, t := range tg.Transactions {
			if t.Direction == common.Debit {
				debit += t.Amount
			} else {
				credit += t.Amount
			}
		}
		if debit != credit {
			return false
		}
	}
	return true
}
