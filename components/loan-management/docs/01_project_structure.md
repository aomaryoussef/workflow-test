## Project Structure


```
|-- cmd
|   |-- migrate
|   |-- start
|   |-- version
|-- internal
|   |-- domain
|       |-- accounts
|       |   |-- model
|       |   |-- repository
|       |-- financialproduct
|       |   |-- model
|       |   |-- repository
|       |-- loan
|       |   |-- model
|       |   |-- repository
|       |-- subledger
|       |   |-- model
|       |   |-- repository
|   |-- app
|       |-- command
|       |-- query
|       |-- worker
|   |-- infra
|       |-- eventstore
|       |-- db
|   |-- workers
|       |-- scheduler
|       |-- jobs
|-- pkg
|-- configs
|-- scripts
|-- events
|-- ui
```