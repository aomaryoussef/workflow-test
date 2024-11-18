package config

import (
	"bytes"
	_ "embed"
	"github.com/spf13/viper"
	"strings"
)

//go:embed config.yml
var configContent []byte

type Config struct {
	AppConfig          AppConfigOpts       `mapstructure:"app"`
	LogConfig          LogConfigOpts       `mapstructure:"log"`
	PgConfig           PgConfigOpts        `mapstructure:"pg"`
	JobsConfig         JobsConfigOpts      `mapstructure:"jobs"`
	TelemetryConfig    TelemetryConfigOpts `mapstructure:"telemetry"`
	GlConfig           GlConfigOpts        `mapstructure:"gl"`
	FeatureFlagsConfig FeatureFlagsOpts    `mapstructure:"feature_flags"`
}

type AppConfigOpts struct {
	Name    string               `mapstructure:"name"`
	Version string               `mapstructure:"version"`
	Env     string               `mapstructure:"env"`
	Http    HttpAppConfigOpts    `mapstructure:"http"`
	Rpc     RpcAppConfigOpts     `mapstructure:"rpc"`
	Metrics MetricsAppConfigOpts `mapstructure:"metrics"`
}
type HttpAppConfigOpts struct {
	Port uint16 `mapstructure:"port"`
}
type RpcAppConfigOpts struct {
	Port uint16 `mapstructure:"port"`
	Host string `mapstructure:"host"`
}
type MetricsAppConfigOpts struct {
	Port uint16 `mapstructure:"port"`
}
type LogConfigOpts struct {
	Level       string `mapstructure:"level"`
	Format      string `mapstructure:"format"`
	DebugSql    bool   `mapstructure:"debug_sql"`
	MultiFanOut bool   `mapstructure:"multi_fan_out"`
	AddSource   bool   `mapstructure:"add_source"`
}
type PgConfigOpts struct {
	Host        string `mapstructure:"host"`
	User        string `mapstructure:"user"`
	Password    string `mapstructure:"password"`
	Database    string `mapstructure:"database"`
	Port        uint16 `mapstructure:"port"`
	SslDisable  bool   `mapstructure:"ssl_disable"`
	Schema      string `mapstructure:"schema"`
	MaxOpenConn int    `mapstructure:"max_open_conn"`
	MaxIdleConn int    `mapstructure:"max_idle_conn"`
}
type GlConfigOpts struct {
	Auth   GlAuthConfigOpts   `mapstructure:"auth"`
	Ledger GlLedgerConfigOpts `mapstructure:"ledger"`
}

type GlAuthConfigOpts struct {
	Url          string `mapstructure:"url"`
	ClientId     string `mapstructure:"client_id"`
	ClientSecret string `mapstructure:"client_secret"`
	GrantType    string `mapstructure:"grant_type"`
	Resource     string `mapstructure:"resource"`
	TenantId     string `mapstructure:"tenant_id"`
}

type GlLedgerConfigOpts struct {
	Url string `mapstructure:"url"`
}

type JobsConfigOpts struct {
	Concurrency              int     `mapstructure:"concurrency"`
	HighPriorityAllocation   float64 `mapstructure:"high_priority_concurrency"`
	MediumPriorityAllocation float64 `mapstructure:"medium_priority_concurrency"`
	LowPriorityAllocation    float64 `mapstructure:"low_priority_concurrency"`
}
type TelemetryConfigOpts struct {
	Enabled          bool   `mapstructure:"enabled"`
	OTelGrpcEndpoint string `mapstructure:"otel_grpc_endpoint"`
}

type FeatureFlagsOpts struct {
	DisableGlIntegration                          bool `mapstructure:"disable_gl_integration"`
	AllowLoanCancellationAfterInterestRecognition bool `mapstructure:"allow_loan_cancellation_after_interest_recognition"`
}

// LoadConfig loads the configuration from the environment.
// This function panics if the configuration cannot be loaded.
// On application startup, the configuration should be loaded explicitly.
func LoadConfig() Config {
	c, err := LoadConfigSafely()
	if err != nil {
		panic(err)

	}
	return *c
}

func LoadConfigSafely() (*Config, error) {
	viper.SetConfigType("yaml")
	viper.AutomaticEnv() // automatically loads env vars and overrides
	viper.SetEnvKeyReplacer(
		strings.NewReplacer(".", "_", "-", "_"), // replace the (.) and (-) with (_)
	)

	err := viper.ReadConfig(bytes.NewBuffer(configContent))
	if err != nil {
		return nil, err
	}

	config := &Config{}
	err = viper.Unmarshal(config)
	if err != nil {
		return nil, err
	}

	return config, nil
}
