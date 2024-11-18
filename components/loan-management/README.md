# Loan Management System (LMS)

## Overview

The Loan Management Solution is an in-house developed platform designed to streamline 
and automate the management of loan portfolios. This solution offers a comprehensive 
suite of tools for loan processing, servicing, and reporting, aimed at 
enhancing efficiency and accuracy in loan management operations.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Configuration](#configuration)
5. [Running Tests](#running-tests)

## Features

- Loan Processing: Automated loan activation, amortisation generation, and book-keeping.
- Loan Servicing: Payment processing, account management.
- Reporting and Analytics: Customizable reports, dashboards, and data export capabilities.
- Security: Robust user authentication, role-based access control, and data encryption.
- Integration: Seamless integration with third-party systems via RESTful APIs.

## Architecture

The loan management system (or LMS in short) is built using the following architecture principles:

- Event Sourcing
- Command Query Responsibility Segregation (CQRS)
- Background workers
- Single Responsibility Principle (SRP)

We will detail out every aspect in the following sections.

## Getting Started

### Running from Source

#### Prerequisites

- Make sure you have [Protocol Buffer Compiler](https://grpc.io/docs/protoc-installation/) installed
- Make sure you have [Go](https://golang.org/doc/install) installed
- Make sure you have [Docker](https://docs.docker.com/get-docker/) installed
- Make sure you have [Docker Compose](https://docs.docker.com/compose/install/) installed
- Make sure you have [Make](https://www.gnu.org/software/make/) installed

#### Steps

1. Getting the dependencies and infra up
    ```sh
    # Clone the repository
    git clone git@github.com:btechlabs/mylo.git
    cd mylo/components/loan-management
    # Generate code
    make clean generate 
    # Install dependencies
    make install && go mod tidy
    # Option 1: Minimal - Start PG docker container
    make docker-infra-up-minimal
    # Option 2: Full - Start PG docker container + telemetry services
    make docker-infra-up-full
    ```
   
2. Create a non-default schema with the name `_services` in the `mylo` database. We create a
non-default schema to avoid using default schema `public` due to security best practices.
    ```sh
    # Connect to the database
    psql -h localhost -U postgres -d mylo
    # Create a schema
    CREATE SCHEMA _services;
    ```
   
    This is how it must look like on your terminal:
    
    ```sh
    ➜  loan-management git:(main) ✗ psql -h localhost -U postgres -d mylo
    Password for user postgres: 
    psql (14.12 (Homebrew), server 15.3)
    WARNING: psql major version 14, server major version 15.
             Some psql features might not work.
    Type "help" for help.
    
    mylo=# CREATE SCHEMA _services;
    CREATE SCHEMA
    mylo=# 
    ```
   
3. Start the server and workers
    ```sh
    # Option 1 minimal: Start the server with no telemetry being exposed
    LOG_FORMAT=text_minimal;LOG_DEBUG_SQL=true;APP_ENV=local;TELEMETRY_ENABLED=false go run main.go start http
    # Optional 2 full: Start the server with telemetry being exposed
    go run main.go start http
    ```

    ```sh
    # Option 1 minimal: Start the workers with no telemetry being exposed
    LOG_FORMAT=text_minimal;LOG_DEBUG_SQL=true;APP_ENV=local;TELEMETRY_ENABLED=false go run main.go start workers
    # Optional 2 full: Start the workers with telemetry being exposed
    go run main.go start workers
    ```


#### FAQs on Errors

- In case you have this error `fatal: repository 'https://github.com/mitchellh/osext/' not found`, you will need get that package from the cache.
    ```sh
    GOPROXY=https://proxy.golang.org go mod tidy
    ```

## Configuration

The application is configured using environment variables. The following environment variables are available:

| Variable Name                          | Description                                                              | Default Value                                              |
|----------------------------------------|--------------------------------------------------------------------------|------------------------------------------------------------|
| `APP_NAME`                             | The name of the application.                                             | `lms`                                                      |
| `APP_VERSION`                          | The version of the application.                                          | `0.0.1`                                                    |
| `APP_ENV`                              | The environment in which the application is running.                     | `prod`                                                     |
| `APP_HTTP_PORT`                        | The port for the HTTP server.                                            | `3010`                                                     |
| `APP_RPC_PORT`                         | The port for the RPC server (internal use only).                         | `3011`                                                     |
| `APP_RPC_HOST`                         | The host for the RPC server.                                             | `localhost`                                                |
| `APP_METRICS_PORT`                     | The port that listens for `/metrics` endpoint from scrape config         | `2223`                                                     |
| `LOG_LEVEL`                            | The logging level.                                                       | `debug`                                                    |
| `LOG_FORMAT`                           | The format in which logs are printed.                                    | `json`                                                     |
| `LOG_DEBUG_SQL`                        | Whether to log SQL queries or not.                                       | `false`                                                    |
| `LOG_MULTI_FAN_OUT`                    | Whether to enable multi fan-out logging (only available with local dev). | `false`                                                    |
| `LOG_ADD_SOURCE`                       | Whether to add source information to logs.                               | `true`                                                     |
| `PG_HOST`                              | The host of the PostgreSQL database.                                     | `localhost`                                                |
| `PG_PORT`                              | The port of the PostgreSQL database.                                     | `5432`                                                     |
| `PG_USER`                              | The user of the PostgreSQL database.                                     | `postgres`                                                 |
| `PG_PASSWORD`                          | The password of the PostgreSQL database.                                 | `admin`                                                    |
| `PG_DATABASE`                          | The name of the PostgreSQL database.                                     | `mylo`                                                     |
| `PG_SCHEMA`                            | The schema of the PostgreSQL database.                                   | `_services`                                                |
| `PG_SSL_DISABLE`                       | Whether to disable SSL for the PostgreSQL database.                      | `true`                                                     |
| `PG_MAX_OPEN_CONN`                     | The maximum number of open connections to the PostgreSQL database.       | `10`                                                       |
| `PG_MAX_IDLE_CONN`                     | The maximum number of idle connections to the PostgreSQL database.       | `5`                                                        |
| `JOBS_CONCURRENCY`                     | The total concurrency for jobs.                                          | `100`                                                      |
| `JOBS_HIGH_PRIORITY_CONCURRENCY`       | The concurrency for high priority jobs.                                  | `0.5`                                                      |
| `JOBS_MEDIUM_PRIORITY_CONCURRENCY`     | The concurrency for medium priority jobs.                                | `0.3`                                                      |
| `JOBS_LOW_PRIORITY_CONCURRENCY`        | The concurrency for low priority jobs.                                   | `0.2`                                                      |
| `TELEMETRY_ENABLED`                    | Whether telemetry is enabled.                                            | `true`                                                     |
| `TELEMETRY_OTEL_GRPC_ENDPOINT`         | The gRPC endpoint for OpenTelemetry.                                     | `localhost:4317`                                           |
| `TELEMETRY_METRICS_REPORT_INTERVAL`    | The interval for reporting metrics.                                      | `10s`                                                      |
| `TELEMETRY_METRICS_MEM_STATS_INTERVAL` | The interval for reporting memory statistics.                            | `10s`                                                      |
| `GL_AUTH_URL`                          | The URL for GL authentication.                                           | `https://login.windows.net`                                |
| `GL_AUTH_TENANT_ID`                    | The tenant ID for GL authentication.                                     | `58191332-4582-42f1-a685-f77f77def707`                     |
| `GL_AUTH_GRANT_TYPE`                   | The grant type for GL authentication.                                    | `client_credentials`                                       |
| `GL_AUTH_CLIENT_ID`                    | The client ID for GL authentication.                                     | `5d764d3a-a5fe-4153-8d9c-2bc192b87bbf`                     |
| `GL_AUTH_CLIENT_SECRET`                | The client secret for GL authentication.                                 | `Ueg8Q~dtflpSdlIeii7c7cTBRbLE4klwjg1O1aq5`                 |
| `GL_AUTH_RESOURCE`                     | The resource for GL authentication.                                      | `https://btech-test03.sandbox.operations.eu.dynamics.com/` |
| `GL_LEDGER_URL`                        | The URL for the GL ledger.                                               | `https://btech-test03.sandbox.operations.eu.dynamics.com`  |
| `FEATURE_FLAGS_DISABLE_GL_INTEGRATION` | The feature flag to disable all integrations to MS-Dynamics              | `false`                                                    |

### Basic Usage

Provide examples of 

## Running Tests

TBA