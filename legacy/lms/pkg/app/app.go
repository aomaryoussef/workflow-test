package app

import (
	"errors"

	"github.com/btechlabs/lms-lite/config"
	libSql "github.com/btechlabs/lms-lite/pkg/sql"
)

type ApplicationOption func(*Application)

var (
	ErrModuleNotRegistered = errors.New("module is not registered")
)

// Application holds all the objects, services available across all modules.
// Any layer surrounding the use case layer, will utilise application
// to propagate the desired requests.
// Consider the application as a simplified holder of all resources,
// objects and a "manual" dependency injection system.
//
// Uses the opt pattern to construct the application.
type Application struct {
	envConfig  config.EnvConfig
	modules    []Module
	pg         libSql.PgConnectionManager
	// Added this feature for testing only
	// In Production, we should not disable any module
	disabledModules []string
}

func NewApplication(opts ...ApplicationOption) Application {
	a := &Application{
		modules:         make([]Module, 0),
		disabledModules: make([]string, 0),
	}
	
	for _, opt := range opts {
		opt(a)
	}
	
	return *a
}

func WithEnvConfig(envConfig config.EnvConfig) ApplicationOption {
	return func(a *Application) {
		a.envConfig = envConfig
	}
}
func WithModule(module Module) ApplicationOption {
	return func(a *Application) {
		a.modules = append(a.modules, module)
	}
}

func WithPgConnectionManager(pg libSql.PgConnectionManager) ApplicationOption {
	return func(a *Application) {
		a.pg = pg
	}
}

// TODO to be removed
func (a Application) GetConnectionManager() libSql.PgConnectionManager {
	return a.pg
}

func (a Application) GetModule(name string) (Module, error) {
	for _, m := range a.modules {
		if m.GetName() == name && !a.isModuleDisabled(name) {
			return m, nil
		}
	}
	
	return nil, ErrModuleNotRegistered
}

func (a Application) EnvConfig() config.EnvConfig {
	return a.envConfig
}

// DisableModule disables a module
// DO NOT, I repeat, DO NOT use this in production
// This is only for testing purposes
func (a Application) DisableModule(moduleName string) Application {
	found := false
	for _, m := range a.disabledModules {
		if m == moduleName {
			found = true
			break
		}
	}
	
	if !found {
		a.disabledModules = append(a.disabledModules, moduleName)
	}
	
	return a
}

// EnableModule enables a module that was previously disabled
func (a Application) EnableModule(moduleName string) Application {
	for i, m := range a.disabledModules {
		if m == moduleName {
			a.disabledModules = append(a.disabledModules[:i], a.disabledModules[i+1:]...)
			break
		}
	}
	
	return a
}

// isModuleDisabled checks if a module is disabled
func (a Application) isModuleDisabled(name string) bool {
	for _, m := range a.disabledModules {
		if m == name {
			return true
		}
	}
	
	return false
}
