package internal

import (
	"fmt"
	"github.com/spf13/viper"
	"strings"
)

const (
	DefaultConfigDirPath     = "/etc/config/workflow-migrator"
	ProcessDefinitionDirName = "process_definition"
)

type EnvConfig struct {
	ConductorConfig conductorConfig `mapstructure:"conductor"`
	LogConfig       logConfig       `mapstructure:"log"`
	AppConfig       appConfig       `mapstructure:"app"`
}

type appConfig struct {
	Env string `mapstructure:"env"`
}
type conductorConfig struct {
	BaseUrl string `mapstructure:"base_url"`
}
type logConfig struct {
	Level string `mapstructure:"level"`
}

func LoadConfig(configDir string) EnvConfig {
	envConfig := EnvConfig{}

	v := viper.New()
	v.SetConfigName("env")
	v.SetConfigType("yml")
	v.AddConfigPath(configDir) // path to look for the config file in
	v.AutomaticEnv()           // automatically loads env vars and overrides
	v.SetEnvKeyReplacer(
		strings.NewReplacer(".", "_", "-", "_"), // replace the (.) and (-) with (_)
	)
	err := v.ReadInConfig()
	if err != nil { // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %w", err))
	}

	err = v.Unmarshal(&envConfig)
	if err != nil { // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
	return envConfig
}
