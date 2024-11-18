from psycopg2 import pool

from config import config as db_config

# Initialize the connection pool
__cp_mylo = pool.SimpleConnectionPool(
    1,  # Minimum number of connections
    20, # Maximum number of connections
    host=db_config.MYLO_DB_HOST,
    port=db_config.MYLO_DB_PORT,
    database=db_config.MYLO_DB_NAME,
    user=db_config.MYLO_DB_USER,
    password=db_config.MYLO_DB_PASSWORD,
)

def get_connection():
    """Get a connection from the pool."""
    if __cp_mylo:
        return __cp_mylo.getconn()
    else:
        raise Exception("Connection pool is not initialized")

def release_connection(connection):
    """Release a connection back to the pool."""
    if __cp_mylo:
        __cp_mylo.putconn(connection)

def close_all_connections():
    """Close all connections in the pool."""
    if __cp_mylo:
        __cp_mylo.closeall()