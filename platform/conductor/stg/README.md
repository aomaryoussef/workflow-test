# ol-workflow-orchestrator

Workflow orchestrator provides 3 capabilities / functions:

1. The Netflix Conductor server with a custom Dockerfile and corresponding
Helm Charts for deployment to K8S.
2. The Netflix Conductor UI with a custom Dockerfile and corresponding Helm
Charts for deployment to K8S
3. Workflow migrator code together with all the processes defined allowing
for auto-migrations of the workflow processes and tasks.

> Note: We will later move the process definitions to respective repositories 
> once we have developed more sophisticated tooling around it.

## Conductor

The default Docker image of the community version of Orkes Conductor fork
comes with the server and the UI together in 1 docker image. Not very optimal
for production use case. Therefore, in this repository, we break it into 2 
Docker images one containing the server (that can be scaled independently)
and another with only the UI.

### Conductor Server

See [Dockerfile](./docker/server/Dockerfile) for details.

Orkes Conductor Version: **v1.1.12**

Upgrade the version directly from the Dockerfile and do not use ENV VARS for that.

Production-ising it requires the following tasks to be completed:

- [ ] GH Action to build the docker image and push to image registry - Use version tag
same as Orkes Conductor Version i.e. `btechlabs/conductor-server:v1.1.12`
- [ ] GH Action to only be executed if a change in `./docker/server` folder is 
detected
- [ ] Helm Charts describing the K8S resources needed for the server. Please see
the environment variables below:

**Environment Variables**

| ENV VAR                               | Description                                                                                 |
|---------------------------------------|---------------------------------------------------------------------------------------------|
| `CONDUCTOR_REDIS_LOCK_SERVER_ADDRESS` | Redis connection string with format: `redis://<redis_url>:[redis_port]`                     |
| `CONDUCTOR_REDIS_HOSTS`               | Redis connection string with format: `<redis_url>:[redis_port]:<rack_name>`                 |
| `SPRING_DATASOURCE_URL`               | Postgres connection string with format: `jdbc:postgresql://<postgres_url>:[port]/<db_name>` |
| `SPRING_DATASOURCE_USERNAME`          | Postgres Username                                                                           |
| `SPRING_DATASOURCE_PASSWORD`          | Postgres Password                                                                           |

- Redis `rack_name` is an arbitrary name given to the rack e.g. `development`, 
`staging`, etc.
- Ensure the Postgres user has `CREATE TABLE`, `SELECT`, `UPDATE` and `INSERT`
permissions on the specific schema
- Ensure Postgres conductor DB does not use the `public` schema. Use the
`SPRING_DATASOURCE_URL` to also provide schema name.

**Remember:** (for future) if you run multiple instances of the conductor server, on
new update make sure you run just a single instance and then autoscale it to multiple. 
It is because the Conductor Server app runs DB migrations and running multiple instances
can get into race conditions. See [this blogpost](https://codefresh.io/blog/database-migrations-in-the-era-of-kubernetes-microservices/)
for interesting details.

### Conductor UI

See [Dockerfile](./docker/ui/Dockerfile) for details.

The UI is built from source directly from [Netflix GitHub Project](https://github.com/Netflix/conductor/)

Upgrade the version directly from the Dockerfile and do not use ENV VARS for that.

Production-ising it requires the following tasks to be completed:

- [ ] GH Action to build the docker image and push to image registry - Use version tag 
`btechlabs/conductor-ui:v1.0.0`
- [ ] GH Action to only be executed if a change in `./docker/ui` folder is detected
- [ ] Helm Charts describing the K8S resources needed for the server.

The conductor UI is built using React App, which means once the image is created the
static files are generated and no env vars for backend URL can be injected at runtime.

Therefore, we use a novel solution to achieve the 12-factor app concept where the
runtime can inject the conductor URL. We utilise a Nginx configuration to serve the static
assets and all API calls are made to the same host as that of the React App. Nginx then
intercepts the specific `/api/*` calls and reverse proxies them to the conductor backend.

See [SO Thread](https://stackoverflow.com/questions/56649582/substitute-environment-variables-in-nginx-config-from-docker-compose)
for more details or the Dockerfile itself and the use of `envsubst`.

**Environment Variables**

| ENV VAR              | Description                                                 |
|----------------------|-------------------------------------------------------------|
| `CONDUCTOR_BASE_URL` | Conductor base URL which can be reached by the UI container |


### Conductor Workflow Migrator

See [Dockerfile](./Dockerfile) for details.

The docker image comes with the migrator code and all the processes that must
be migrated to the Conductor Server.

Production-ising it requires the following tasks to be completed:

- [ ] GH Action to build the docker image and push to image registry - Use version tag
  `btechlabs/workflow-migrator:{version}`
- [ ] GH Action to only be executed if a change in `Dockerfile`, `./config` or
  any of the Golang code is detected
- [ ] Helm Charts describing the K8S resources needed for the server

Remember, this container is not a long-running container and will cease to run
once all the processes are migrated. 

**Environment Variables**

| ENV VAR              | Description                                                       |
|----------------------|-------------------------------------------------------------------|
| `CONDUCTOR_BASE_URL` | Conductor base URL which can be reached by the migrator container |
| `APP_ENV`            | Name of the environment - this will appear in the logs            |

## Running the migrator

Workflow migrator is distributed as a docker container. Ensure to bind the volume
where the configs and processes live to container's `/etc/config/workflow-migrator`.

Or, to run it by source, run: `go run main.go deploy --config-dir /etc/config/workflow-migrator`
