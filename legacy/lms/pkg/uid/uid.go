package uid

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/oklog/ulid/v2"
	"math"
	"math/rand"
	"sync"
	"time"
)

// entropyPool creates a pool for entropy using a monotonic
// randomness source. https://github.com/oklog/ulid#usage
// See:
var entropyPool = sync.Pool{
	New: func() any {
		entropy := ulid.Monotonic(rand.New(rand.NewSource(time.Now().UnixNano())), math.MaxUint32)
		return entropy
	},
}

// Generates a new ULID
// Implementation used: https://github.com/oklog/ulid
func NewULID() string {
	e := entropyPool.Get().(*ulid.MonotonicEntropy)
	s := ulid.MustNew(ulid.Timestamp(time.Now()), e).String()
	entropyPool.Put(e)
	return s
}

func NewUUID() string {
	return uuid.NewString()
}

func IsValidUUIDV4(id string) bool {
	_, err := uuid.Parse(id)
	return err == nil
}

// New25CharRandomId Generates a new 25 character random ID
// Implementation used:
// - 13 characters from Unix time in milliseconds
// - 12 characters from the last part of a UUIDv4
// - Total: 25 characters
func New25CharRandomId() string {
	timeNowUnixSeconds := time.Now().UnixMilli()
	uuidv4 := NewUUID()
	uuidLastPart := uuidv4[len(uuidv4)-12:]
	return fmt.Sprintf("%d%s", timeNowUnixSeconds, uuidLastPart)
}
