PROJECT=lms
export CURRENT_DIR=$(shell pwd)

GOCMD=go
GOTEST=$(GOCMD) test
GOVET=$(GOCMD) vet
GOGEN=$(GOCMD) generate
BINARY_NAME=lms
VERSION?=0.0.0
DOCKER_REGISTRY?= #if set it should finished by /
EXPORT_RESULT?=false # for CI please set EXPORT_RESULT to true
BINARY_DIR=out/bin

SQITCH_VERSION=v1.4.1

GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

all: help

## Install:
.PHONY: install
install: ## Installs all the required dependencies used by various commands
	$(GOCMD) install github.com/vektra/mockery/v2@v2.43.1
	$(GOCMD) install google.golang.org/protobuf/cmd/protoc-gen-go@v1.34.2
	$(GOCMD) install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@v2.3.0
	$(GOCMD) install github.com/gotesttools/gotestfmt/v2/cmd/gotestfmt@v2.5.0

## Lint:
.PHONY: govet
vet: ## Examines Go source code and reports suspicious constructs
	$(GOVET) ./...

.PHONY: golint
golint:
	@cd tools && go install golang.org/x/lint/golint
	@$(GOBIN)/golint ./...

.PHONY: staticcheck
staticcheck:
	@cd tools && go install honnef.co/go/tools/cmd/staticcheck
	@$(GOBIN)/staticcheck ./...

.PHONY: lint
lint: gofmt golint staticcheck

.PHONY: gofmt
gofmt:
	$(eval FMT_LOG := $(shell mktemp -t gofmt.XXXXX))
	@gofmt -e -s -l $(GO_FILES) > $(FMT_LOG) || true
	@[ ! -s "$(FMT_LOG)" ] || (echo "gofmt failed:" | cat - $(FMT_LOG) && false)

## Build:
build: ## Build your project and put the output binary in out/bin/, see GOOS arch details https://go.dev/doc/install/source#environment
	@echo "Compiling and building for every OS and Platform"
	mkdir -p out/bin
	GO111MODULE=on GOOS=darwin GOARCH=amd64 $(GOCMD) build -mod vendor -o $(BINARY_DIR)/$(BINARY_NAME)-amd64-darwin main.go
	GO111MODULE=on GOOS=windows GOARCH=amd64 $(GOCMD) build -mod vendor -o $(BINARY_DIR)/$(BINARY_NAME)-amd64-win.exe main.go
	GO111MODULE=on GOOS=linux GOARCH=amd64 $(GOCMD) build -mod=readonly -o $(BINARY_DIR)/$(BINARY_NAME)-amd64-linux main.go
	GO111MODULE=on GOOS=linux GOARCH=arm $(GOCMD) build -mod vendor -o $(BINARY_DIR)/$(BINARY_NAME)-arm64-linux main.go
	GO111MODULE=on GOOS=freebsd GOARCH=386 $(GOCMD) build -mod vendor -o $(BINARY_DIR)/$(BINARY_NAME)-386-freebsd main.go

clean: ## Remove build related file
	echo "Cleaning up: binary directory"
	rm -fr $(BINARY_DIR)
	rm -fr ./out
	echo "Cleaning up: test related files"
	rm -f ./junit-report.xml checkstyle-report.xml ./coverage.xml ./profile.cov yamllint-checkstyle.xml
	## The command below deletes all the mocks generated from the package itself
	find . -name "mock_*" -exec rm {} \;
	## This command deletes the protocol buffer files
	echo "Cleaning up: generated files"
	rm -rf ./gen
	mkdir -p ./gen/api ./gen/pb ./gen/dynamics


## Generate:
generate-mocks: ## Generates mocks of all Golang interfaces using Mockery
	mockery

generate: ## Generates the protobuf and openapi files
	protoc --proto_path=./proto --go_out=paths=source_relative:./gen/pb ./proto/**/*.proto \
    && oapi-codegen --config=./scripts/generate/openapi/apigen-config.yaml ./openapi/openapi.yaml \
    && oapi-codegen --config=./scripts/generate/openapi/dynamics-clientgen-config.yaml ./openapi/dynamics-openapi.yaml

govendor: ## Copy of all packages needed to support builds and tests in the vendor directory
	$(GOCMD) mod vendor

.PHONY: gomod
gomod:
	$(GOCMD) mod tidy

## Migrate:
sql-migrate-up: ## Run the SQL migrations
	$(GOCMD) run main.go migrate up

sql-migrate-down: ## Rollback the SQL migrations
	$(GOCMD) run main.go migrate down

## Test:
.PHONY: test
test: ## Run the tests of the project
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/jstemmer/go-junit-report
	$(eval OUTPUT_OPTIONS = | tee /dev/tty | go-junit-report -set-exit-code > junit-report.xml)
endif
	$(GOTEST) -v -race ./... $(OUTPUT_OPTIONS)

.PHONY: testfmt
testfmt: ## Run the tests of the project with human friendly output
	$(GOTEST) -v -race -json ./... | gotestfmt

.PHONY: coverage
coverage: ## Run the tests of the project and export the coverage
	$(GOTEST) -cover -covermode=count -coverprofile=profile.cov ./... -coverpkg "./..."
	$(GOCMD) tool cover -func profile.cov
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/AlekSi/gocov-xml
	GO111MODULE=off go get -u github.com/axw/gocov/gocov
	gocov convert profile.cov | gocov-xml > coverage.xml
endif

## Docker
docker-infra-up-minimal: ## Start minimal docker containers needed for the project
	docker compose --profile minimal -f docker-compose-local.yml up -d

docker-infra-up-full: ## Start all docker containers needed for the project incl. telemetry
	docker compose --profile full -f docker-compose-local.yml up -d

docker-infra-down: ## Stop all docker containers needed for the project
	docker stop $$(docker ps -a -q)
	docker rm $$(docker ps -a -q)

dev-server:
	LOG_FORMAT=text_minimal;LOG_DEBUG_SQL=true;APP_ENV=local;TELEMETRY_ENABLED=false go run main.go start http

dev-workers:
	LOG_FORMAT=text_minimal;LOG_DEBUG_SQL=true;APP_ENV=local;TELEMETRY_ENABLED=false go run main.go start workers

## Help:
help: ## Show this help.
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "    ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)