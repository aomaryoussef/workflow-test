package ulid

import (
	"math/rand"
	"time"

	"github.com/oklog/ulid/v2"
)

// Generates a new ULID
// Implementation used: https://github.com/oklog/ulid
func NewULID() string {
	var genULID ulid.ULID
	var err error

	entropy := rand.New(rand.NewSource(time.Now().UnixNano()))
	ms := ulid.Timestamp(time.Now())
	genULID, err = ulid.New(ms, entropy)
	if err != nil {
		genULID = ulid.Make()
	}

	return genULID.String()
}
