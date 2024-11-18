package stringconv

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"

	"github.com/samber/lo"
)

type StrValType string

const (
	ValTypeInteger64 StrValType = "int64"
	ValTypeFloat64   StrValType = "float64"
	ValTypeBool      StrValType = "bool"
	ValTypeString    StrValType = "string"
	DecimalSeparator            = "."
	FormulaSeparator            = "+"
	PercentMarker               = "%"
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

func ParseFormulaToBasisPoints(str string, precision uint8) (flatPartBasisPoints uint64, percentagePartBasisPoints uint64, err error) {
	if !strings.Contains(str, FormulaSeparator) {
		return 0, 0, fmt.Errorf("invalid formula: %s", str)
	}

	parts := strings.Split(str, FormulaSeparator)
	parts = lo.Map(parts, func(s string, i int) string { return strings.TrimSpace(s) })

	var flatPart, percentagePart string
	if strings.Contains(parts[0], PercentMarker) && !strings.Contains(parts[1], PercentMarker) {
		percentagePart, flatPart = strings.Replace(parts[0], "%", "", 1), parts[1]
	} else if !strings.Contains(parts[0], PercentMarker) && strings.Contains(parts[1], PercentMarker) {
		percentagePart, flatPart = strings.Replace(parts[1], "%", "", 1), parts[0]
	} else {
		return 0, 0, fmt.Errorf("invalid formula: %s", str)
	}

	flatPartBasisPoints, err = ParseStringToBasisPoints(flatPart, precision)
	if err != nil {
		return 0, 0, err
	}

	percentagePartBasisPoints, err = ParseStringToBasisPoints(percentagePart, precision)
	if err != nil {
		return 0, 0, err
	}

	return flatPartBasisPoints, percentagePartBasisPoints, nil
}

func ParseStringToBasisPoints(str string, precision uint8) (basisPoints uint64, err error) {
	str = strings.TrimSpace(str)
	basisPoints = uint64(0)
	if strings.Contains(str, DecimalSeparator) {
		tokens := strings.Split(str, DecimalSeparator)
		integerPart, err := strconv.ParseUint(tokens[0], 10, 32)
		if err != nil {
			err = fmt.Errorf("invalid integer part: %s", str)
			return basisPoints, err
		}
		fractionalPart := uint64(0)

		if len(tokens[1]) == 0 {
			fractionalPart = 0
		} else if len(tokens[1]) > 0 && len(tokens[1]) <= int(precision) {
			paddedFractional := tokens[1] + strings.Repeat("0", int(precision)-len(tokens[1]))
			fractionalPart, err = strconv.ParseUint(paddedFractional, 10, 64)
			if err != nil {
				err = fmt.Errorf("invalid fractional part: %s", str)
				return basisPoints, err
			}
		} else {
			fractionalPart, err = strconv.ParseUint(tokens[1][0:precision], 10, 64)
			if err != nil {
				err = fmt.Errorf("invalid fractional part: %s", str)
				return basisPoints, err
			}
		}

		// integerPart * 10^precision e.g. if precision=2, then 10^2=100
		// so integerPart * 100 + fractionalPart = units in the lowest denomination
		basisPoints = (integerPart * uint64(math.Pow(10, float64(precision)))) + fractionalPart
	} else {
		integerPart, err := strconv.ParseUint(str, 10, 64)
		if err != nil {
			err = fmt.Errorf("invalid integer part: %s", str)
			return basisPoints, err
		}
		basisPoints = integerPart * 100
	}

	return basisPoints, nil
}

func ParseStringAsDateTime(str string) (t *time.Time, err error) {
	if str == "" {
		return nil, nil
	}
	timeObj, err := time.Parse(time.RFC3339, str)
	if err != nil {
		return nil, err
	}
	t = &timeObj
	return t, nil
}
