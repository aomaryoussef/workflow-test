FROM golang:1.22.3-alpine3.19 AS builder

# Define a build argument with a default value
ARG GIT_PAT=""

# Use the build argument as an environment variable
ENV GIT_PERSONAL_ACCESS_TOKEN=$GIT_PAT

USER root
RUN apk update && apk add g++ make openssh-client bash git

WORKDIR /go/src/github/btechlabs/lms-lite

#install certificate here in the future
RUN git config --global url."https://$GIT_PERSONAL_ACCESS_TOKEN@github.com/".insteadOf "https://github.com"
ENV GOPRIVATE="github.com/btechlabs/*"
ENV GOINSECURE="github.com/btechlabs/*"

ADD Makefile .
ADD go.mod .
ADD go.sum .

COPY . .
RUN make vendor
RUN make install
RUN make generate-mocks
RUN make mod
COPY . .
RUN make build

# Main image
FROM golang:1.22.3-alpine3.19
WORKDIR app
RUN mkdir -p /etc/config/lms-lite
COPY --from=builder /go/src/github/btechlabs/lms-lite/out/bin/lms-amd64-linux .
COPY --from=builder /go/src/github/btechlabs/lms-lite/assets /etc/config/lms-lite

ENTRYPOINT ["/bin/sh", "-c", "/go/app/lms-amd64-linux start-worker --all"]
