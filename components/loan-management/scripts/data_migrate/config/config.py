import os
from pathlib import Path
from dotenv import load_dotenv
import util.logger as logger

env_path = os.path.join(Path(__file__).parent.parent, ".env")
logger.info(f"loading .env file with overrides from location: {env_path}")
load_dotenv(dotenv_path=env_path, override=True)

LMS2_BASE_URL = os.getenv("LMS2_BASE_URL")

LMS1_DB_HOST = os.getenv("LMS1_DB_HOST")
LMS1_DB_PORT = os.getenv("LMS1_DB_PORT")
LMS1_DB_USER = os.getenv("LMS1_DB_USER")
LMS1_DB_PASSWORD = os.getenv("LMS1_DB_PASSWORD")
LMS1_DB_NAME = os.getenv("LMS1_DB_NAME")
LMS1_DB_SCHEMA = os.getenv("LMS1_DB_SCHEMA")

MYLO_DB_HOST = os.getenv("MYLO_DB_HOST")
MYLO_DB_PORT = os.getenv("MYLO_DB_PORT")
MYLO_DB_USER = os.getenv("MYLO_DB_USER")
MYLO_DB_PASSWORD = os.getenv("MYLO_DB_PASSWORD")
MYLO_DB_NAME = os.getenv("MYLO_DB_NAME")
MYLO_DB_SCHEMA = os.getenv("MYLO_DB_SCHEMA")

LMS2_DB_HOST = os.getenv("LMS2_DB_HOST")
LMS2_DB_PORT = os.getenv("LMS2_DB_PORT")
LMS2_DB_USER = os.getenv("LMS2_DB_USER")
LMS2_DB_PASSWORD = os.getenv("LMS2_DB_PASSWORD")
LMS2_DB_NAME = os.getenv("LMS2_DB_NAME")
LMS2_DB_SCHEMA = os.getenv("LMS2_DB_SCHEMA")

MIGRATION_SCRIPT = "migration_script"
