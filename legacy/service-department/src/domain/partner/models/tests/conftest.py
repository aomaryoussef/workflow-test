from datetime import datetime
from uuid import UUID

import pytest
from src.domain.partner.models.partner import PartnerCategory
from src.domain.partner.models.branch import Coordinates


@pytest.fixture
def fixture_partner_branch():
    id = UUID("9fbb9d80-5b63-460d-86d4-59bc8da73c12")
    branch = {
        "id": id,
        "name": "Main",
        "governorate_id": 25,
        "city_id": 359,
        "area_id": 4661,
        "area": "El-Arab",
        "street": "Tahrir Street",
        "location": Coordinates(latitude=27.183662, longitude=31.193579),
        "google_maps_link": "https://www.google.com/maps/@29.9210883,31.0679065,15z",
        "created_at": str(datetime.now()),
        "updated_at": str(datetime.now()),
    }
    return branch


@pytest.fixture
def fixture_user_profile(fixture_partner):
    id = UUID("9fbb9d80-5b63-460d-86d4-59bc8da73c12")
    iam_id = UUID("9fbb9d80-5b63-460d-86d4-59bc8da73c00")
    user_profile = {
        "id": id,
        "iam_id": iam_id,
        "partner_id": fixture_partner["id"],
        "first_name": "Sample",
        "last_name": "Cashier",
        "identifier": "sample_user_profile",
        "email": "sample@user_profile.com",
        "phone_number": "01234567890",
        "profile_type": "Admin",
        "created_at": str(datetime.now()),
        "updated_at": str(datetime.now()),
    }
    return user_profile


@pytest.fixture
def fixture_partner():
    id = UUID("9fbb9d80-5b63-460d-86d4-59bc8da73c12")
    partner = {
        "id": id,
        "name": "Sample Store",
        "categories": [PartnerCategory.ELECTRONICS, PartnerCategory.FASHION],
        "tax_registration_number": "123456789",
        "commercial_registration_number": "12345",
        "created_at": str(datetime.now()),
        "updated_at": str(datetime.now()),
    }
    return partner


@pytest.fixture
def fixture_user_profile_email():
    email = "sample@user_profile.com"
    return email
