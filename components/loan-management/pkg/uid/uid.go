package uid

import (
	"crypto/rand"
	"fmt"
	"github.com/btechlabs/lms/pkg/timex"
	"github.com/google/uuid"
	"github.com/oklog/ulid/v2"
	"sync"
)

// entropyPool creates a pool for entropy using a cryptographically
// secure randomness source
// See: https://github.com/oklog/ulid#usage
var entropyPool = sync.Pool{
	New: func() any {
		entropy := ulid.Monotonic(rand.Reader, 0)
		return entropy
	},
}

// NewULID generates a new ULID
// Implementation used: https://github.com/oklog/ulid
func NewULID() string {
	e := entropyPool.Get().(*ulid.MonotonicEntropy)
	s := ulid.MustNew(ulid.Timestamp(timex.NewUtcTimeNow().ToStdLibTime()), e).String()
	entropyPool.Put(e)
	return s
}

func MustNewUUID() string {
	u, _ := uuid.NewUUID()
	return u.String()
}

// New25CharRandomId Generates a new 25 character random ID
// Implementation used:
// - 13 characters from Unix time in milliseconds
// - 12 characters from the last part of a ULID
// - Total: 25 characters
func New25CharRandomId() string {
	timeNowUnixSeconds := timex.NewUtcTimeNow().UnixMilli()
	uuidv4 := NewULID()
	uuidLastPart := uuidv4[len(uuidv4)-12:]
	return fmt.Sprintf("%d%s", timeNowUnixSeconds, uuidLastPart)
}
