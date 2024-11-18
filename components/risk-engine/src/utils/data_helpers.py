import json
from typing import Any
import pandas as pd
from datetime import datetime, date
from uuid import UUID
from enum import Enum


class CustomJSONEncoder(json.JSONEncoder):
    """
    Custom JSON encoder for handling additional data types.

    This encoder extends the default JSONEncoder to support:
    - datetime objects (serialized as ISO format strings)
    - date objects (serialized as ISO format strings)
    - UUID objects (serialized as strings)
    - Enum objects (serialized as their value)

    Methods:
        default(obj): Serialize additional data types.
    """

    def default(self, obj):
        """
        Override the default method to handle additional data types.

        Args:
            obj: The object to serialize.

        Returns:
            str: The serialized form of the object.
        """
        if isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, date):
            return obj.isoformat()
        elif isinstance(obj, UUID):
            return str(obj)
        elif isinstance(obj, Enum):
            return obj.value
        return super().default(obj)


def flatten_dict(d, parent_key='', sep='_', key_to_flatten=None):
    """
    Recursively flattens a nested dictionary, optionally flattening only a specified key.

    Args:
        d (dict): The dictionary to flatten.
        parent_key (str): The base key for recursion (used internally).
        sep (str): The separator used to combine keys.
        key_to_flatten (str, optional): The specific key to flatten. If None, all keys will be flattened.

    Returns:
        dict: A flattened dictionary with keys from nested dictionaries at the top level.
    """
    items = {}
    for k, v in d.items():
        if isinstance(v, dict) and (key_to_flatten is None or k == key_to_flatten):
            # Flatten this dict
            new_key = parent_key + sep + k if parent_key else k
            items.update(flatten_dict(v, new_key, sep=sep, key_to_flatten=None))
        else:
            # Do not flatten this dict
            new_key = parent_key + sep + k if parent_key else k
            items[new_key] = v
    return items


def convert_to_serializable(value: Any) -> Any:
    """
    Convert a value to a serializable format.

    Args:
        value (Any): The value to be converted.

    Returns:
        Any: The converted value in a serializable format.
    """
    if value is None:
        return None
    elif isinstance(value, (float, int, str, bool)):
        return value
    elif isinstance(value, pd.DataFrame):
        return convert_to_builtin_types(value.to_dict(orient='records'))
    elif isinstance(value, dict):
        return {k: convert_to_serializable(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [convert_to_serializable(item) for item in value]
    else:
        return str(value)  # Fallback for other types


def convert_to_builtin_types(data):
    """
    Convert a dictionary or list's values into built-in Python data types.

    Args:
        data (dict or list): The input dictionary or list.

    Returns:
        dict or list: A dictionary or list with values converted to built-in Python data types.
    """

    def convert_value(value):
        if isinstance(value, datetime):
            return value.isoformat()
        elif isinstance(value, date):
            return value.isoformat()
        elif isinstance(value, UUID):
            return str(value)
        elif isinstance(value, Enum):
            return value.value
        elif value != value:  # Checks for NaN (value != value is True for NaN)
            return None
        elif isinstance(value, dict):
            return convert_to_builtin_types(value)
        elif isinstance(value, list):
            return [convert_value(item) for item in value]
        else:
            return str(value)

    if isinstance(data, dict):
        return {k: convert_value(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_value(item) for item in data]
    else:
        raise TypeError("Input data must be a dictionary or a list")


def convert_model_params_to_dict(model_params):
    """
    Attempt to convert model parameters read from settings.toml to a dictionary.

    Args:
        model_params: The model parameters to convert.

    Returns:
        dict: The converted parameters as a dictionary.

    Raises:
        Exception: If the conversion to dictionary fails.
    """
    try:
        return model_params.to_dict()
    except Exception as err:
        raise ValueError(
            "Could not convert model parameters to a dictionary. Are you sure the format in settings.toml is correct?",
            err)
