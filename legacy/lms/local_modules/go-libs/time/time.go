package time

import "time"

const (
	CURRENT_TZ = "Africa/Cairo"
)

func CurrentTimeLocation() (loc *time.Location, err error) {
	loc, err = time.LoadLocation(CURRENT_TZ)
	if err != nil {
		return
	}
	return
}

func StringTimeToUTC(format string, timeStr string) (t time.Time, err error) {
	loc, err := CurrentTimeLocation()
	if err != nil {
		return
	}

	t, err = time.Parse(format, timeStr)
	if err != nil {
		return
	}

	temp := time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), t.Minute(), t.Second(), t.Nanosecond(), loc)
	t = temp.UTC()
	return
}
