from psycopg2 import pool
from config import config as db_config

__lms_v2_conn_params = {
    "dbname": db_config.LMS2_DB_NAME,
    "user": db_config.LMS2_DB_USER,
    "password": db_config.LMS2_DB_PASSWORD,
    "host": db_config.LMS2_DB_HOST,
    "port": db_config.LMS2_DB_PORT,
    "options": f"-c search_path={db_config.LMS2_DB_SCHEMA}"
}

# Initialize the connection pool
__cp_v2 = pool.SimpleConnectionPool(
    1,  # Minimum number of connections
    20, # Maximum number of connections
    **__lms_v2_conn_params,
)

def get_connection():
    """Get a connection from the pool."""
    if __cp_v2:
        return __cp_v2.getconn()
    else:
        raise Exception("connection pool is not initialized")

def release_connection(connection):
    """Release a connection back to the pool."""
    if __cp_v2:
        __cp_v2.putconn(connection)

def close_all_connections():
    """Close all connections in the pool."""
    if __cp_v2:
        __cp_v2.closeall()