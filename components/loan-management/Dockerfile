# Step 1: Use an official Golang image to create a build environment.
FROM golang:1.23 AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed.
RUN go mod download

# Copy the source code into the container
COPY . .

# Install Protobuf and OpenAPI tools
RUN apt-get update && apt-get install -y protobuf-compiler && \
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && \
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest && \
    go install github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest

# Generate generation directories
RUN mkdir -p gen/pb \
    && mkdir -p gen/api \
    && mkdir -p gen/dynamics

# Generate Protobuf and OpenAPI code (adjust paths as needed)
RUN protoc --proto_path=./proto --go_out=paths=source_relative:./gen/pb ./proto/**/*.proto
RUN oapi-codegen --config=./scripts/generate/openapi/apigen-config.yaml ./openapi/openapi.yaml
RUN oapi-codegen --config=./scripts/generate/openapi/dynamics-clientgen-config.yaml ./openapi/dynamics-openapi.yaml


# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/lms .

# Step 2: Use a minimal base image to reduce the size of the final image.
FROM alpine:latest

# Add ca-certificates to enable HTTPS support
RUN apk --no-cache add ca-certificates

# Set the Current Working Directory inside the container
WORKDIR /root/

# Copy the Pre-built binary file from the builder stage
COPY --from=builder /app/lms .

# Expose port (if your app serves on a specific port)
EXPOSE 3010 3011 2223

# Command to run the executable
ENTRYPOINT ["./lms"]