package yml

import (
	"os"

	"gopkg.in/yaml.v3"
)

func ReadYaml(filePath string, res interface{}) (err error) {
	b, err := os.ReadFile(filePath)
	if err != nil {
		return
	}
	err = yaml.Unmarshal(b, res)
	if err != nil {
		return
	}

	return
}
