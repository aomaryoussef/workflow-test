# Database migration and seeding

## Schema and metadata migration

migration for both schema and metadata is controlled by the container 'hasura-migrate' in docker,
responsable for auto applying the schema when the project starts.
for more details, refer to 'https://hasura.io/docs/latest/migrations-metadata-seeds/manage-migrations/'

## Data seeding

To run Hasura seeds after starting your project
and to install the Hasura CLI, refer to 'https://hasura.io/docs/latest/hasura-cli/install-hasura-cli/'
Once the CLI is installed, run the project using 'docker compose up -d'.
Then navigate to your project directory and apply your seed data with the command `hasura sd apply --file <seeds_file_sql> --database-name <target_db>', This will populate your database with the required data for your application to function correctly
