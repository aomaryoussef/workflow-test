package types

import (
	"errors"
	"fmt"
	"math"
	"strconv"
	"strings"
)

type PercentBasisPoints uint32

func (p PercentBasisPoints) Primitive() uint32 {
	return uint32(p)
}

func (p PercentBasisPoints) ToRate() float64 {
	return float64(p) / (Hundred * Hundred)
}

func (p PercentBasisPoints) String() string {
	rate := float64(p) / Hundred
	return fmt.Sprintf("%.2f%%", rate)
}

const (
	DecimalSeparator = "."
	Hundred          = 100
)

// StrPercentToBasisPoints returns the percent in basis points.
// The precision is determined by the format of the specific percent string.
//
// 1. If s = 15, percentBasisPoints = 1500 i.e. 15*100
// 2. If s = 15.5, percentBasisPoints = 1550 i.e. (15*10^2) + 50
// 3. If s = 15.765, percentBasisPoints = 1577 i.e. (15*10^2) + 77
func StrPercentToBasisPoints(s string) (PercentBasisPoints, error) {
	trimmed := strings.TrimSpace(s)
	split := strings.Split(trimmed, DecimalSeparator)
	switch len(split) {
	case 1:
		percent, err := strconv.ParseUint(trimmed, 10, 32)
		if err != nil {
			return 0, err
		}
		return PercentBasisPoints(percent * 100), nil
	case 2:
		percent, err := strconv.ParseFloat(trimmed, 64)
		if err != nil {
			return 0, err
		}
		return PercentBasisPoints(FloatRoundedToNearestPrecision(percent, 2) * Hundred), nil
	default:
		return 0, errors.New("invalid format")
	}
}

func FloatRoundedToNearestPrecision(f float64, p int) float64 {
	precisionPow := math.Pow(10, float64(p))
	return math.Round(f*precisionPow) / precisionPow
}

func RateToBasisPoints(rate float64, precision int) PercentBasisPoints {
	precisionPow := math.Pow(10, float64(precision))
	return PercentBasisPoints(uint32(math.Round(rate * precisionPow)))
}
