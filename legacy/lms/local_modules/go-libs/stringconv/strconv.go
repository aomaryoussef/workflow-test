package stringconv

import (
	"strconv"
	"strings"
)

type StrValType string

const (
	ValTypeInteger64 StrValType = "int64"
	ValTypeFloat64   StrValType = "float64"
	ValTypeBool      StrValType = "bool"
	ValTypeString    StrValType = "string"
)

// StrVal holds the value of the parsed string in the available format
// and the type val: StrValType
type StrVal struct {
	Type  StrValType
	Value any
}

// ParseStringValue parses a string value into the available 4 corresponding
// value and their type.
// See StrVal for details on the return type.
// The available 4 types are : int64, float64, bool, string.
func ParseStringValue(str string) (strVal StrVal) {
	var valueType StrValType
	var value any

	str = strings.TrimSpace(str)

	if intVal, err := strconv.ParseInt(str, 10, 64); err == nil {
		valueType = ValTypeInteger64
		value = intVal
	} else if floatValue, err := strconv.ParseFloat(str, 64); err == nil {
		valueType = ValTypeFloat64
		value = floatValue
	} else if boolValue, err := strconv.ParseBool(str); err == nil {
		valueType = ValTypeBool
		value = boolValue
	} else {
		valueType = ValTypeString
		value = str
	}

	strVal = StrVal{
		Value: value,
		Type:  valueType,
	}
	return
}
