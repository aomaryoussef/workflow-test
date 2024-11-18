package timex

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestMyloTime(t *testing.T) {
	
	testTime := time.Date(2024, 1, 21, 9, 02, 0, 1234, time.UTC)
	myloTime, err := ParseTime(testTime.Format(time.RFC3339))
	if err != nil {
		t.Error(err.Error())
	}
	
	t.Run("when json marshal is called upon with MyloTime as value reference, rfc3339 formatted string is expected", func(t *testing.T) {
		type example struct {
			Time MyloTime `json:"some_time"`
		}
		
		b, e := json.Marshal(example{Time: *myloTime})
		if e != nil {
			t.Error(e.Error())
		}
		assert.Equal(t, "{\"some_time\":\"2024-01-21T09:02:00Z\"}", string(b))
	})
	t.Run("when json marshal is called upon with MyloTime as pointer reference, rfc3339 formatted string is expected", func(t *testing.T) {
		type example struct {
			Time *MyloTime `json:"some_time"`
		}
		
		b, e := json.Marshal(example{Time: myloTime})
		if e != nil {
			t.Error(e.Error())
		}
		assert.Equal(t, "{\"some_time\":\"2024-01-21T09:02:00Z\"}", string(b))
	})
	t.Run("when json marshal is called upon with MyloTime as pointer reference and nil value, null string is expected", func(t *testing.T) {
		type example struct {
			Time *MyloTime `json:"some_time"`
		}
		
		b, e := json.Marshal(example{Time: nil})
		if e != nil {
			t.Error(e.Error())
		}
		assert.Equal(t, "{\"some_time\":null}", string(b))
	})
	t.Run("when json marshal is called upon with no mylo time value, null string is expected", func(t *testing.T) {
		type example struct {
			Time *MyloTime `json:"some_time"`
		}
		
		b, e := json.Marshal(example{})
		if e != nil {
			t.Error(e.Error())
		}
		assert.Equal(t, "{\"some_time\":null}", string(b))
	})
	
	t.Run("when json unmarshal is called upon with MyloTime as value reference, rfc3339 formatted string is expected", func(t *testing.T) {
		type example struct {
			Time MyloTime `json:"some_time"`
		}
		
		stdTime := time.Date(2024, 1, 21, 9, 02, 0, 0, time.UTC)
		expectedTime := MyloTime{&stdTime}
		ex := &example{}
		strVal := "{\"some_time\":\"2024-01-21T09:02:00Z\"}"
		e := json.Unmarshal([]byte(strVal), ex)
		if e != nil {
			t.Error(e.Error())
		}
		assert.Equal(t, expectedTime, ex.Time)
	})
	
	t.Run("when json unmarshal is called upon with MyloTime as pointer reference, rfc3339 formatted string is expected", func(t *testing.T) {
		type example struct {
			Time *MyloTime `json:"some_time"`
		}
		
		stdTime := time.Date(2024, 1, 21, 9, 02, 0, 0, time.UTC)
		expectedTime := &MyloTime{&stdTime}
		ex := &example{}
		strVal := "{\"some_time\":\"2024-01-21T09:02:00Z\"}"
		e := json.Unmarshal([]byte(strVal), ex)
		if e != nil {
			t.Error(e.Error())
		}
		assert.Equal(t, expectedTime, ex.Time)
	})
	
	t.Run("when json unmarshal is called upon with null value", func(t *testing.T) {
		type example struct {
			SomeOtherVal string    `json:"some_other_val"`
			Time         *MyloTime `json:"some_time"`
		}
		
		ex := &example{}
		strVal := "{\"some_other_val\":\"hello, mylo\"}"
		e := json.Unmarshal([]byte(strVal), ex)
		if e != nil {
			t.Error(e.Error())
		}
		assert.Nil(t, ex.Time)
		assert.Equal(t, ex.SomeOtherVal, "hello, mylo")
	})
}
