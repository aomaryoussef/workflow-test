package money

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestUnmarshalJSON(t *testing.T) {
	t.Run("valid JSON data", func(t *testing.T) {
		data := []byte(`{"units":100,"currency":"USD"}`)
		var m Money
		err := m.UnmarshalJSON(data)
		assert.NoError(t, err)
		assert.Equal(t, uint64(100), m.Amount())
		assert.Equal(t, "USD", m.Currency().Code)
	})

	t.Run("invalid JSON format", func(t *testing.T) {
		data := []byte(`{"units":100,"currency":"USD"`)
		var m Money
		err := m.UnmarshalJSON(data)
		assert.Error(t, err)
	})

	t.Run("missing units field", func(t *testing.T) {
		data := []byte(`{"currency":"USD"}`)
		var m Money
		err := m.UnmarshalJSON(data)
		assert.Error(t, err)
	})

	t.Run("missing currency field", func(t *testing.T) {
		data := []byte(`{"units":100}`)
		var m Money
		err := m.UnmarshalJSON(data)
		assert.Error(t, err)
	})

	t.Run("invalid currency code", func(t *testing.T) {
		data := []byte(`{"units":100,"currency":"INVALID"}`)
		var m Money
		err := m.UnmarshalJSON(data)
		assert.Error(t, err)
	})
}

func TestMarshalJSON(t *testing.T) {
	t.Run("valid money object", func(t *testing.T) {
		m := NewMoney(100, "USD")
		expected := `{"units":100,"currency":"USD"}`
		result, err := m.MarshalJSON()
		assert.NoError(t, err)
		assert.JSONEq(t, expected, string(result))
	})

	t.Run("zero units", func(t *testing.T) {
		m := NewMoney(0, "EUR")
		expected := `{"units":0,"currency":"EUR"}`
		result, err := m.MarshalJSON()
		assert.NoError(t, err)
		assert.JSONEq(t, expected, string(result))
	})

	t.Run("nil money object", func(t *testing.T) {
		var m *Money
		result, err := m.MarshalJSON()
		assert.NoError(t, err)
		assert.Nil(t, result)
	})

	t.Run("nil currency", func(t *testing.T) {
		m := &Money{}
		result, err := m.MarshalJSON()
		assert.NoError(t, err)
		assert.Nil(t, result)
	})
}
