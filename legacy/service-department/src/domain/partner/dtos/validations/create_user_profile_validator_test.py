from src.domain.partner.dtos.validations.create_user_profile_validator import (
    CreateUserProfileInputDtoValidator,
)


def test_valid_user_profile():
    valid_data = {
        "partner_id": "9fbb9d80-5b63-460d-86d4-59bc8da73c12",
        "first_name": "Test",
        "last_name": "Cashier",
        "national_id": "12345678901234",
        "phone_number": "+201012345678",
        "email": "test@example.com",
    }
    validator = CreateUserProfileInputDtoValidator(valid_data)
    validator.validate()
