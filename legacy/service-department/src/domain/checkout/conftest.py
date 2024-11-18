from uuid import UUID

import pytest
from moneyed import EGP, Money

dummy_product = {
    "name": "Dummy Product",
    "serial": "123ABC456",
    "price": Money(amount=100, currency=EGP),
}

basket_id = "9fbb9d80-5b63-460d-86d4-59bc8da73c12"


@pytest.fixture
def fixture_basket_item():
    """Fixture for a basket item"""
    return dummy_product


@pytest.fixture
def fixture_checkout_basket_id():
    """Fixture for a checkout basket id"""
    return UUID(basket_id)


@pytest.fixture
def fixture_checkout_basket():
    """Fixture for a checkout basket item"""
    return {
        "basket_id": UUID(basket_id),
        "merchant_id": UUID("b23e1fc9-2010-4339-8d13-98a6fffe04de"),
        "agent_id": UUID("9bc54226-ba5e-42da-893e-598f4cd9b1ac"),
        "store_id": UUID("2d0458df-b0a1-4a35-8fae-6b8742b4bb9d"),
        "consumer_id": UUID("1dc6ad09-7f98-4924-bc5a-1bc7b22d0d1b"),
        "down_payment": Money(amount=10, currency=EGP),
        "goods": [
            dummy_product,
        ],
    }
