# tests/conftest.py
import pytest
from config.settings import settings
from fastapi.testclient import TestClient
from testcontainers.postgres import PostgresContainer
from sqlalchemy.sql import text

from src.utils.file_helpers import get_file_path


@pytest.fixture(scope="session", autouse=True)
def postgres_container():
    """Setup PostgreSQL test container and initialize the database."""
    with PostgresContainer("postgres:14.6") as postgres:
        configure_database_settings(postgres)
        from src.config.postgresql import SessionLocal

        with SessionLocal() as session:
            schema_sql_file_path = get_file_path('resources/schema.sql')
            data_sql_file_path = get_file_path('resources/data.sql')
            initialize_schema(session, schema_sql_file_path)
            populate_base_data(data_sql_file_path, postgres)

        yield SessionLocal


@pytest.fixture(scope="function")
def client(postgres_container):
    """
    Set up the TestClient with a simulated db_session middleware.
    """

    # from app import app_init
    from src.api.routes import app

    # app_init(app)
    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="function")
def db_session(postgres_container):
    """Provides a transactional scope around a series of operations."""
    from src.config.postgresql import get_session
    with get_session() as session:
        yield session


def configure_database_settings(postgres):
    """Configure the database settings with the connection details from the test container."""
    test_db_details = postgres.get_connection_url().split('@')[-1]
    db_host = test_db_details.split(':')[0]
    db_port = int(test_db_details.split(':')[1].split('/')[0])

    settings.database.host = db_host
    settings.database.port = db_port
    settings.database.name = postgres.dbname
    settings.database.username = postgres.username
    settings.database.password = postgres.password
    settings.database.schema = "public"
    settings.salary_mapping.path = get_file_path('resources/data/job_salary_mapping.json')


def initialize_schema(session, sql_file_path):
    """Initialize the database schema."""
    with open(sql_file_path, 'r') as sql_file:
        sql_commands = sql_file.read()
        session.execute(text(sql_commands))
        session.commit()


def populate_base_data(sql_file_path, postgres):
    """Execute a SQL file directly using psycopg2."""
    import psycopg2
    connection = psycopg2.connect(
        dbname=postgres.dbname,
        user=postgres.username,
        password=postgres.password,
        host=postgres.get_container_host_ip(),
        port=postgres.get_exposed_port(5432)
    )
    cursor = connection.cursor()
    with open(sql_file_path, 'r') as sql_file:
        sql_commands = sql_file.read()
        cursor.execute(sql_commands)
        connection.commit()
    cursor.close()
    connection.close()
