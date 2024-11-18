package config

import (
	"strings"

	"github.com/spf13/viper"
)

const (
	DefaultAssetsPath = "/etc/config/lms-lite"
)

// LoadEnvConfig loads the environment config with sensible
// defaults. If
func LoadEnvConfig(configDir string) (envConfig *EnvConfig, err error) {
	var configPath string
	if configDir != "" {
		configPath = configDir
	} else {
		configPath = DefaultAssetsPath
	}

	v := viper.New()
	v.SetConfigName("env")
	v.SetConfigType("yaml")     // REQUIRED if the config file does not have the extension in the name
	v.AddConfigPath(configPath) // path to look for the config file in
	v.SetEnvPrefix("LMS")
	v.AutomaticEnv() // automatically loads env vars and overrides
	v.SetEnvKeyReplacer(
		strings.NewReplacer(".", "_", "-", "_"), // replace the (.) and (-) with (_)
	)

	err = v.ReadInConfig()
	if err != nil {
		return nil, err
	}
	envConfig = newEnvConfig(v)

	if envConfig.AssetsPath == "" {
		envConfig.AssetsPath = configPath
	}

	return
}

func newEnvConfig(v *viper.Viper) (envConfig *EnvConfig) {
	envConfig = &EnvConfig{
		AppName:            v.GetString("app_name"),
		AppPort:            v.GetUint16("app_port"),
		AssetsPath:         v.GetString("assets_path"),
		DebugLevel:         v.GetString("debug_level"),
		Environment:        v.GetString("environment"),
		VatPercentage:      v.GetUint("vat_percentage"),
		DoubtfulPercentage: v.GetUint("doubtful_percentage"),
		Pg: PgConfigOpts{
			Host:               v.GetString("pg.host"),
			User:               v.GetString("pg.user"),
			Password:           v.GetString("pg.password"),
			Database:           v.GetString("pg.database"),
			Port:               v.GetUint16("pg.port"),
			MaxOpenConnections: v.GetUint16("pg.max_open_connections"),
			MaxIdleConnections: v.GetUint16("pg.max_idle_connections"),
			SslModeDisable:     v.GetBool("pg.ssl_mode_disable"),
			DialTimeoutSecs:    v.GetUint16("pg.dial_timeout_secs"),
			ReadTimeoutSecs:    v.GetUint16("pg.read_timeout_secs"),
			WriteTimeoutSecs:   v.GetUint16("pg.write_timeout_secs"),
		},
		Orkes: OrkesConfigOpts{
			Url:                 v.GetString("orkes.url"),
			WorkerThreadCount:   v.GetUint16("orkes.worker_thread_count"),
			PollingIntervalSecs: v.GetUint16("orkes.polling_interval_secs"),
			WorkflowToStart:     v.GetString("orkes.workflow_to_start"),
		},
		Iscore: WebClientOpts{
			Protocol: v.GetString("web_client.iscore.protocol"),
			Host:     v.GetString("web_client.iscore.host"),
			Port:     v.GetUint16("web_client.iscore.port"),
		},
		HttpServer: HttpServerOpts{
			ServerAddress:  v.GetString("http_server.server_address"),
			ReadTimeout:    v.GetDuration("http_server.read_timeout"),
			WriteTimeout:   v.GetDuration("http_server.write_timeout"),
			IdleTimeout:    v.GetDuration("http_server.idle_timeout"),
			WaitingTimeout: v.GetDuration("http_server.waiting_timeout"),
		},
		ActiveDirectory: ActiveDirectoryAuthClientOpts{
			Url:          v.GetString("web_client.auth.url"),
			TenantId:     v.GetString("web_client.auth.tenant_id"),
			GrantType:    v.GetString("web_client.auth.grant_type"),
			ClientId:     v.GetString("web_client.auth.client_id"),
			ClientSecret: v.GetString("web_client.auth.client_secret"),
			Resource:     v.GetString("web_client.auth.resource"),
		},
		MicrosoftDynamics: MicrosoftDynamicsClient{
			Url: v.GetString("web_client.dynamics.Url"),
		},
		CreditRisk: CreditRiskClientOpts{
			BaseUrl:   v.GetString("graphql.credit_risk_base_url"),
			AuthToken: v.GetString("graphql.credit_risk_auth_token"),
		},
	}

	return
}
