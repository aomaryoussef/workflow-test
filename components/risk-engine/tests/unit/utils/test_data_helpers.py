import pytest

from src.utils.data_helpers import flatten_dict


def test_flatten_dict_all():
    nested_dict = {
        "aa": 25000,
        "ccc": 12500,
        "bb": 37500,
        "ff": {
            "ll": None,
            "oo": None
        }
    }

    expected_flat_dict = {
        "aa": 25000,
        "ccc": 12500,
        "bb": 37500,
        "ll": None,
        "oo": None
    }

    flat_dict = flatten_dict(nested_dict)
    flat_dict = {k.split('_', 1)[-1]: v for k, v in flat_dict.items()}

    assert flat_dict == expected_flat_dict


def test_flatten_dict_specific_key():
    nested_dict = {
        "aa": 25000,
        "ccc": 12500,
        "bb": 37500,
        "ff": {
            "ll": None,
            "oo": None
        },
        "gg": {
            "mm": None,
            "nn": None
        }
    }

    expected_flat_dict = {
        "aa": 25000,
        "ccc": 12500,
        "bb": 37500,
        "ll": None,
        "oo": None,
        "gg": {
            "mm": None,
            "nn": None
        }
    }

    flat_dict = flatten_dict(nested_dict, key_to_flatten="ff")
    flat_dict = {k.split('_', 1)[-1] if k.startswith('ff_') else k: v for k, v in flat_dict.items()}

    assert flat_dict == expected_flat_dict
