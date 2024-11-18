package money

import (
	"bytes"
	"encoding/json"
	"fmt"
	gomoney "github.com/Rhymond/go-money"
	"github.com/btechlabs/lms/pkg/reflectx"
)

var (
	EgyptianPound         = "EGP"
	DefaultSystemCurrency = EgyptianPound
)

type Money struct {
	*gomoney.Money
}

func NewMoney(amt uint64, c string) *Money {
	mny := &Money{
		Money: gomoney.New(int64(amt), c),
	}
	return mny
}

func (m *Money) Amount() uint64 {
	return uint64(m.Money.Amount())
}

func (m *Money) MustMutateAdd(o *Money) {
	n, err := m.Money.Add(o.Money)
	if err != nil {
		panic(err)
	}
	m.Money = n
}
func (m *Money) MustMutateSub(o *Money) {
	n, err := m.Money.Subtract(o.Money)
	if err != nil {
		panic(err)
	}
	m.Money = gomoney.New(n.Amount(), n.Currency().Code)
}
func (m *Money) Add(o *Money) (*Money, error) {
	n, err := m.Money.Add(o.Money)
	if err != nil {
		return nil, err
	}
	return &Money{n}, nil
}
func (m *Money) MustAdd(o *Money) *Money {
	n, err := m.Money.Add(o.Money)
	if err != nil {
		panic(err)
	}
	return &Money{n}
}
func (m *Money) MustSub(o *Money) *Money {
	n, err := m.Money.Subtract(o.Money)
	if err != nil {
		panic(err)
	}
	return &Money{n}
}
func (m *Money) MustEquals(o *Money) bool {
	eq, err := m.Money.Equals(o.Money)
	if err != nil {
		panic(err)
	}
	return eq
}
func (m *Money) String() string {
	return m.Money.Display()
}

// UnmarshalJSON is implementation of json.Unmarshaller
func (m *Money) UnmarshalJSON(b []byte) error {
	data := make(map[string]interface{})
	err := json.Unmarshal(b, &data)
	if err != nil {
		return err
	}

	if data["units"] == nil || data["currency"] == nil {
		return gomoney.ErrInvalidJSONUnmarshal
	}
	amountRaw, _ := data["units"]
	currencyRaw, _ := data["currency"]

	if !reflectx.IsOfType(amountRaw, float64(0)) || !reflectx.IsOfType(currencyRaw, "") {
		return gomoney.ErrInvalidJSONUnmarshal
	}

	var amount = amountRaw.(float64)
	var currency = currencyRaw.(string)

	if currency == "" {
		return gomoney.ErrInvalidJSONUnmarshal
	}

	if gomoney.GetCurrency(currency) == nil {
		return gomoney.ErrInvalidJSONUnmarshal
	}

	var ref = NewMoney(uint64(amount), currency)

	*m = *ref
	return nil
}

// MarshalJSON is implementation of json.Marshaller
func (m *Money) MarshalJSON() ([]byte, error) {
	if m == nil || m.Money == nil {
		return []byte(nil), nil
	}

	if m.Money.Currency() == nil {
		m = NewMoney(0, DefaultSystemCurrency)
	}

	buff := bytes.NewBufferString(fmt.Sprintf(`{"units": %d, "currency": "%s"}`, m.Amount(), m.Currency().Code))
	return buff.Bytes(), nil
}

func AsPtr(m Money) *Money {
	return &m
}

func UnitsOrZero(m *Money) uint64 {
	if m == nil {
		return 0
	}
	return m.Amount()
}
