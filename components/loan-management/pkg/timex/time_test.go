package timex

import (
	"testing"
	"time"
)

func TestUtcTime_ToStdLibTime_ReturnsCorrectTime(t *testing.T) {
	now := time.Now().UTC()
	now = time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second(), 0, time.UTC)
	utcTime := NewUtcTime(now)
	stdLibTime := utcTime.ToStdLibTime()

	if !stdLibTime.Equal(now) {
		t.Errorf("Expected %v, got %v", now, stdLibTime)
	}
}

func TestUtcTime_InLocalTZ_ReturnsTimeInLocalTimeZone(t *testing.T) {
	now := time.Now().UTC()
	now = time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second(), 0, time.UTC)
	utcTime := NewUtcTime(now)
	localTime := utcTime.InLocalTZ()

	expected := now.UTC().In(time.Local)
	if !localTime.Equal(expected) {
		t.Errorf("Expected %v, got %v", expected, localTime)
	}
}

func TestNewUtcTime_RemovesNanoseconds(t *testing.T) {
	now := time.Now()
	utcTime := NewUtcTime(now)

	if utcTime.Second() != now.Second() || utcTime.Nanosecond() != 0 {
		t.Errorf("Expected nanoseconds to be removed, got %v", utcTime.Nanosecond())
	}
}

func TestTimeAsStartOfDay_ReturnsMidnight(t *testing.T) {
	now := time.Now()
	startOfDay := TimeAsStartOfDay(now)

	if startOfDay.Hour() != 0 || startOfDay.Minute() != 0 || startOfDay.Second() != 0 || startOfDay.Nanosecond() != 0 {
		t.Errorf("Expected start of day, got %v", startOfDay)
	}
}

func TestTimeAsEndOfDay_ReturnsLastSecond(t *testing.T) {
	now := time.Now()
	endOfDay := TimeAsEndOfDay(now)

	if endOfDay.Hour() != 23 || endOfDay.Minute() != 59 || endOfDay.Second() != 59 || endOfDay.Nanosecond() != 0 {
		t.Errorf("Expected end of day, got %v", endOfDay)
	}
}
