from uuid import UUID

from src.domain.partner.models.user_profile import UserProfile


def test_user_profile_creation(fixture_user_profile):
    user_profile = UserProfile(
        partner_id=fixture_user_profile["partner_id"],
        iam_id=fixture_user_profile["iam_id"],
        first_name=fixture_user_profile["first_name"],
        last_name=fixture_user_profile["last_name"],
        email=fixture_user_profile["email"],
        phone_number=fixture_user_profile["phone_number"],
        profile_type=fixture_user_profile["profile_type"],
    )

    assert isinstance(user_profile.id, UUID)
    assert user_profile.partner_id == fixture_user_profile["partner_id"]
    assert user_profile.iam_id == fixture_user_profile["iam_id"]
    assert user_profile.first_name == fixture_user_profile["first_name"]
    assert user_profile.last_name == fixture_user_profile["last_name"]
    assert user_profile.email == fixture_user_profile["email"]
    assert user_profile.phone_number == fixture_user_profile["phone_number"]
    assert user_profile.profile_type == fixture_user_profile["profile_type"]


def test_user_profile_to_dict(fixture_user_profile):
    user_profile = UserProfile(
        partner_id=fixture_user_profile["partner_id"],
        iam_id=fixture_user_profile["iam_id"],
        first_name=fixture_user_profile["first_name"],
        last_name=fixture_user_profile["last_name"],
        email=fixture_user_profile["email"],
        phone_number=fixture_user_profile["phone_number"],
        profile_type=fixture_user_profile["profile_type"],
    )
    user_profile_dict = user_profile.to_dict()
    assert user_profile_dict["partner_id"] == str(fixture_user_profile["partner_id"])
    assert user_profile_dict["iam_id"] == str(fixture_user_profile["iam_id"])
    assert user_profile_dict["first_name"] == fixture_user_profile["first_name"]
    assert user_profile_dict["last_name"] == fixture_user_profile["last_name"]
    assert user_profile_dict["email"] == fixture_user_profile["email"]
    assert user_profile_dict["phone_number"] == fixture_user_profile["phone_number"]
    assert user_profile_dict["profile_type"] == fixture_user_profile["profile_type"]
