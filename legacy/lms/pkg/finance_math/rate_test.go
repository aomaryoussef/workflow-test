package financemath

import (
	"testing"
)

func TestRate(t *testing.T) {
	_, err := Rate(12, -float64(11000), float64(120000), 0, 0, 0.5)
	if err != nil {
		t.Fatal(err)
	}

	//assert.Equal(t, 12, val)
}
