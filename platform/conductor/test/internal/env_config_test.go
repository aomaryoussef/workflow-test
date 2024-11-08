package internal

import (
	"github.com/stretchr/testify/assert"
	"os"
	"path"
	"testing"
)

func TestLoadConfig(t *testing.T) {
	tempDir := t.TempDir()
	envFile, err := os.Create(path.Join(tempDir, "env.yml"))
	if err != nil {
		t.Fatalf("cannot create temp env file: %s", err.Error())
	}
	_, err = envFile.WriteString(`
conductor:
  base_url: "http://localhost:8080"
log:
  level: info
`)
	if err != nil {
		t.Fatalf("cannot write temp env file: %s", err.Error())
	}

	envConfig := LoadConfig(tempDir)
	if err != nil {
		t.Fatalf("cannot read from temp env var: %s", err.Error())
	}

	assert.Equal(t, "http://localhost:8080", envConfig.ConductorConfig.BaseUrl)
	assert.Equal(t, "info", envConfig.LogConfig.Level)
}

func TestLoadConfigWithEnvOverride(t *testing.T) {
	tempDir := t.TempDir()
	envFile, err := os.Create(path.Join(tempDir, "env.yml"))
	if err != nil {
		t.Fatalf("cannot create temp env file: %s", err.Error())
	}
	_, err = envFile.WriteString(`
conductor:
  base_url: "http://localhost:8080"
log:
  level: info
`)
	if err != nil {
		t.Fatalf("cannot write temp env file: %s", err.Error())
	}

	// Override Log Level
	err = os.Setenv("LOG_LEVEL", "warn")
	if err != nil {
		t.Fatalf("cannot set env var LOG_LEVEL: %s", err.Error())
	}

	envConfig := LoadConfig(tempDir)
	if err != nil {
		t.Fatalf("cannot read from temp env var: %s", err.Error())
	}

	assert.Equal(t, "http://localhost:8080", envConfig.ConductorConfig.BaseUrl)
	assert.NotEqual(t, "info", envConfig.LogConfig.Level)
	assert.Equal(t, "warn", envConfig.LogConfig.Level)
}
