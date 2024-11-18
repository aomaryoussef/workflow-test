package timex

import (
	"encoding/json"
	"errors"
	"strings"
	"time"
)

type MyloTime struct {
	*time.Time
}

func NewTime() *MyloTime {
	nowUtc := time.Now().UTC()
	return &MyloTime{&nowUtc}
}

func ParseTime(timeStr string) (*MyloTime, error) {
	if strings.TrimSpace(timeStr) == "" {
		return NewTime(), nil
	}
	if !strings.HasSuffix(timeStr, "Z") {
		return nil, errors.New("parsed time is not in UTC format, please RFC3339 UTC format only")
	}
	
	t, err := time.Parse(time.RFC3339, timeStr)
	if err != nil {
		return nil, err
	}
	return &MyloTime{&t}, nil
}

func (t *MyloTime) MarshalJSON() ([]byte, error) {
	return json.Marshal(t.Format(time.RFC3339))
}

func (t *MyloTime) UnmarshalJSON(b []byte) error {
	var s string
	err := json.Unmarshal(b, &s)
	if err != nil {
		return err
	}
	
	myloTime, err := ParseTime(s)
	if err != nil {
		return err
	}
	
	t.Time = myloTime.Time
	return nil
}
