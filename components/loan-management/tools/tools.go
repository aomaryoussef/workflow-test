//go:build tools

package tools

// This file is used to import the tools required for the project.
// This is done to avoid importing the tools in the main.go file.
import (
	_ "github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen"
)
