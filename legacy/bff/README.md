# Mylo BFF (Backend for Frontend)

- [Architecture](#architecture)
- [Development](#development)
  - [Getting Started](#getting-started)
  - [Run the App](#run-the-app)
  - [Github workflow simulation](#github-workflow-simulation)
  - [Environment Variables](#environment-variables)
  - [Logging](#logging)
  - [Unit Testing](#unit-testing)
  - [ESLint](#eslint)

## Architecture

This codebase follows the `Onion architecture` which is a design pattern that organizes the codebase of a software application into multiple layers, where the innermost layer is the domain layer and the outermost layer is the application layer. Each layer depends only on the layers inside of it and not on the layers outside of it, creating a separation of concerns, allowing for a more maintainable and scalable codebase. The primary goal of this architecture is to make it easy to add new functionality or make changes to existing functionality without affecting the rest of the application.

## Development

### Getting Started

```
git clone git@github.com:btechlabs/mylo-bff.git
cd mylo-bff
npm ci
npm start
```

### Run the app

```
npm run dev

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

### Environment Variables

Settings are all stored in the .env file a .env.example files exists with the needed variables.

### Logging

This application uses structured logging. Logger is implemented in the `log` file inside the `src/services/logger.ts` file. For structured logging it uses [winston](https://github.com/winstonjs/winston).

In a standard case, a log entry contains three essential parts:

- service/context: defined once per file or flow
- timestamp (ISO-8601)
- log level (debug - info - warning - error - critical - exception)
- event (message)
- extras optional argument

This is presented in a single line/string. With structured logging, the same info is presented in a JSON format for ease of processing and reading, in addition to that, it enables you to add more key-value paired info to the log entry, example:

```
{
  "timestamp": "2023-08-31T07:24:49.557836Z",
  "level": "info",
  "service": "factory A",
}
```

### Unit Testing

Unit testing is an integral part of the codebase. We target 100% of unit testing coverage at all times.

```
# run all unit tests
npm run test


# [optional] generate a coverage report in console
npm run test:cov
```

### Eslint

We are using eslint for linting the BFF, the `typescript-eslint/recommended` [here](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts)
Make sure you install the eslint plugin on VS code.

Configure auto lint on save:

- Go to VS code settings
- Search for on save
- Code actions on save -> click on edit in settings.json
- Add the following JSON at the end of file

```
  "editor.codeActionsOnSave":{
    "source.fixAll.eslint":true
  }
```
