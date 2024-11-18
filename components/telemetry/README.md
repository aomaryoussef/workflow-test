# Telemetry

## Overview

This telemetry solution provides a comprehensive monitoring and observability framework for your applications. It leverages the power of OpenTelemetry for generating telemetry data from your services, Prometheus for metrics collection, Loki for centralized logging, and Grafana for visualizing the data.

The solution is designed to be easy to integrate with any application. It uses Promtail for shipping local logs to Loki, making it easy to monitor application logs. The telemetry data from your services can be viewed and analyzed in Grafana, providing insights into the performance and health of your applications.

Whether you're troubleshooting performance issues or trying to understand user behavior, this telemetry solution provides the tools you need to gather and analyze data effectively.

## Monitoring Logs

In order to monitor your application logs, make sure to add the following labels to the docker container on your docker-compose running your application:

- logging: 'promtail'
- logging_jobname: 'SERVICE_NAME'

Example for an oathkeeper container setup in docker compose:

```docker
oathkeeper:
    container_name: oathkeeper
    image: oryd/oathkeeper:${ORY_OATHKEEPER_VERSION}
    labels:
      logging: 'promtail'
      logging_jobname: 'oathkeeper'
    command: serve --config /etc/config/oathkeeper/oathkeeper.yml
    restart: unless-stopped
    volumes:
    - type: bind
      source: ./config/oathkeeper
      target: /etc/config/oathkeeper
    ports:
    - '80:4455'
    networks:
    - iam
```

- For steps on how to run Loki and monitor logs of the labeled container jump to [Running The Telemetry Solution](#running-the-telemetry-solution)

## Monitoring Metrics and Traces

### Application Setup

Your application needs to be configured to send telemetry data to the OpenTelemetry collector. OpenTelemetry code instrumentation is supported for the most of the popular languages. Depending on the language, topics covered will include some or all of the following:

- Automatic instrumentation
- Manual instrumentation
- Exporting data

Here's an example of how to set it up with a NestJS app:

- Add the all needed opentelemetry dependencies:
  - `@opentelemetry/api`
  - `@opentelemetry/auto-instrumentations-node`
  - `@opentelemetry/exporter-metrics-otlp-http`
  - `@opentelemetry/exporter-trace-otlp-http`
  - `@opentelemetry/instrumentation`
  - `@opentelemetry/resources`
  - `@opentelemetry/sdk-metrics`
  - `@opentelemetry/sdk-node`
  - `@opentelemetry/semantic-conventions`
  - `@opentelemetry/tracing`

> **Note:** Part of these dependencies are related to how you instrument your application. For this example we are using auto-instrumentation but however you may need to add other dependencies in case you want to extend the instrumentation behavior.

- On src folder create a tracer.ts. This file should set-up three things.
  - Application instrumentation.
  - OTEL metric exporter (this will export you metrics to the OTEL collector)
  - OTEL trace exporter (this will export you traces to the OTEL collector)

- Initialize your tracer by importing it in the ./main.ts file.

- Now you can run your app with `npm run start dev` and your application would start exporting traces and metrics to open telemetry collector.

- Check the next section for steps on how to run the OTEL-collector along with the rest of the telemetry stack.

## Running The Telemetry Solution

### Prerequisites

- To be able to run this solution with grafana, you need to have a postgres database setup the DB_NAME should be *grafana*
- Set in you .env file these to variables with their respective values as follows:

```
POSTGRES_USER=your_postgres_db_user_name
POSTGRES_PASSWORD=your_postgres_db_password
```

### Components

### Promtail

- Promtail is configured to collect logs from various sources and send them to Loki for storage and analysis.
- Configuration involves specifying log file paths, labels, and Loki endpoint details.

### Loki

- Loki is a log aggregation system designed to store logs efficiently and query them efficiently.
- Configuration involves defining storage, limits, and ingesting rules.

### OTEL-collector

- OTEL-collector is responsible for receiving telemetry data, like traces and metrics, from various sources and exporting them to backend services like Prometheus and Tempo.
- Configuration involves specifying receivers, processors, and exporters.

### Prometheus

- Prometheus is a monitoring system and time-series database that collects metrics from monitored targets.
- Configuration involves defining scrape jobs, alerting rules, and storage configurations.

### Tempo

- Tempo is a distributed tracing backend that receives trace data from OTEL-collector and provides querying capabilities.
- Configuration involves defining receivers, storage, limits, and sampling rules.

### Grafana

- Grafana is configured to visualize metrics and logs from various data sources including Loki, Tempo, and Prometheus.
- Configuration involves adding data sources and setting up dashboards.

## Starting The Solution

- Start the telemetry solution by starting the telemetry docker compose using the following command:

```
docker compose -f docker-compose-telemetry.yml up -d
```

- This will start each of the following containers:
  - **Promtail:** Backend service that will scrap logs out of each running docker container with the label logging equal to *promtail*
  - **Loki:** Backend service that will query scrapped logs from promtail.
  - **OTEL-collector:** Backend service that will recieve traces and metrics from your application and export them to the configured destinations. It is additonally configured to export them to the docker console logs.
  - **Prometheus:** Backend service that will scrap metrics from the OTEL-Collector
  - **Tempo:** Backend service that will recieve traces from OTEL-Collector
  - **Grafana:** grafana is configured with Loki, Tempo and Prometheus as datasources for visualization purposes

## Verify the setup

- Check OTEL-collector container logs, you should be able to see your application exported traces and metrics printed on console.  
- Open Grafana in your browser by navigating to <http://localhost:3000>. You should be able to select loki, tempo and prometheus as datasources and create dashboards on for each of them.

> **Note:** If we want to use another stack other than grafana, we would simply need to update exporters we have configured on the OTEL_collector config file to export recieved data to another stack.
