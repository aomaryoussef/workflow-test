from src.domain.lookups.models.governorate import Governorate


def test_governorate_creation(fixture_governorate):
    governorate = Governorate(
        id=fixture_governorate["id"],
        mc_id=fixture_governorate["mc_id"],
        name_ar=fixture_governorate["name_ar"],
        name_en=fixture_governorate["name_en"],
    )

    assert governorate.id == fixture_governorate["id"]
    assert governorate.mc_id == fixture_governorate["mc_id"]
    assert governorate.name_ar == fixture_governorate["name_ar"]
    assert governorate.name_en == fixture_governorate["name_en"]


def test_governorate_to_dict(fixture_governorate):
    governorate = Governorate(
        id=fixture_governorate["id"],
        mc_id=fixture_governorate["mc_id"],
        name_ar=fixture_governorate["name_ar"],
        name_en=fixture_governorate["name_en"],
    )
    governorate_dict = governorate.to_dict()

    assert governorate_dict["id"] == fixture_governorate["id"]
    assert governorate_dict["mc_id"] == fixture_governorate["mc_id"]
    assert governorate_dict["name_ar"] == fixture_governorate["name_ar"]
    assert governorate_dict["name_en"] == fixture_governorate["name_en"]
