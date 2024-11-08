package internal

import (
	"go.elastic.co/ecszap"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"os"
	"strings"
)

func InitLogger(level, environment string) *zap.Logger {
	logLevel := parseLevel(level)
	encoderConfig := ecszap.EncoderConfig{
		EncodeName:     zap.NewProductionEncoderConfig().EncodeName,
		EncodeLevel:    zapcore.CapitalLevelEncoder,
		EncodeDuration: zapcore.MillisDurationEncoder,
		EncodeCaller:   ecszap.FullCallerEncoder,
	}
	core := ecszap.NewCore(encoderConfig, os.Stdout, logLevel)
	l := zap.New(core, zap.AddCaller())
	l = l.With(zap.String("app", "workflow-migrator")).With(zap.String("env", environment))

	return l
}

func parseLevel(level string) zapcore.Level {
	switch strings.ToLower(level) {
	case "debug":
		return zap.DebugLevel
	case "info":
		return zap.InfoLevel
	case "warn":
		return zap.WarnLevel
	case "error":
		return zap.ErrorLevel
	}
	return zap.InfoLevel
}
