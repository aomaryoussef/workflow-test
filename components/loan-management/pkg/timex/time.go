package timex

import (
	"time"
	_ "time/tzdata" // Required for time.LoadLocation("Africa/Cairo") - DO NOT REMOVE
)



type UtcTime struct {
	*time.Time
}

func (t UtcTime) ToStdLibTime() time.Time {
	return *t.Time
}

func (t UtcTime) InLocalTZ() time.Time {
	return t.Local()
}

func (t UtcTime) AsPtr() *UtcTime {
	return &t
}

func (t UtcTime) InLocalTZStartOfDay() UtcTime {
	inLocalTime := t.InLocalTZ()
	startOfDayInLocal := TimeAsStartOfDay(inLocalTime)
	return NewUtcTime(startOfDayInLocal)
}

func NewUtcTime(t time.Time) UtcTime {
	tWithRemovedNanoseconds := time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), t.Minute(), t.Second(), 0, t.Location())
	utcTime := tWithRemovedNanoseconds.UTC()
	return UtcTime{&utcTime}
}

func NewUtcTimeNow() UtcTime {
	t := time.Now()
	return NewUtcTime(t)
}

func TimeAsStartOfDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 1, 0, t.Location())
}
func TimeAsEndOfDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 23, 59, 59, 0, t.Location())
}
