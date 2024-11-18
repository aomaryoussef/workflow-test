from uuid import UUID

from src.domain.partner.models.partner import Partner, PartnerStatus


def test_partner_creation(fixture_partner):
    partner = Partner(
        name=fixture_partner["name"],
        categories=fixture_partner["categories"],
        tax_registration_number=fixture_partner["tax_registration_number"],
        commercial_registration_number=fixture_partner["commercial_registration_number"],
    )

    assert isinstance(partner.id, UUID)
    assert partner.name == fixture_partner["name"]
    assert partner.categories == fixture_partner["categories"]
    assert partner.status == PartnerStatus.ACTIVE
    assert partner.tax_registration_number == fixture_partner["tax_registration_number"]
    assert partner.commercial_registration_number == fixture_partner["commercial_registration_number"]


def test_partner_to_dict(fixture_partner):
    partner = Partner(
        name=fixture_partner["name"],
        categories=fixture_partner["categories"],
        tax_registration_number=fixture_partner["tax_registration_number"],
        commercial_registration_number=fixture_partner["commercial_registration_number"],
    )

    partner_dict = partner.to_dict()
    assert partner_dict["name"] == fixture_partner["name"]
    assert partner_dict["categories"] == [item.value for item in fixture_partner["categories"]]
    assert partner_dict["tax_registration_number"] == fixture_partner["tax_registration_number"]
    assert partner_dict["commercial_registration_number"] == fixture_partner["commercial_registration_number"]
