// COPIED FROM https://github.com/alpeb/go-finance/blob/master/fin/tvm.go

package financemath

import (
	"errors"
	"math"
)

// These constants are used in the TVM functions (parameter "paymentType"). They
// determine whether payments occur at the end or at the beginning of each period:
const (
	PayEnd = iota
	PayBegin

	// MaxIterations determines the maximum number of iterations performed by the Newton-Raphson algorithm.
	maxIterations = 30
	// Precision determines how close to the solution the Newton-Raphson algorithm should arrive before stopping.
	precision = 1e-6
)

// Rate returns the periodic interest rate for a cash flow with constant periodic payments (annuities).
// Guess is a guess for the rate, used as a starting point for the iterative algorithm.
//
// Excel equivalent: RATE
func Rate(numPeriods int, pmt float64, pv float64, fv float64, paymentType int, guess float64) (float64, error) {
	if paymentType != PayEnd && paymentType != PayBegin {
		return 0, errors.New("payment type must be pay-end or pay-begin")
	}
	function := func(rate float64) float64 {
		return f(rate, numPeriods, pmt, pv, fv, paymentType)
	}
	derivative := func(rate float64) float64 {
		return df(rate, numPeriods, pmt, pv, fv, paymentType)
	}
	return newton(guess, function, derivative, 0)
}

func f(rate float64, numPeriods int, pmt float64, pv float64, fv float64, paymentType int) float64 {
	compounded := math.Pow(1+rate, float64(numPeriods))
	return pv*compounded + pmt*(1+rate*float64(paymentType))*((compounded-1)/rate) + fv
}

func df(rate float64, numPeriods int, pmt float64, pv float64, fv float64, paymentType int) float64 {
	compounded1 := math.Pow(1+rate, float64(numPeriods))
	compounded2 := math.Pow(1+rate, float64(numPeriods-1))
	return float64(numPeriods)*pv*compounded2 + pmt*(float64(paymentType)*(compounded1-1)/rate+(1+rate*float64(paymentType))*(float64(numPeriods)*rate*compounded2-compounded1+1)/math.Pow(rate, 2))
}

func newton(guess float64, function func(float64) float64, derivative func(float64) float64, numIt int) (float64, error) {
	x := guess - function(guess)/derivative(guess)
	if math.Abs(x-guess) < precision {
		return x, nil
	} else if numIt >= maxIterations {
		return 0, errors.New("solution didn't converge")
	} else {
		return newton(x, function, derivative, numIt+1)
	}
}
