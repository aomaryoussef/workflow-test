from psycopg2 import pool
from config import config as db_config

# Initialize the connection pool
__cp_v1 = pool.SimpleConnectionPool(
    1,  # Minimum number of connections
    20, # Maximum number of connections
    host=db_config.LMS1_DB_HOST,
    port=db_config.LMS1_DB_PORT,
    database=db_config.LMS1_DB_NAME,
    user=db_config.LMS1_DB_USER,
    password=db_config.LMS1_DB_PASSWORD,
)

def get_connection():
    """Get a connection from the pool."""
    if __cp_v1:
        return __cp_v1.getconn()
    else:
        raise Exception("Connection pool is not initialized")

def release_connection(connection):
    """Release a connection back to the pool."""
    if __cp_v1:
        __cp_v1.putconn(connection)

def close_all_connections():
    """Close all connections in the pool."""
    if __cp_v1:
        __cp_v1.closeall()