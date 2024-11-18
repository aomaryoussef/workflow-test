package config

import "time"

// EnvConfig represents environment configuration for the
// application that is injected via default properties and
// over-ridden via environment vars
type EnvConfig struct {
	// Application
	AppPort            uint16
	AppName            string
	AssetsPath         string
	Environment        string
	DebugLevel         string
	VatPercentage      uint
	DoubtfulPercentage uint
	Pg                 PgConfigOpts
	Orkes              OrkesConfigOpts
	Iscore             WebClientOpts
	HttpServer         HttpServerOpts
	ActiveDirectory    ActiveDirectoryAuthClientOpts
	MicrosoftDynamics  MicrosoftDynamicsClient
	CreditRisk         CreditRiskClientOpts
}
type PgConfigOpts struct {
	Host               string
	User               string
	Password           string
	Database           string
	Port               uint16
	MaxOpenConnections uint16
	MaxIdleConnections uint16
	SslModeDisable     bool
	DialTimeoutSecs    uint16
	ReadTimeoutSecs    uint16
	WriteTimeoutSecs   uint16
}
type OrkesConfigOpts struct {
	Url                 string
	WorkerThreadCount   uint16
	PollingIntervalSecs uint16
	WorkflowToStart     string
}

type WebClientOpts struct {
	Protocol string
	Host     string
	Port     uint16
}

type HttpServerOpts struct {
	ServerAddress  string
	ReadTimeout    time.Duration
	WriteTimeout   time.Duration
	IdleTimeout    time.Duration
	WaitingTimeout time.Duration
}

type ActiveDirectoryAuthClientOpts struct {
	Url          string
	TenantId     string
	GrantType    string
	ClientId     string
	ClientSecret string
	Resource     string
}

type CreditRiskClientOpts struct {
	BaseUrl   string
	AuthToken string
}

type MicrosoftDynamicsClient struct {
	Url string
}
