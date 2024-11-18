package money

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

var (
	ErrInvalidStringNotation = errors.New("invalid string notation, use val/precision")
	ErrMoneyNegative         = errors.New("money units cannot be negative")
)

// Currency represents money currency information required for formatting.
// See: https://golangprojectstructure.com/representing-money-and-currency-go-code/
// Implementation: https://github.com/Rhymond/go-money/blob/master/money.go
type Currency struct {
	Code        string
	NumericCode string
	Fraction    int
	Grapheme    string
}

// CurrencyFromString returns a currency from a string representation of the currency code.
// The default currency is EGP if the string is malformed or the currency does not exist.
func CurrencyFromString(currencyCode string) Currency {
	if currencyCode == "" {
		return Currency_EGP
	}

	switch strings.ToUpper(currencyCode) {
	case "EGP":
		return Currency_EGP
	default:
		return Currency_EGP
	}
}

// current suported currency
var Currency_EGP = Currency{
	Code: "EGP", Fraction: 2, NumericCode: "818", Grapheme: "\u00a3",
}

// Money represents monetary value information, stores
// currency and units value
type Money struct {
	// units holds the value in the lowest possible denomination
	units    uint64
	currency Currency
}

// Units returns the number of lowest denomination
func (m *Money) Units() uint64 {
	return m.units
}
func (m *Money) UnitsOrZero() uint64 {
	if m == nil {
		return 0
	}
	return m.units
}
func (m *Money) Currency() Currency {
	return m.currency
}
func (m *Money) AddMoney(nm *Money) (s *Money) {
	m.units += nm.units
	return m
}
func (m *Money) SubMoney(nm *Money) (s *Money, err error) {
	if nm.Units() > m.Units() {
		return nil, ErrMoneyNegative
	}
	m.units -= nm.units
	return m, nil
}
func (m *Money) Lt(nm *Money) bool {
	return m.Units() < nm.Units()
}
func (m *Money) Gt(nm *Money) bool {
	return m.Units() > nm.Units()
}

func (m *Money) Ne(nm *Money) bool {
	return m.Units() != nm.Units()
}

func (m *Money) Eq(nm *Money) bool {
	return m.Units() == nm.Units()
}

//func (m *Money) SimpleNotation() string {
//	return fmt.Sprintf("%d/%d", m.units, m.currency.Fraction)
//}

func (m *Money) ReadableNotation() string {
	if m.UnitsOrZero() == 0 {
		return "0"
	}
	floatVal := float64(m.units)
	floatVal = floatVal / 100
	return strconv.FormatFloat(floatVal, 'f', 2, 64)
}
func (m *Money) ReadableNotationWithCurrency() string {
	readableNotation := m.ReadableNotation()
	return fmt.Sprintf("%s %s", m.currency.Code, readableNotation)
}
func (m *Money) String() string {
	return m.ReadableNotationWithCurrency()
}

func NewMoney(amt uint64) *Money {
	return &Money{
		units:    amt,
		currency: Currency_EGP,
	}
}

type SerializableMoney struct {
	Units        uint64 `json:"units" mapstructure:"units"`
	CurrencyCode string `json:"currency_code" mapstructure:"currency_code"`
}

func SerializeMoney(m *Money) *SerializableMoney {
	if m == nil {
		return nil
	}
	return &SerializableMoney{
		Units:        m.units,
		CurrencyCode: m.currency.Code,
	}
}

//func FromSerializableMoney(m *SerializableMoney) *Money {
//	if m == nil {
//		return nil
//	}
//	return NewMoney(m.Units)
//}

func (sm *SerializableMoney) ConvertTOPound() *SerializableMoney {
	return &SerializableMoney{
		Units:        sm.Units / 100,
		CurrencyCode: sm.CurrencyCode,
	}
}

func (sm *SerializableMoney) ConvertTOCent() *SerializableMoney {
	return &SerializableMoney{
		Units:        sm.Units * 100,
		CurrencyCode: sm.CurrencyCode,
	}
}
