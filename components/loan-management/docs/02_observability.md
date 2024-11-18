## Observability Setup

### Introduction

This document outlines the observability setup for the project,
focusing on the metrics endpoint for both the server and workers.
The observability stack includes Prometheus for metrics collection,
Grafana for visualization, Loki for log aggregation, and Tempo for
tracing.

This application leverages OpenTelemetry for exporting metrics, which is an
industry-standard observability framework. This setup helps in monitoring the
application's health, performance, and reliability but keeps the application
agnostic of the observability platform implementation. Meaning, if the
platform changes from LGTM stack to something else, there will be no impact
on the application code.

### OpenTelemetry

OpenTelemetry is employed to collect and export metrics. It provides a unified
standard for metrics, logs, and traces, which simplifies observability and
improves interoperability between tools.

#### Benefits

1. **Unified Standard**: One framework for metrics, logs, and traces.
2. **Interoperability**: Works well with Prometheus, Grafana, and other tools.
3. **Flexibility**: Supports multiple exporters and can be easily configured.


### Observability Stack

#### Prometheus

Prometheus is used for scraping metrics exposed by the application. Each
instance of the HTTP server and worker exposes an endpoint `/metrics` for
Prometheus to scrape.

##### Configuration of Prometheus

Add the following job configurations to your Prometheus configuration file
(`prometheus.yml`):

```yaml
scrape_configs:
  - job_name: 'lms_server'
    static_configs:
      - targets: ['host:2223'] # Replace with your server instances

  - job_name: 'lms_worker'
    static_configs:
      - targets: ['host:2223'] # Replace with your worker instances
```

#### Impact of running multiple instances of server and workers

When running multiple instances of the server and workers, ensure that
each instance has a unique port number for the metrics endpoint. This
ensures that Prometheus can scrape metrics from each instance without
conflicts.

> This is only relevant if you use a VM. In K8S or Docker, you can use the same
> port number for all instances.

Configure the metrics port for each instance in the application using
the env variable `APP_METRICS_PORT` (default is `2223`).

#### Grafana

Grafana is used to visualize the metrics collected by Prometheus.
Dashboards can be created to monitor various aspects of the server and
workers.

A pre-built Grafana dashboard for the LMS application is present as a code
in the location `<ROOT>/components/telemetry/config/grafana/dashboards/`.

It is mandatory that the DevOps provided Grafana instance be able to
provision the LMS dashboard from this location on any change.

#### Loki (Placeholder)

Loki will be used for log aggregation. Placeholder for future configuration.

#### Tempo (Placeholder)

Tempo will be used for distributed tracing. Placeholder for future
configuration.