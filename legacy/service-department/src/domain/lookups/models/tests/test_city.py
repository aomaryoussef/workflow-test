from src.domain.lookups.models.city import City


def test_city_creation(fixture_city):
    city = City(
        id=fixture_city["id"],
        mc_id=fixture_city["mc_id"],
        name_ar=fixture_city["name_ar"],
        name_en=fixture_city["name_en"],
        governorate_id=fixture_city["governorate_id"],
    )

    assert city.id == fixture_city["id"]
    assert city.mc_id == fixture_city["mc_id"]
    assert city.name_ar == fixture_city["name_ar"]
    assert city.name_en == fixture_city["name_en"]
    assert city.governorate_id == fixture_city["governorate_id"]


def test_city_to_dict(fixture_city):
    city = City(
        id=fixture_city["id"],
        mc_id=fixture_city["mc_id"],
        name_ar=fixture_city["name_ar"],
        name_en=fixture_city["name_en"],
        governorate_id=fixture_city["governorate_id"],
    )
    city_dict = city.to_dict()

    assert city_dict["id"] == fixture_city["id"]
    assert city_dict["mc_id"] == fixture_city["mc_id"]
    assert city_dict["name_ar"] == fixture_city["name_ar"]
    assert city_dict["name_en"] == fixture_city["name_en"]
    assert city_dict["governorate_id"] == fixture_city["governorate_id"]

