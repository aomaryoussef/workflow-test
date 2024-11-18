from uuid import UUID

from src.domain.partner.models.branch import Branch


def test_branch_creation(fixture_partner_branch):
    branch = Branch(
        partner_id=fixture_partner_branch["id"],
        name=fixture_partner_branch["name"],
        governorate_id=fixture_partner_branch["governorate_id"],
        city_id=fixture_partner_branch["city_id"],
        area_id=fixture_partner_branch["area_id"],
        area=fixture_partner_branch["area"],
        street=fixture_partner_branch["street"],
        location=fixture_partner_branch["location"],
        google_maps_link=fixture_partner_branch["google_maps_link"],
    )

    assert isinstance(branch.id, UUID)
    assert branch.partner_id == fixture_partner_branch["id"]
    assert branch.governorate_id == fixture_partner_branch["governorate_id"]
    assert branch.city_id == fixture_partner_branch["city_id"]
    assert branch.area_id == fixture_partner_branch["area_id"]
    assert branch.area == fixture_partner_branch["area"]
    assert branch.street == fixture_partner_branch["street"]
    assert branch.location == fixture_partner_branch["location"]
    assert branch.google_maps_link == fixture_partner_branch["google_maps_link"]
    assert branch.created_at
    assert branch.updated_at
