package openapi

//go:generate go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen --config=apigen-config.yaml ../../../openapi/openapi.yaml
//go:generate go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen --config=dynamics-clientgen-config.yaml ../../../openapi/dynamics-openapi.yaml
//go:generate echo "openapi: codegen complete"
