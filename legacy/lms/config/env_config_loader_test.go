package config

import (
	"github.com/stretchr/testify/assert"
	"os"
	"path"
	"testing"
)

func TestNewConfigOpts(t *testing.T) {
	tempDir := t.TempDir()
	envFile, err := os.Create(path.Join(tempDir, "env.yaml"))
	if err != nil {
		t.Fatalf("cannot create temp env file: %s", err.Error())
	}
	_, err = envFile.WriteString(`
app_port: 3000
app_name: lms-lite
assets_path: "/etc/config/lms-lite"
pg:
  url: "postgres://postgres:admin@localhost:5432/lms-lite"
  max_open_connections: 5
  max_idle_connections: 5
  ssl_mode_disable: false
  dial_timeout_secs: 5
  read_timeout_secs: 5
  write_timeout_secs: 5
orkes:
  url: "http://localhost:8080"
  worker_thread_count: 1
  polling_interval_secs: 10
  workflow_to_start: all
graphql:
  credit_risk_base_url: https://mc2-stg.btech.com/graphql
  credit_risk_auth_token: 123
`)
	if err != nil {
		t.Fatalf("cannot write temp env file: %s", err.Error())
	}

	configOpts, err := LoadEnvConfig(tempDir)
	if err != nil {
		t.Fatalf("cannot read from temp env var: %s", err.Error())
	}

	assert.Equal(t, uint16(3000), configOpts.AppPort)
	assert.Equal(t, uint16(5), configOpts.Pg.MaxOpenConnections)
}

func TestNewConfigOpts_OverrideWithEnv(t *testing.T) {
	tempDir := t.TempDir()
	envFile, err := os.Create(path.Join(tempDir, "env.yaml"))
	if err != nil {
		t.Fatalf("cannot create temp env file: %s", err.Error())
	}
	_, err = envFile.WriteString(`
app_port: 3000
app_name: lms-lite
assets_path: "/Users/sid/go/src/github.com/btechlabs/lms-lite/assets"
pg:
  Url: "postgres://postgres:admin@localhost:5432/lms-lite"
  max_open_connections: 5
  max_idle_connections: 5
  ssl_mode_disable: false
  dial_timeout_secs: 5
  read_timeout_secs: 5
  write_timeout_secs: 5
orkes:
  url: "http://localhost:8080/api"
  worker_thread_count: 1
  polling_interval_secs: 10
  workflow_to_start: all
web_client:
iscore:
  protocol: https
  host: minicashbackend.btech.com
  port: 553
conductor:
  baseurl: "http://localhost:8080/"
http_server:
  server_address: 0.0.0.0:9090
  read_timeout: 30s
  write_timeout: 30s
  idle_timeout: 30s
  waiting_timeout: 30s
graphql:
  credit_risk_base_url: https://host
  credit_risk_auth_token: 345
`)
	if err != nil {
		t.Fatalf("cannot write temp env file: %s", err.Error())
	}

	// Override PgUrl
	err = os.Setenv("LMS_PG_SSL_MODE_DISABLE", "true")
	if err != nil {
		t.Fatalf("cannot set env var LMS_PG_SSL_MODE_DISABLE: %s", err.Error())
	}
	err = os.Setenv("LMS_WEB_CLIENT_CONDUCTOR_BASEURL", "http://localhost:7070/")
	if err != nil {
		t.Fatalf("cannot set env var WEBCLIENT_CONDUCTOR_BASEURL: %s", err.Error())
	}

	err = os.Setenv("LMS_HTTP_SERVER_ADDRESS", "0.0.0.0:6060")
	if err != nil {
		t.Fatalf("cannot set env var server_address: %s", err.Error())
	}

	err = os.Setenv("LMS_HTTP_SERVER_READ_TIMEOUT", "5s")
	if err != nil {
		t.Fatalf("cannot set env var server_read_timeout: %s", err.Error())
	}

	err = os.Setenv("LMS_GRAPHQL_CREDIT_RISK_BASE_URL", "http://localhost/")
	if err != nil {
		t.Fatalf("cannot set env var credit_risk_base_url: %v", err)
	}

	err = os.Setenv("LMS_GRAPHQL_CREDIT_RISK_AUTH_TOKEN", "123")
	if err != nil {
		t.Fatalf("cannot set env var credit_risk_auth_token: %v", err)
	}

	configOpts, err := LoadEnvConfig(tempDir)
	if err != nil {
		t.Fatalf("cannot read from temp env var: %s", err.Error())
	}

	assert.Equal(t, uint16(3000), configOpts.AppPort)
	assert.Equal(t, true, configOpts.Pg.SslModeDisable)
	assert.Equal(t, uint16(5), configOpts.Pg.MaxOpenConnections)
	assert.Equal(t, "http://localhost:8080/api", configOpts.Orkes.Url)
	assert.Equal(t, "0.0.0.0:9090", configOpts.HttpServer.ServerAddress)
	assert.Equal(t, "123", configOpts.CreditRisk.AuthToken)
	assert.Equal(t, "http://localhost/", configOpts.CreditRisk.BaseUrl)
	assert.Equal(t, uint16(5), configOpts.Pg.DialTimeoutSecs)
}
