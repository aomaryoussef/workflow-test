package stringconv

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestParseStringValue_Int64(t *testing.T) {
	strVal := ParseStringValue("64")
	assert.Equal(t, int64(64), strVal.Value)
	assert.Equal(t, ValTypeInteger64, strVal.Type)
}
func TestParseStringValue_Float64(t *testing.T) {
	strVal := ParseStringValue("64.09")
	assert.Equal(t, 64.09, strVal.Value)
	assert.Equal(t, ValTypeFloat64, strVal.Type)
}
func TestParseStringValue_Bool(t *testing.T) {
	var strVal StrVal
	strVal = ParseStringValue("true")
	assert.Equal(t, true, strVal.Value)
	assert.Equal(t, ValTypeBool, strVal.Type)

	strVal = ParseStringValue("True")
	assert.Equal(t, true, strVal.Value)
	assert.Equal(t, ValTypeBool, strVal.Type)
}
func TestParseStringValue_String(t *testing.T) {
	strVal := ParseStringValue("whatever")
	assert.Equal(t, "whatever", strVal.Value)
	assert.Equal(t, ValTypeString, strVal.Type)
}

func TestParseStringValue_InvalidInt64(t *testing.T) {
	strVal := ParseStringValue("64f")
	assert.Equal(t, "64f", strVal.Value)
	assert.Equal(t, ValTypeString, strVal.Type)
}
func TestParseStringValue_InvalidFloat64(t *testing.T) {
	strVal := ParseStringValue("64.09f")
	assert.Equal(t, "64.09f", strVal.Value)
	assert.Equal(t, ValTypeString, strVal.Type)
}
