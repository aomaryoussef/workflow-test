import os
import time
import functools
import pandas as pd
import inspect
from src.config.logging import logger

logger = logger.bind(service="decorators", context="decorators", action="decorators")


def log_method_call(func):
    """
    Decorator to log the start and end of a method, its parameters (excluding pd.DataFrame and pd.Series instances),
    the result (excluding pd.DataFrame and pd.Series instances), and the execution time.

    Args:
        func (function): The function to be decorated.

    Returns:
        function: The wrapped function with logging.
    """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Filter out pd.DataFrame and pd.Series instances from parameters
        kwparams = {k: v for k, v in kwargs.items() if not isinstance(v, (pd.DataFrame, pd.Series))}

        full_filename = inspect.getfile(func)
        # Get the base filename and its upper directory
        filename = os.path.basename(full_filename).split('.')[0]
        service = os.path.basename(os.path.dirname(full_filename))
        action = func.__name__

        start_time = time.time()

        # Log the start of the method
        logger.debug(f"starting {func.__qualname__}", service=service, action=action, params=kwparams)

        # Call the actual function
        result = func(*args, **kwargs)

        # Calculate the duration
        duration = int((time.time() - start_time) * 1000)

        # Log the end of the method if result is not a pd.DataFrame or pd.Series
        if not isinstance(result, (pd.DataFrame, pd.Series)):
            logger.debug(f"finished {func.__qualname__}", service=service, action=action, result=result,
                         duration_ms=duration)
        else:
            logger.debug(f"finished {func.__qualname__}", service=service, action=action, duration_ms=duration)

        return result

    return wrapper
