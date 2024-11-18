package stringconv

import (
	"testing"

	"github.com/stretchr/testify/assert"
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
func TestParseStringValue_Float64_SingleDecimal(t *testing.T) {
	strVal := ParseStringValue("64.9")
	assert.Equal(t, 64.9, strVal.Value)
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

func TestParseStringToBasisPoints_InvalidChars(t *testing.T) {
	_, err := ParseStringToBasisPoints("123,09", uint8(2))
	assert.NotNil(t, err)
	assert.Equal(t, "invalid integer part: 123,09", err.Error())
}

func TestParseStringToBasisPoints_Integer(t *testing.T) {
	basisPoints, err := ParseStringToBasisPoints("123", uint8(2))
	assert.Nil(t, err)
	assert.Equal(t, uint64(12300), basisPoints)
}

func TestParseStringToBasisPoints_SingleDecimalWhole(t *testing.T) {
	basisPoints, err := ParseStringToBasisPoints("123.0", uint8(2))
	assert.Nil(t, err)
	assert.Equal(t, uint64(12300), basisPoints)
}

func TestParseStringToBasisPoints_DoubleDecimalWhole(t *testing.T) {
	basisPoints, err := ParseStringToBasisPoints("123.00", uint8(2))
	assert.Nil(t, err)
	assert.Equal(t, uint64(12300), basisPoints)
}

func TestParseStringToBasisPoints_TripleDecimalWhole(t *testing.T) {
	basisPoints, err := ParseStringToBasisPoints("123.000", uint8(2))
	assert.Nil(t, err)
	assert.Equal(t, uint64(12300), basisPoints)
}

func TestParseStringToBasisPoints_SingleDecimal(t *testing.T) {
	basisPoints, err := ParseStringToBasisPoints("123.9", uint8(2))
	assert.Nil(t, err)
	assert.Equal(t, uint64(12390), basisPoints)
}

func TestParseStringToBasisPoints_DoubleDecimal(t *testing.T) {
	basisPoints, err := ParseStringToBasisPoints("123.09", uint8(2))
	assert.Nil(t, err)
	assert.Equal(t, uint64(12309), basisPoints)
}

func TestParseStringToBasisPoints_TripleDecimalNoRounding(t *testing.T) {
	basisPoints, err := ParseStringToBasisPoints("123.099", uint8(2))
	assert.Nil(t, err)
	assert.Equal(t, uint64(12309), basisPoints)
}

func TestParseFormulaToBasisPoints(t *testing.T) {
	testCases := []struct {
		name           string
		formula        string
		flatPart       uint64
		percentagePart uint64
		shouldErr      bool
	}{
		{
			name:           "TestParseFormulaToBasisPoints_1",
			formula:        "12.34% + 45.67",
			flatPart:       4567,
			percentagePart: 1234,
			shouldErr:      false,
		},
		{
			name:           "TestParseFormulaToBasisPoints_2",
			formula:        "12.34%",
			flatPart:       0,
			percentagePart: 1234,
			shouldErr:      true, // Both parts must be present
		},
		{
			name:           "TestParseFormulaToBasisPoints_3",
			formula:        "45.67",
			flatPart:       4567,
			percentagePart: 1234,
			shouldErr:      true, // Both parts must be present
		},
		{
			name:           "TestParseFormulaToBasisPoints_4",
			formula:        "12.34% + 45.67%",
			flatPart:       0,
			percentagePart: 0,
			shouldErr:      true, // Each part must be present exactly once
		},
		{
			name:           "TestParseFormulaToBasisPoints_5",
			formula:        "12.34 + 45.67",
			flatPart:       0,
			percentagePart: 0,
			shouldErr:      true, // Each part must be present exactly once
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			flatPart, percentagePart, err := ParseFormulaToBasisPoints(tc.formula, uint8(2))
			if tc.shouldErr {
				assert.NotNil(t, err)
			} else {
				assert.Nil(t, err)
				assert.Equal(t, tc.flatPart, flatPart)
				assert.Equal(t, tc.percentagePart, percentagePart)
			}
		})
	}

	flatPartBasisPoints, percentagePartBasisPoints, err := ParseFormulaToBasisPoints("12.34% + 45.67", uint8(2))
	assert.Nil(t, err)
	assert.Equal(t, uint64(4567), flatPartBasisPoints)
	assert.Equal(t, uint64(1234), percentagePartBasisPoints)
}
