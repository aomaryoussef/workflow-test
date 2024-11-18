<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Details

### Exception Handling
All exceptions within the application are handled using a custom exception filter. When an exception occurs, the response is standardized in the following format:
```json
{
  "message": "Description of the error",
  "errorCode": "unique_error_code",
  "traceId": "generated_trace_id"
}
```

* `message`: A human-readable description of the error, providing clarity on what went wrong.
* `errorCode`: A unique identifier for the type of error (e.g., `creation_error`, `not_found`, etc.).
* `traceId`: A traceable ID to help identify and follow the request in the logs, useful for debugging and monitoring.

This standardized format ensures that responses are consistent, making it easier for clients to handle errors and improving observability for troubleshooting.

### BaseRepository Abstraction
The BaseRepository class is used as the foundation for all repositories in the project. It provides common methods like `create`, `findOne`, `findAll`, `update`, and `remove`, ensuring no code duplication across different repositories. Every model-specific repository extends BaseRepository:
* No code duplication: Common CRUD operations are handled in `BaseRepository`, while domain-specific repositories focus on model-specific logic.
* Consistency: All repositories share the same method signatures and behaviors, making it easier to maintain and update the codebase.
Example of extending `BaseRepository`:
```ts
@Injectable()
export class ConsumerCreditLimitRepository extends BaseRepository<ConsumerCreditLimit> {
  constructor(
    @InjectRepository(ConsumerCreditLimit)
    private readonly consumerCreditLimitRepository: Repository<ConsumerCreditLimit>,
  ) {
    super(consumerCreditLimitRepository);
  }
}
```
This structure allows us to focus on domain-specific logic in each repository, while the common CRUD operations are managed in the base class.

### Use Case Structure
Each **use case** encapsulates business logic and can be invoked through:

1. **API (Controller):** The use case logic can be exposed to external clients via APIs, typically handled by controllers.
2. **Conductor as Worker Task:** The same use case logic can be invoked by worker tasks in the conductor. This allows us to reuse the same core logic for different workflows, whether triggered by API requests or background tasks.
This design ensures that the use case logic is reusable, clean, and organized, minimizing redundant code and improving maintainability.

### ParamsValidationPipe for Input Validation
The `ParamsValidationPipe` is used at the API level to validate incoming request parameters. This pipe supports multiple types of validation, such as:

* **UUID validation:** Ensures the parameter is a valid UUID.
* **Integer validation:** Validates and transforms a parameter into an integer.
* **String validation:** Ensures the parameter is a non-empty string.

By applying this pipe, you ensure that input parameters are validated consistently across the API.

Example usage:
```ts
@Get(':id')
someEndpoint(@Param('id', ParamsValidation('uuid')) id: string) {
  // id will be validated and processed as a valid UUID
}
```

### Testing with TestContainers
We have integrated **TestContainers** into the project, which allows for more robust and isolated testing. TestContainers enables us to run actual database containers during testing, providing a more realistic environment. This helps ensure that tests behave more consistently and accurately simulate production scenarios.

### Logging with Winston
The application uses **Winston** for logging, configured to output logs in JSON format to stdout. This configuration makes it easier to integrate with log aggregators and monitoring services.

* **JSON logs:** Each log entry is structured in JSON format, making it machine-readable and easier to parse in cloud-based logging systems.
* **Log output:** Logs are streamed to stdout, which can then be collected by container or cloud environments for further analysis.


### Swagger Documentation
**Swagger** is enabled in the project to automatically generate API documentation. Swagger provides an interactive interface for API clients to explore and test the available endpoints. It also helps with understanding the structure of input/output parameters, making API integration more seamless.

To access Swagger documentation, you can navigate to:
```bash
http://localhost:3000/api/docs
```
---
## Project Structure

The `value-added-services` project follows a structured and modular architecture to support scalability and maintainability across various domains. Each domain (e.g., `consumer`) is a self-contained module with its own business logic, configuration, and external interfaces. Below is the detailed breakdown of the project structure, with descriptions of each section.


```
├── src
│   ├── app
│   │   └── web
│   │       └── consumer
│   ├── app.module.ts
│   ├── config
│   ├── domain
│   │   └── consumer
│   │       ├── consumer.module.ts
│   │       ├── dto
│   │       ├── models
│   │       ├── repository
│   │       └── use_cases
│   ├── exceptions
│   ├── main.ts
│   ├── middlewares
│   ├── pipes
│   ├── services
│   │   └── conductor
│   │       └── consumer
│   └── utils
├── tests
│   ├── global-setup.ts
│   ├── global-teardown.ts
│   ├── integration
│   ├── performance
│   ├── security
│   ├── unit
│   │   └── consumer
│   │       ├── repository
│   │       └── use_cases
│   └── utils
```

### 1. `config/`

This directory contains global configurations used throughout the `value-added-services` project. These configurations are not domain-specific and apply to the entire application.

- **`settings.ts`**: Global settings for the project, such as environment configurations, API keys, and other environment-dependent variables.

### 2. `src/`

The `src` directory contains the core source code of the application, organized into subdirectories for external APIs, domain-specific logic, global configurations, and utilities.

#### 2.1. `app/`

This folder contains everything that is exposed externally, such as APIs. Each domain (e.g., `consumer`) will have its own dedicated section under `web/`.

- **`app/web/consumer/`**: Contains all web-facing controllers and services for the `consumer` domain. Each domain will follow this structure under the `web/` directory. Additional domains will have their own directories under `web/`.

#### 2.2. `config/`

Contains global configuration files that apply to all domains of the `value-added-services` project.

- **`database.config.ts`**: Configuration for connecting to the database.
- **`logger.config.ts`**: Configuration for logging settings across the project.

#### 2.3. `domain/`

The `domain` directory contains the core business logic for each domain. Each domain (e.g., `consumer`) has its own module and subdirectories for handling specific functionalities. This is where all domain-specific logic lives.

- **`consumer/`**:
    - **`consumer.module.ts`**: The main module file for the consumer domain.
    - **`dto/`**: Data Transfer Objects (DTOs) used for validation and communication between layers within the consumer domain.
    - **`models/`**: TypeORM entities or other data models related to the consumer domain.
    - **`repository/`**: Handles database interactions specific to the consumer domain.
    - **`use_cases/`**: Contains the core business logic and use cases for the consumer domain.

  Each additional domain (e.g., `order`, `product`) will follow the same structure as `consumer`.

#### 2.4. `exceptions/`

This directory contains global exception-handling logic that applies to the entire application.

- **`custom-exception.filter.ts`**: A global exception filter to handle errors and format them consistently.
- **`custom-exceptions.ts`**: Custom exceptions used across all value-added services.

#### 2.5. `middlewares/`

This directory contains global middlewares that are applied across all value-added services.

- **`logger.middleware.ts`**: Middleware for logging incoming requests.
- **`tracing.middleware.ts`**: Middleware for tracing and logging unique request IDs.

#### 2.6. `pipes/`

This directory contains global pipes for validating and transforming incoming request parameters.

- **`params-validation.pipe.ts`**: A pipe that validates request parameters based on types like UUID, integer, and string.

#### 2.7. `services/`

The `services` folder is where backend services are defined, including services that are not exposed directly as APIs, such as worker processes or background jobs.

- **`conductor/`**: Contains services related to specific domains, which are meant to run background tasks or perform actions outside of the main request-response cycle.
    - **`consumer/`**: Background tasks related to the consumer domain. Each domain will have its own subdirectory under `conductor`.

#### 2.8. `utils/`

Contains utility functions and helper classes that are used throughout the project.

### 3. `tests/`

The `tests` directory contains all the test files, organized by type and domain. The test types include unit tests, integration tests, security tests, and performance tests.

- **`global-setup.ts`**: Global setup logic that runs before the test suite.
- **`global-teardown.ts`**: Global teardown logic that runs after the test suite.
- **`integration/`**: Integration tests that test multiple components working together.
- **`performance/`**: Tests that focus on performance and scalability.
- **`security/`**: Security-focused tests.
- **`unit/`**: Unit tests for individual components.
    - **`consumer/`**: Unit tests specific to the consumer domain.
        - **`repository/`**: Unit tests for consumer repository logic.
        - **`use_cases/`**: Unit tests for consumer use cases.
    - **Additional domains** will have their own subdirectories under `unit/`.

- **`utils/`**: Contains helper functions for test cases, such as test utilities and configurations.

---

## Standardized Approaches

### Database Timestamp Configuration
To standardize timestamp formats and avoid issues with timestamp precision:
```ts
@Column({
  type: 'timestamptz', // 'TIMESTAMP WITH TIME ZONE'
  precision: 0,        // Removes milliseconds
})
activeSince: Date;
```
And on database:
```SQL
    active_since    timestamp(0) WITH TIME ZONE not null,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
```
**Benefits:**
  * Ensures consistent timestamp formatting in the database (e.g., `2024-09-16 20:33:49 +00:00`).
  * Simplifies comparisons and ordering of timestamp fields.
  * Reduces potential issues with timestamp precision in tests and application logic.

### Responsibilities
#### Repositories
* **Data Access:** Handle all interactions with the database for their respective entities.
* **Transaction Handling:** Manage transactions internally to ensure atomicity.
* **Business Logic:** Contain logic specific to data manipulation and consistency checks.

#### Use Cases
* **Business Operations:** Provide high-level methods that encapsulate business logic and workflows.
* **Coordination:** Utilize repository methods to perform operations without directly handling low-level data access.
* **Validation:** Perform any necessary validations before invoking repository methods.

### Environment Variable Validation with Joi
To ensure that all required environment variables are set and correctly formatted, we use the Joi library to validate environment variables defined in the `.env` file.

**Joi** is a powerful schema description and data validation library for JavaScript. It allows us to define schemas for our configuration and validate them during the application startup.
**Benefits:**
  * **Prevent Runtime Errors:** Catch missing or improperly formatted environment variables before the application runs.
  * **Early Failure Detection:** Fail fast during startup if configuration issues are detected.
  * **Security:** Validates and sanitizes input to prevent injection attacks or misuse.

### Using Jest and Testcontainers
We have implemented comprehensive integration tests using **Jest** and **Testcontainers** to ensure the correctness of our repository and use case implementations.

* **Testcontainers:** Used to spin up a real PostgreSQL database in Docker for integration testing.
* **Jest:** Provides the testing framework for writing and executing test cases.
* **Test Utilities:** A custom `test-utils.ts` file facilitates the setup and teardown of the test environment.

---

## Missing Features and Enhancements

### Implement Observability with OpenTelemetry (Logging, Monitoring, Tracing)
Implement observability using **OpenTelemetry** to capture logging, monitoring, and tracing data, and send this data to the **Grafana stack** for visualization and alerting.

#### Scope:

* Integrate **OpenTelemetry** for tracing all incoming requests and external service calls.
* Instrument key parts of the application to capture telemetry data (metrics, logs, traces).
* Ensure all traces and logs are enriched with trace IDs and are sent to the Grafana stack.
* Configure metrics collection (e.g., request latency, throughput, errors) to be visualized in Grafana.

#### Next Steps:
* Add **OpenTelemetry** support for logging, tracing, and metrics collection.
* Configure integration with the Grafana stack to send all telemetry data to Grafana Loki (logs), Tempo (traces), and Prometheus (metrics).
* Ensure that metrics and traces are accessible and actionable for debugging, monitoring, and optimizing the system’s performance.
---

### Trace ID Logic
The trace ID logic ensures that every log entry, and any necessary context throughout the application, uses the same trace identifier to make debugging and log tracing easier.

#### Implementation:
* A method like `getTraceId()` will be used to retrieve the current trace ID in the execution context.
* If an incoming request contains the `x-trace-id` header, this trace ID will be used. If not, a new UUID (version 4) will be generated and associated with the request context.
* This trace ID should be included in:
  * All logs (debug, info, error)
  * Responses in case of errors (as part of the standardized error response structure)
#### Next Steps:
* Implement the logic to capture and propagate the `traceId` in all logs and request contexts.
* Update middleware to optionally accept `x-trace-id` from incoming API requests.
---
### Enhance Logging with Debug/Info/Error Logs
Logging needs to be enhanced across the application to ensure that we can capture detailed information for debugging, monitoring, and error tracking.

* Logging Levels:
  * **Debug:** For low-level information useful during development and debugging. This includes the start and end of processes, variables, and values during execution.
  * **Info:** For general informational logs, such as incoming requests, successful operations, and important milestones.
  * **Error:** For logging any errors that occur during the request lifecycle, including stack traces when needed.
#### Next Steps:
* Add appropriate debug, info, and error log entries across the application to ensure that important events are captured.
---
### Production-Ready Dockerfile with High Performance
A Dockerfile should be added to ensure the application can be containerized and deployed in a production environment, optimized for performance.

#### Optimizations:
* Use multi-stage builds to reduce the final image size.
* Ensure the image contains only the necessary runtime dependencies.
* Enable high performance by configuring Node.js to run in production mode and limiting resources like memory and CPU usage effectively.

#### Next Steps:
* Add a `Dockerfile` with production-ready configurations.
* Ensure the image is lightweight and secure, using best practices (such as running the application as a non-root user).
---

### Performance Testing
Adding performance tests will help ensure the application performs well under various loads, scales properly, and meets the required throughput and response time.

#### Scope:
  * Measure throughput, latency, and system resource utilization under various simulated workloads.
  * Use tools like k6 or Artillery to simulate API traffic and test the system's limits.

#### Next Steps:
* Add performance testing scripts and configurations to the tests/performance directory.
* Ensure these tests can be automated and integrated into the CI/CD pipeline.
---

### Security Testing
Security is a crucial part of the application lifecycle, and tests should be added to identify potential security issues.

#### Scope:
* Test for common vulnerabilities such as SQL injection, cross-site scripting (XSS), and improper authentication/authorization.
* Use tools like OWASP ZAP to run automated security scans.
* Ensure that all endpoints are tested for both known vulnerabilities and proper handling of authentication.

#### Next Steps:
* Add security tests in the `tests/security` directory, automating where possible.
* Regularly run security scans and analyze the results.
---

### Integration Testing (End-to-End)
End-to-end integration testing is essential to ensure that the application works as expected when interacting with external services, databases, and APIs.

#### Scope:
* Use TestContainers to spin up real databases and services during tests.
* Test entire user journeys and service flows, including database interactions, external API calls, and background tasks.

#### Next Steps:
* Write integration tests in the `tests/integration` directory.
* Ensure that these tests cover key workflows and are able to detect any issues in the interaction between system components.
---

### Enhance and Add Custom Exceptions
Currently, custom exceptions handle common scenarios, but there may be additional scenarios where more specific exceptions are needed.

#### Enhancements:

* Review the current exceptions to ensure they handle all edge cases.
* Add more granular exceptions where needed, especially for scenarios like service timeouts, external API errors, and complex business logic failures.

#### Next Steps:
* Add any missing custom exceptions, ensuring that they follow the same response format (i.e., message, errorCode, traceId).
---

### Basic Middleware Authentication via `api-key`
To secure certain routes, a basic middleware should be added to authenticate incoming requests via an API key.

#### Implementation:
* The middleware will check for the presence of an `api-key` in the headers of the incoming request.
* If the key matches a predefined value (or a set of valid keys), the request is allowed. Otherwise, it is rejected with a `403 Forbidden` response.

#### Next Steps:
* Implement the API key authentication middleware.
* Apply it to routes that need to be secured, ensuring that the system can easily extend to more robust authentication mechanisms in the future.
---
