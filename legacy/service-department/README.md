# OpenLoop Service Department

![Python Version](https://img.shields.io/badge/Python-3.10-blue)
![PyTest Version](https://img.shields.io/badge/pytest-7.4.0-green)
![Mode CLI](https://img.shields.io/badge/Mode-CLI-red)
![Mode GRPC](https://img.shields.io/badge/Mode-GRPC-red)
![Mode Web](https://img.shields.io/badge/Mode-Web-red)

Enablement services for the Open Loop

- [Architecture](#architecture)
- [Application Modes](#application-modes)
  - [CMD](#cmd)
  - [Web](#web)
- [Development](#development)
  - [Getting Started](#gettings-started)
  - [Run the App](#run-the-app)
  - [Build CLI Executable](#build-the-cli-executable)
  - [App Settings](#app-settings)
  - [Logging](#logging)
  - [Docs](#docs)
  - [Unit Testing](#unit-testing)

## Architecture

This codebase follows the `Onion architecture` which is a design pattern that organizes the codebase of a software application into multiple layers, where the innermost layer is the domain layer and the outermost layer is the application layer. Each layer depends only on the layers inside of it and not on the layers outside of it, creating a separation of concerns, allowing for a more maintainable and scalable codebase. The primary goal of this architecture is to make it easy to add new functionality or make changes to existing functionality without affecting the rest of the application.

## Application Modes

For a complete and updated list of the available options inside the app, use the `help` menu (`app -h`). The application can be run in the following modes:

### CMD

```
python app.py -m cmd
```

### Web

```
python app.py -m web
```

## Development

Python `3.10` or higher

### Gettings Started

```
# Clone the code repo
git clone git@github.com:btechlabs/value-added-services.git

# Create the virtual environment
python3 -m virtualenv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On Linux/MacOS
source venv/bin/activate

# Install python packages
pip install -r requirements.txt
pip install -r requirements-dev.txt

# [Optional] Setup Pre-commit
pre-commit install

# [Optional] Pre-commit dry run
pre-commit run --all-files
```

### Run the app

```
python app.py

# [Optional] preview all available options
python app.py -h
```

### Build the CLI executable

```
pyinstaller --onefile app.py
```

This will create an executable file `depending on your OS` in the `dist` directory

### App Settings

This app uses [DynaConf](https://www.dynaconf.com/). Settings are loaded from a `settings.toml` file and can be overriden from the `environment variables` (eg: `export OL_VAS_FOO=bar`).

### Logging

This application uses structured logging. Logging configurations can be controlled in the `log` space inside the `src/settings.toml` file. For structured logging it uses [structlog](www.structlog.org).

In a standard case, a log entry contains three essential parts:

- timestamp (ISO-8601)
- log level (debug - info - warning - error - critical - exception)
- event (message)

This is presented in a single line/string. With structured logging, the same info is presented in a JSON format for ease of processing and reading, in addition to that, it enables you to add more key-value paired info to the log entry, example:

```
{
  "timestamp": "2023-08-31T07:24:49.557836Z",
  "level": "info",
  "event": "record created successfully",
  "origin": "factory A",
  "user: "dummy_user@corp.xyz"
  ...
}
```

### Docs

Code documentation is an integral part of the codebase, it's generated and commited side by side with the actual code itself. Documentation is generated in the `docs` directory, open the file `index.html` inside that directory with your browser.

```
# generate documentation
pdoc --html src --output-dir docs --force
```

### Unit Testing

Unit testing is an integral part of the codebase. We target 100% of unit testing coverage at all times.

```
# run all unit tests
pytest

# [optional] run tests and fail if coverage falls under 100%
pytest -v -s --cov --cov-fail-under=100

# [optional] generate a coverage report in html format
pytest --cov --cov-report=html
```

### Github workflow simulation

It is possible to run the github workflows locally instead of having to run them after push/pr/merge events. Steps to do that:
- Install [github CLI](https://cli.github.com/)
- Configure Github CLI
  ```
  gh auth login
  ```
- Install [Act](https://github.com/nektos/act)
- Install make
- Run the command
  ```
  make run-gh-wf-pr
  ```