package logging

import (
	"context"
	"fmt"
	
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type ZapLogger struct {
	*zap.Logger
}

func (l *ZapLogger) Debugf(msg string, args ...any) {
	l.Logger.Debug(fmt.Sprintf(msg, args...))
}
func (l *ZapLogger) Infof(msg string, args ...any) {
	l.Logger.Info(fmt.Sprintf(msg, args...))
}
func (l *ZapLogger) Errorf(msg string, args ...any) {
	l.Logger.Error(fmt.Sprintf(msg, args...))
}
func (l *ZapLogger) Fatalf(msg string, args ...any) {
	l.Logger.Fatal(fmt.Sprintf(msg, args...))
}
func (l *ZapLogger) Debug(msg string) {
	l.Logger.Debug(msg)
}
func (l *ZapLogger) Info(msg string) {
	l.Logger.Info(msg)
}
func (l *ZapLogger) Error(msg string) {
	l.Logger.Error(msg)
}
func (l *ZapLogger) Fatal(msg string) {
	l.Logger.Fatal(msg)
}
func (l *ZapLogger) WithFields(fields map[string]string) (logger Logger) {
	if len(fields) == 0 {
		logger = &ZapLogger{
			Logger: l.Logger,
		}
		return
	}
	zapFields := make([]zapcore.Field, 0)
	for k, v := range fields {
		zapFields = append(zapFields, zap.String(k, v))
	}
	
	clonedLog := l.Logger.With(zapFields...)
	logger = &ZapLogger{
		Logger: clonedLog,
	}
	return
}
func (l *ZapLogger) WithContext(ctx context.Context) Logger {
	if ctx == nil {
		return l
	}
	
	logger := l.Logger
	fields := []zap.Field{}
	
	// Extract values from the context and add them as fields.
	for _, key := range contextKeys {
		if val, ok := ctx.Value(key).(string); ok {
			fields = append(fields, zap.String(string(key), val))
		}
	}
	
	return &ZapLogger{
		Logger: logger.With(fields...),
	}
}

func NewZapLogger(logger *zap.Logger) *ZapLogger {
	
	return &ZapLogger{
		Logger: logger,
	}
	
}
