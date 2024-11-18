package riverx

import (
	"fmt"
	"github.com/riverqueue/river"
	"time"
)

func UniqueOptsByArgs() *river.InsertOpts {
	return &river.InsertOpts{UniqueOpts: river.UniqueOpts{ByArgs: true}}
}

type SnoozeJobError struct {
	SnoozeDelay time.Duration
}

func (e SnoozeJobError) Error() string {
	return fmt.Sprintf("snoozing job for: %s", e.SnoozeDelay.String())
}

var ErrSnoozeJob100Hours = SnoozeJobError{SnoozeDelay: 100 * time.Hour}
