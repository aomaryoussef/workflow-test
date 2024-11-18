package repository

import (
	"errors"
	"fmt"
	"log"
	"os"
	"path"
	"strings"
	
	"github.com/btechlabs/lms-lite/pkg/yml"
)

func LoadChartOfAccountsMap(assetsPath string) (coa *ChartOfAccountsMap, err error) {
	coaDir := path.Join(assetsPath, "coa")
	log.Printf("Loading Chart of Accounts map from %s", coaDir)
	files, err := os.ReadDir(coaDir)
	if err != nil {
		err = errors.Join(fmt.Errorf("cannot read coa dir: %s\n", coaDir), err)
		return nil, err
	}
	
	for _, file := range files {
		if file.IsDir() || !_validFileExtension(file.Name()) {
			continue
		}
		filePath := path.Join(coaDir, file.Name())
		coa = &ChartOfAccountsMap{}
		if err = yml.ReadYaml(filePath, coa); err != nil {
			err = errors.Join(fmt.Errorf("cannot read coa file: %s\n", filePath), err)
			return nil, err
		}
		
		return coa, nil
	}
	
	return nil, fmt.Errorf("No Chart of Accounts map file was successfully processed!")
}

func _validFileExtension(file string) bool {
	return strings.HasSuffix(file, "yml") || strings.HasSuffix(file, "yaml")
}
