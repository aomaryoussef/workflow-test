# syntax=docker/dockerfile:1

# Build the application from source
FROM golang:1.21-alpine AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY main.go ./
COPY cmd/ ./cmd/
COPY internal/ ./internal/

RUN GO111MODULE=on GOOS=linux GOARCH=amd64 go build -o workflow-migrator main.go

# Deploy the application binary into a lean image
FROM golang:1.21-alpine AS build-release-stage

WORKDIR /usr/bin
COPY --from=build-stage /app/workflow-migrator ./workflow-migrator
COPY config/ /etc/config/workflow-migrator

ENTRYPOINT ["workflow-migrator"]
CMD ["--help"]