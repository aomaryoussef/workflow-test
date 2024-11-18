package csv

import (
	"encoding/csv"
	"errors"
	"github.com/btechlabs/go-libs/stringconv"
	"os"
	"strings"
)

var (
	// ErrCannotOpenCsvFile when the CSV file cannot be opened due to any reason
	ErrCannotOpenCsvFile = errors.New("cannot open csv file")
	// ErrCannotReadFile when the CSV is malformed
	ErrCannotReadFile = errors.New("cannot read csv file")
)

func LoadCsvToJsonMap(path string) (records []map[string]string, err error) {
	// read csv file
	csvfile, err := os.Open(path)
	if err != nil {
		return nil, errors.Join(ErrCannotOpenCsvFile, err)
	}
	reader := csv.NewReader(csvfile)
	rawData, err := reader.ReadAll()
	if err != nil {
		return nil, errors.Join(ErrCannotReadFile, err)
	}

	header := []string{} // holds first row (header)
	for lineNum, record := range rawData {
		// for first row, build the header slice
		if lineNum == 0 {
			for i := 0; i < len(record); i++ {
				header = append(header, strings.TrimSpace(record[i]))
			}
		} else {
			// for each cell, map[string]string k=header v=value
			line := make(map[string]string)
			for i := 0; i < len(record); i++ {
				line[header[i]] = strings.TrimSpace(record[i])
			}
			records = append(records, line)
		}
	}
	return
}

// LoadCsvToStrValMap reads a CSV (comma-delimited only) file from path
// and returns an array of records where the values are mapped to either:
// int64, float64, bool, string. Each of the values also contain a flag for
// associated type, allowing for easy type checking.
//
// The errors from native csv golang lib will be wrapped with custom errors.
// See the custom error docs for details.
func LoadCsvToStrValMap(path string) (records []map[string]stringconv.StrVal, err error) {
	records = make([]map[string]stringconv.StrVal, 0)
	// read csv file
	csvfile, err := os.Open(path)
	if err != nil {
		return nil, errors.Join(ErrCannotOpenCsvFile, err)
	}
	reader := csv.NewReader(csvfile)
	rawData, err := reader.ReadAll()
	if err != nil {
		return nil, errors.Join(ErrCannotReadFile, err)
	}

	header := []string{} // holds first row (header)
	for lineNum, record := range rawData {
		// for first row, build the header slice
		if lineNum == 0 {
			for i := 0; i < len(record); i++ {
				header = append(header, strings.TrimSpace(record[i]))
			}
		} else {
			// for each cell, map[string]string k=header v=value
			line := make(map[string]stringconv.StrVal)
			for i := 0; i < len(record); i++ {
				line[header[i]] = stringconv.ParseStringValue(record[i])
			}
			records = append(records, line)
		}
	}
	return
}

// ParseStrValMapToJson parses the array of StrVal map into array of JSONs.
// See LoadCsvToStrValMap for details.
func ParseStrValMapToJson(records []map[string]stringconv.StrVal) (csvMap []map[string]interface{}, err error) {
	csvMap = make([]map[string]interface{}, len(records))
	for i, record := range records {
		line := make(map[string]interface{})
		for key, elem := range record {
			line[key] = elem.Value
		}
		csvMap[i] = line
	}

	return
}
