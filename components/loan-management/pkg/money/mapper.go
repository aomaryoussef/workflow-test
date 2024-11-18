package money

import (
	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/gen/pb/common"
)

func MapApiMoneyToProtoMoney(apiMoney api.Money) *common.Money {
	return &common.Money{
		Units:    uint64(apiMoney.Amount),
		Currency: string(apiMoney.Currency),
	}
}

func MapApiMoneyToDomainMoney(apiMoney api.Money) *Money {
	if apiMoney.Amount < 0 {
		return NewMoney(uint64(apiMoney.Amount*-1), string(apiMoney.Currency))
	}
	return NewMoney(uint64(apiMoney.Amount), string(apiMoney.Currency))
}

func MapProtoMoneyToDomainMoney(protoMoney *common.Money) *Money {
	return NewMoney(protoMoney.Units, protoMoney.Currency)
}
