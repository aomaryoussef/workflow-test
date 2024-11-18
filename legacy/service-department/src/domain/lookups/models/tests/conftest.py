import pytest


@pytest.fixture
def fixture_governorate():
    return {
        "id": 1,
        "mc_id": 101,
        "name_ar": "أسيوط",
        "name_en": "Assiut"
    }


@pytest.fixture
def fixture_city():
    return {
        "id": 1,
        "mc_id": 102,
        "name_ar": "أسيوط",
        "name_en": "Assiut",
        "governorate_id": 1
    }


@pytest.fixture
def fixture_area():
    return {
        "id": 1,
        "mc_id": 103,
        "name_ar": "العرب",
        "name_en": "El-Arab",
        "city_id": 1,
        "governorate_id": 1
    }
