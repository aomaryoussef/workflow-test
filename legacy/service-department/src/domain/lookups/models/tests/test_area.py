from src.domain.lookups.models.area import Area


def test_area_creation(fixture_area):
    area = Area(
        id=fixture_area["id"],
        mc_id=fixture_area["mc_id"],
        name_ar=fixture_area["name_ar"],
        name_en=fixture_area["name_en"],
        city_id=fixture_area["city_id"],
        governorate_id=fixture_area["governorate_id"],
    )

    assert area.id == fixture_area["id"]
    assert area.mc_id == fixture_area["mc_id"]
    assert area.name_ar == fixture_area["name_ar"]
    assert area.name_en == fixture_area["name_en"]
    assert area.city_id == fixture_area["city_id"]
    assert area.governorate_id == fixture_area["governorate_id"]


def test_area_to_dict(fixture_area):
    area = Area(
        id=fixture_area["id"],
        mc_id=fixture_area["mc_id"],
        name_ar=fixture_area["name_ar"],
        name_en=fixture_area["name_en"],
        city_id=fixture_area["city_id"],
        governorate_id=fixture_area["governorate_id"],
    )
    area_dict = area.to_dict()

    assert area_dict["id"] == fixture_area["id"]
    assert area_dict["mc_id"] == fixture_area["mc_id"]
    assert area_dict["name_ar"] == fixture_area["name_ar"]
    assert area_dict["name_en"] == fixture_area["name_en"]
    assert area_dict["city_id"] == fixture_area["city_id"]
    assert area_dict["governorate_id"] == fixture_area["governorate_id"]
