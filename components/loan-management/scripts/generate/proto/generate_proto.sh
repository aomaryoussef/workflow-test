#!/bin/bash
# Script to recursively generate Go code from .proto files

# shellcheck disable=SC2046
protoc --proto_path=../../../proto --go_out=paths=source_relative:../../../gen/pb ../../../proto/**/*.proto