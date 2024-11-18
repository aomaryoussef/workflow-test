package utils

import (
	"encoding/json"
	"fmt"
	"github.com/mitchellh/mapstructure"
	"reflect"
	"time"
)

// StructToMap converts a struct to a map while
// maintaining the json alias as keys
func StructToMap(obj interface{}) (newMap map[string]interface{}, err error) {
	if obj == nil {
		return nil, fmt.Errorf("can't convert nil value to map")
	}
	data, err := json.Marshal(obj) // Convert to a json string
	
	if err != nil {
		return
	}
	
	err = json.Unmarshal(data, &newMap) // Convert to a map
	return
}

func PrettyPrintJSON(obj interface{}) string {
	if obj == nil {
		return ""
	}
	data, err := json.MarshalIndent(obj, "", "  ") // Convert to a json string
	if err != nil {
		return ""
	}
	return string(data)
}

func MapToBytes(obj map[string]interface{}) ([]byte, error) {
	//var buf bytes.Buffer
	//enc := gob.NewEncoder(&buf)
	//err := enc.Encode(obj)
	//if err != nil {
	//	return nil, err
	//}
	b, err := json.Marshal(obj)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func JsonBytesToMap(b []byte) (map[string]interface{}, error) {
	var obj map[string]interface{}
	err := json.Unmarshal(b, &obj)
	if err != nil {
		return nil, err
	}
	return obj, nil
}

func ToTimeHookFunc() mapstructure.DecodeHookFunc {
	return func(
		f reflect.Type,
		t reflect.Type,
		data interface{}) (interface{}, error) {
		if t != reflect.TypeOf(time.Time{}) {
			return data, nil
		}
		
		switch f.Kind() {
		case reflect.String:
			return time.Parse(time.RFC3339, data.(string))
		case reflect.Float64:
			return time.Unix(0, int64(data.(float64))*int64(time.Millisecond)), nil
		case reflect.Int64:
			return time.Unix(0, data.(int64)*int64(time.Millisecond)), nil
		default:
			return data, nil
		}
	}
}

func Decode(input map[string]interface{}, result interface{}) error {
	decoder, err := mapstructure.NewDecoder(&mapstructure.DecoderConfig{
		Metadata: nil,
		DecodeHook: mapstructure.ComposeDecodeHookFunc(
			ToTimeHookFunc()),
		Result: result,
	})
	if err != nil {
		return err
	}
	
	if err := decoder.Decode(input); err != nil {
		return err
	}
	return err
}

// GenerateDynamicsMerchantID generates a merchant ID for Dynamics
// from the LMS merchant ID
// Dynamics cannot store IDs that are more than 16 characters long
// Therefore, LMS generates an ID which is always deterministic
// by prefixing the merchant ID with "MERCH-" and padding the
// LMS merchant ID with zeros to make it 16 characters long
// LMS Merchant ID is a serial key from DB
func GenerateDynamicsMerchantID(partyAccountId int) string {
	return fmt.Sprintf("MERCH-%010d", partyAccountId)
}
