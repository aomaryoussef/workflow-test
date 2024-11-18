package repository

import (
	"fmt"
	"path"
	"path/filepath"
	"runtime"
	"testing"
)

func TestLoadAllFinancialProductDefinitions_HappyPath(t *testing.T) {
	_, b, _, _ := runtime.Caller(0)
	// basePath is the current directory of the test file
	basePath := filepath.Dir(b)
	// If you change the location of this test file, remember to change the path
	fpMaps, err := loadAllFinancialProductDefinitions(path.Join(basePath, "../../../", "assets"))
	if err != nil {
		t.Fatal(err)
	}

	for _, fpMap := range fpMaps {
		fp, err := constructFinancialProductFromMap(fpMap)
		if err != nil {
			t.Fatal(err)
		}
		fmt.Println(fp)
	}
}
