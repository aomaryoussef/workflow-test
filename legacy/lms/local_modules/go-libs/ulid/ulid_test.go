package ulid

import (
	"github.com/stretchr/testify/assert"
	"strings"
	"sync"
	"testing"
)

func TestNewULID_ConcurrentExecutionReturnsUniqueValues(t *testing.T) {
	var wg sync.WaitGroup
	wg.Add(2)

	ulidChan1 := make(chan string)
	ulidChan2 := make(chan string)

	go func(ch chan string, wg *sync.WaitGroup) {
		defer wg.Done()
		ch <- NewULID()
	}(ulidChan1, &wg)
	go func(ch chan string, wg *sync.WaitGroup) {
		defer wg.Done()
		ch <- NewULID()
	}(ulidChan2, &wg)

	ulidVal1 := <-ulidChan1
	ulidVal2 := <-ulidChan2

	assert.NotEqual(t, ulidVal1, ulidVal2)
}

func TestNewULID_MultipleExecutionReturnsUniqueValues(t *testing.T) {
	ulidVal1 := NewULID()
	ulidVal2 := NewULID()

	assert.NotEqual(t, ulidVal1, ulidVal2)
	assert.Equal(t, -1, strings.Compare(ulidVal1, ulidVal2), "ulidval1 is lexicographically smaller than ulidVal2")
}
