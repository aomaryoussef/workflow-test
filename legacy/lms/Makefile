PROJECT=github.com/btechlabs/lms-lite
export CURRENT_DIR=$(shell pwd)

GOCMD=go
GOTEST=$(GOCMD) test
GOVET=$(GOCMD) vet
BINARY_NAME=lms
VERSION?=0.0.0
DOCKER_REGISTRY?= #if set it should finished by /
EXPORT_RESULT?=false # for CI please set EXPORT_RESULT to true
BINARY_DIR=out/bin

GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

.PHONY: all install build clean vendor test coverage lint lint-go lint-yaml docker-build docker-release mod help swag

all: help

clean-proto:
	rm -rf internal/clients/grpc/pb/

get-deps:
	$(GOCMD) get google.golang.org/protobuf/cmd/protoc-gen-go\
		google.golang.org/grpc/cmd/protoc-gen-go-grpc

gen-proto: clean-proto get-deps
	mkdir -p internal/clients/grpc/pb
	protoc --proto_path=internal/clients/grpc/proto \
               --go_out=paths=source_relative:internal/clients/grpc/pb \
               --go-grpc_out=paths=source_relative:internal/clients/grpc/pb \
               internal/clients/grpc/proto/*.proto

install: ## Installs all the required dependencies used by various commands
	$(GOCMD) install github.com/vektra/mockery/v2@v2.43.1

## Build:
build: ## Build your project and put the output binary in out/bin/, see GOOS arch details https://go.dev/doc/install/source#environment
	@echo "Compiling and building for every OS and Platform"
	mkdir -p out/bin
	# GO111MODULE=on GOOS=darwin GOARCH=amd64 $(GOCMD) build -mod vendor -o $(BINARY_DIR)/$(BINARY_NAME)-amd64-darwin main.go
	# GO111MODULE=on GOOS=windows GOARCH=amd64 $(GOCMD) build -mod vendor -o $(BINARY_DIR)/$(BINARY_NAME)-amd64-win.exe main.go
	GO111MODULE=on GOOS=linux GOARCH=amd64 $(GOCMD) build -mod=readonly -o $(BINARY_DIR)/$(BINARY_NAME)-amd64-linux main.go
	# GO111MODULE=on GOOS=linux GOARCH=arm $(GOCMD) build -mod vendor -o $(BINARY_DIR)/$(BINARY_NAME)-arm64-linux main.go
	# GO111MODULE=on GOOS=freebsd GOARCH=386 $(GOCMD) build -mod vendor -o $(BINARY_DIR)/$(BINARY_NAME)-386-freebsd main.go

clean: ## Remove build related file
	rm -fr $(BINARY_DIR)
	rm -fr ./out
	rm -f ./junit-report.xml checkstyle-report.xml ./coverage.xml ./profile.cov yamllint-checkstyle.xml
	## The command below deletes all the mocks generated from the package itself
	find . -name "mock_*" -exec rm {} \;

reset-stack:
	docker-compose -f docker/docker-compose.yml down -v
	docker-compose -f docker/docker-compose.yml up -d
	$(MAKE) migrate

generate-mocks: ## Generates mocks of all Golang interfaces using Mockery
	mockery

vendor: ## Copy of all packages needed to support builds and tests in the vendor directory
	$(GOCMD) mod vendor

mod:
	$(GOCMD) mod tidy

db-migrate: ## Migrate the database to the latest version. Ensure that the SQITCH_TARGET environment variable is set.
	@echo "Migrating database changes .."
	# If the environment variable SQITCH_TARGET is not set, then throw error
	@test -n "$(SQITCH_TARGET)" || (echo "SQITCH_TARGET is not set in env. Use:\nexport SQITCH_TARGET=db:pg://<user>:<password>@<host>:<port>/<db>" && exit 1)
	docker run --rm --network host \
      --mount "type=bind,src=$(CURRENT_DIR)/migrations/db,dst=/repo" \
      -e SQITCH_TARGET=$(SQITCH_TARGET) \
      sqitch/sqitch deploy

swag:
	@echo "Generating swagger files .."
	swag init --dir .,./internal/http/rest/ --markdownFiles ./README.md --parseDependency -o ./swagger

## Test:
test: ## Run the tests of the project
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/jstemmer/go-junit-report
	$(eval OUTPUT_OPTIONS = | tee /dev/tty | go-junit-report -set-exit-code > junit-report.xml)
endif
	ROOT_DIR="$(CURRENT_DIR)" $(GOTEST) -v -race ./... $(OUTPUT_OPTIONS)

coverage: ## Run the tests of the project and export the coverage
	ROOT_DIR="$(CURRENT_DIR)" $(GOTEST) -cover -covermode=count -coverprofile=profile.cov ./... -coverpkg "./..."
	$(GOCMD) tool cover -func profile.cov
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/AlekSi/gocov-xml
	GO111MODULE=off go get -u github.com/axw/gocov/gocov
	gocov convert profile.cov | gocov-xml > coverage.xml
endif

coverage-modules: ## Run the tests of the project and export the coverage
	ROOT_DIR="$(CURRENT_DIR)" $(GOTEST) -cover -covermode=count -coverprofile=profile.cov ./... -coverpkg "./modules"
	$(GOCMD) tool cover -func profile.cov
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/AlekSi/gocov-xml
	GO111MODULE=off go get -u github.com/axw/gocov/gocov
	gocov convert profile.cov | gocov-xml > coverage.xml
endif

coverage-internal: ## Run the tests of the project and export the coverage
	ROOT_DIR="$(CURRENT_DIR)" $(GOTEST) -cover -covermode=count -coverprofile=profile.cov ./... -coverpkg "./internal/..."
	$(GOCMD) tool cover -func profile.cov
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/AlekSi/gocov-xml
	GO111MODULE=off go get -u github.com/axw/gocov/gocov
	gocov convert profile.cov | gocov-xml > coverage.xml
endif

coverage-pkg: ## Run the tests of the project and export the coverage
	ROOT_DIR="$(CURRENT_DIR)" $(GOTEST) -cover -covermode=count -coverprofile=profile.cov ./... -coverpkg "./pkg/..."
	$(GOCMD) tool cover -func profile.cov
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/AlekSi/gocov-xml
	GO111MODULE=off go get -u github.com/axw/gocov/gocov
	gocov convert profile.cov | gocov-xml > coverage.xml
endif

# https://github.com/gotestyourself/gotestsum
test-sum:
	ROOT_DIR="$(CURRENT_DIR)" gotestsum --format testname -- -coverprofile=cover.out ./... -coverpkg "./..."

## Lint:
lint: lint-go lint-yaml ## Run all available linters

lint-go: ## Use golintci-lint on your project
	docker run \
		-t \
		--rm \
		-v $(CURRENT_DIR):/app \
		-w /app golangci/golangci-lint:v1.54.2 \
		golangci-lint run -v --timeout 5m

lint-yaml: ## Use yamllint on the yaml file of your projects
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/thomaspoignant/yamllint-checkstyle
	$(eval OUTPUT_OPTIONS = | tee /dev/tty | yamllint-checkstyle > yamllint-checkstyle.xml)
endif
	docker run --rm -it -v "$(shell pwd)":/data cytopia/yamllint -f parsable $(shell git ls-files '*.yml' '*.yaml') $(OUTPUT_OPTIONS)

## Docker:
docker-build: ## Use the dockerfile to build the container
	docker build --rm --tag $(BINARY_NAME) .

docker-release: ## Release the container with tag latest and version
	docker tag $(BINARY_NAME) $(DOCKER_REGISTRY)$(BINARY_NAME):$(VERSION)
	# Push the docker images
	docker push $(DOCKER_REGISTRY)$(BINARY_NAME):$(VERSION)

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