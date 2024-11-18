""" Base class for all models
"""
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from src.config.logging import logger
from config.settings import settings
from urllib.parse import quote_plus
from fastapi import Request

logger = logger.bind(service="database", context="setup", action="startup")

db_auto = settings.get("database", default={}).get("auto", default=True)
db_host = settings.get("database", default={}).get("host", default="localhost")
db_port = settings.get("database", default={}).get("port", default=5432)
db_name = settings.get("database", default={}).get("name", default="vas_db")
db_username = quote_plus(settings.get("database", default={}).get("username", default="db_user"))
db_password = quote_plus(settings.get("database", default={}).get("password", default="db_pass"))

db_connection_string = "postgresql+psycopg://{db_username}:{db_password}@{db_host}:{db_port}/{db_name}".format(
    db_username=db_username,
    db_password=db_password,
    db_host=db_host,
    db_port=db_port,
    db_name=db_name,
)
# Initialize the database engine
engine = None
try:
    # Create an engine with the given connection string
    logger.debug("trying to connect to the database", db_host=db_host, db_port=db_port, db_name=db_name)
    engine = create_engine(url=db_connection_string, pool_pre_ping=True, pool_recycle=1800)
    engine.connect()
    # Create the database if it does not exist and db_auto is True
    if db_auto and not database_exists(engine.url):
        create_database(engine.url)
except Exception as err:
    # Log a critical error if the database connection fails
    logger.critical("database connection failed", error=err)

try:
    logger.debug("trying to create DB session")
    # Create a configured "Session" class
    SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
    logger.debug("db session created")
except Exception as err:
    # Log a critical error if the session creation fails
    logger.critical("failed to generate DB session", error=err)


# FastAPI dependency for database access
def get_db(request: Request):
    """
    FastAPI dependency that provides a database session for the request.

    Args:
        request (Request): The incoming FastAPI request.

    Returns:
        SessionLocal: A database session bound to the request.
    """
    return request.state.db


def is_db_alive() -> bool:
    """
    Check if the database connection is alive.

    Returns:
        bool: True if the database connection is successful, False otherwise.
    """
    with SessionLocal() as session:
        try:
            session.execute(text('SELECT 1'))
            return True
        except SQLAlchemyError as error:
            logger.critical("database connection failed", error=err)
    return False


@contextmanager
def get_session():
    """
    Context manager to ensure the database session is properly closed after use.

    Yields:
        SessionLocal: A new database session.
    """
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()
