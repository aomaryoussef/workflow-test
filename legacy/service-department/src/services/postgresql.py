""" Base class for all models
"""

from typing import Optional
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from src.services.logging import logger
from config.settings import settings
from urllib.parse import quote_plus

logger = logger.bind(service="database", context="setup", action="launch")

db_host = settings.get("database", default={}).get("host", default="localhost")
db_port = settings.get("database", default={}).get("port", default=5432)
db_name = settings.get("database", default={}).get("name", default="vas_db")
db_username = quote_plus(settings.get("database", default={}).get("username", default="db_user"))
db_password = quote_plus(settings.get("database", default={}).get("password", default="db_pass"))
debug = settings.get("log", default={}).get("level", default="INFO") == "DEBUG"

db_connection_string = "postgresql+psycopg://{db_username}:{db_password}@{db_host}:{db_port}/{db_name}".format(
    db_username=db_username,
    db_password=db_password,
    db_host=db_host,
    db_port=db_port,
    db_name=db_name,
)
engine = None
try:
    engine = create_engine(url=db_connection_string, pool_pre_ping=True, pool_recycle=1800)
    engine.connect()
except Exception as exception:
    logger.critical("Database connection failed %s" % str(exception))


def generate_db_session() -> Optional[Session]:
    try:
        logger.info("create db session")
        Session = sessionmaker(bind=engine, expire_on_commit=False)
        logger.info("db session created")
        return Session
    except Exception as exception:
        logger.critical("Failed to generate DB session %s" % str(exception))
        return None


def is_db_alive() -> bool:
    Session = generate_db_session()
    if Session is None:
        return False
    with Session() as session:
        try:
            session.execute(text("SELECT 1;"))
            return True
        except SQLAlchemyError as error:
            logger.critical("Database connection failed %s" % str(error))
    return False
