package utils

import (
	"testing"
	
	"github.com/stretchr/testify/assert"
)

type TestStruct struct {
	Id string `json:"id"`
}

func TestStructToMap(t *testing.T) {
	ts := TestStruct{
		Id: "testid",
	}
	
	m, err := StructToMap(ts)
	
	assert.Nil(t, err, "Struct to map thrown error")
	assert.NotNil(t, m, "Map result was nil")
	assert.Equal(t, "testid", m["id"], "ID not equals in map")
}

func TestGenerateDynamicsMerchantID(t *testing.T) {
	mid := GenerateDynamicsMerchantID(101)
	assert.Equal(t, "MERCH-0000000101", mid, "Merchant ID not generated correctly")
	
	mid = GenerateDynamicsMerchantID(10)
	assert.Equal(t, "MERCH-0000000010", mid, "Merchant ID not generated correctly")
}
