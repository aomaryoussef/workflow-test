package csv

import (
	"github.com/btechlabs/go-libs/stringconv"
	"github.com/stretchr/testify/assert"
	"os"
	"path"
	"testing"
)

func writeCsv(t *testing.T, filename string, data string) (absoluteFilePath string, err error) {
	absoluteFilePath = path.Join(t.TempDir(), filename)

	file, err := os.Create(absoluteFilePath)
	if err != nil {
		return
	}
	_, err = file.WriteString(data)
	if err != nil {
		return
	}
	return
}

func TestLoadCsvToMap(t *testing.T) {
	absolutepath, err := writeCsv(t, "test.csv", "a,b,c\n12,true,happy\n24,false,sad")
	if err != nil {
		t.Error(err)
	}

	records, err := LoadCsvToStrValMap(absolutepath)
	if err != nil {
		t.Error(err)
	}

	assert.NotNil(t, records)
	assert.Equal(t, 2, len(records))

	assert.Equal(t, int64(12), records[0]["a"].Value)
	assert.Equal(t, stringconv.ValTypeInteger64, records[0]["a"].Type)
	assert.Equal(t, true, records[0]["b"].Value)
	assert.Equal(t, stringconv.ValTypeBool, records[0]["b"].Type)
	assert.Equal(t, "happy", records[0]["c"].Value)
	assert.Equal(t, stringconv.ValTypeString, records[0]["c"].Type)
}

func TestLoadCsvToMap_WhenNoValueRowsExist(t *testing.T) {
	absolutepath, err := writeCsv(t, "test.csv", "a,b,c")
	if err != nil {
		t.Error(err)
	}

	records, err := LoadCsvToStrValMap(absolutepath)
	if err != nil {
		t.Error(err)
	}

	assert.NotNil(t, records)
	assert.Equal(t, 0, len(records))
}

func TestLoadCsvToMap_WhenInvalidCsvIsGiven(t *testing.T) {
	absolutepath, err := writeCsv(t, "test.csv", "a,b,c\n12,sad")
	if err != nil {
		t.Error(err)
	}

	_, err = LoadCsvToStrValMap(absolutepath)
	assert.NotNil(t, err)
}

func TestCsvRecordsToJsonMap(t *testing.T) {
	records := []map[string]stringconv.StrVal{
		{
			"a": stringconv.StrVal{
				Type:  stringconv.ValTypeString,
				Value: "hi testing",
			},
			"b": stringconv.StrVal{
				Type:  stringconv.ValTypeInteger64,
				Value: int64(12),
			},
		},
		{
			"a": stringconv.StrVal{
				Type:  stringconv.ValTypeString,
				Value: "hi golang",
			},
			"b": stringconv.StrVal{
				Type:  stringconv.ValTypeInteger64,
				Value: int64(24),
			},
		},
	}

	csvMap, err := ParseStrValMapToJson(records)
	assert.Nil(t, err)
	assert.NotNil(t, csvMap)

	assert.Equal(t, 2, len(csvMap))

	assert.Equal(t, "hi testing", csvMap[0]["a"])
	assert.Equal(t, int64(12), csvMap[0]["b"])
	assert.Equal(t, "hi golang", csvMap[1]["a"])
	assert.Equal(t, int64(24), csvMap[1]["b"])
}
