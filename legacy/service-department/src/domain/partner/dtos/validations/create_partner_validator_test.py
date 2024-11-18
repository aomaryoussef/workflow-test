import pytest

from src.domain.partner.dtos.validations.create_partner_validator import CreatePartnerInputDtoValidator


def test_valid_data():
    valid_data = {
        "name": "Test Store",
        "categories": ["ELECTRONICS"],
        "tax_registration_number": "123456789",
        "commercial_registration_number": "9876543210",
        "bank_account": {
            "bank_name": "CIB",
            "branch_name": "ASSIUT",
            "beneficiary_name": "Test Store",
            "iban": "123",
            "swift_code": "123X",
            "account_number": "1234567890",
        },
        "admin_user": {
            "first_name": "Sample",
            "last_name": "Cashier",
            "email": "sample@exampl.com",
            "phone_number": "+201234567890",
        },
    }
    validator = CreatePartnerInputDtoValidator(valid_data)
    validator.validate()  # Should not raise any exception


def test_missing_required_field():
    invalid_data = {
        # Missing store_name
        "category": "electronics",
        "governorate": "assiut",
        "tax_id": "12345678901234",
        "commercial_registration_number": "9876543210",
        "address": "Test Address",
        "uploaded_documents": ["doc1", "doc2"],
        "iban": ["Test IBAN"],
        "phone_number": "01234567890",
        "email": "store@example.com",
    }
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()


def test_short_store_name():
    invalid_data = {
        "store_name": "ab",  # Less than 3 characters
        "category": "electronics",
        "governorate": "assiut",
        "tax_id": "12345678901234",
        "commercial_registration_number": "9876543210",
        "address": "Test Address",
        "uploaded_documents": ["doc1", "doc2"],
        "iban": ["Test IBAN"],
        "phone_number": "01234567890",
        "email": "store@example.com",
        "admin": {
            "first_name": "Sample",
            "last_name": "Cashier",
            "identifier": "sample_user_profile",
            "email": "sample@exampl.com",
            "phone_number": "01234567890",
        },
    }
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()


def test_long_store_name():
    invalid_data = {
        "store_name": "a" * 81,  # More than 80 characters
        "category": "electronics",
        "governorate": "assiut",
        "tax_id": "12345678901234",
        "commercial_registration_number": "9876543210",
        "address": "Test Address",
        "uploaded_documents": ["doc1", "doc2"],
        "iban": ["Test IBAN"],
        "phone_number": "01234567890",
        "email": "store@example.com",
        "admin": {
            "first_name": "Sample",
            "last_name": "Cashier",
            "identifier": "sample_user_profile",
            "email": "sample@exampl.com",
            "phone_number": "01234567890",
        },
    }
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()


def test_non_string_elements_in_uploaded_documents():
    invalid_data = {
        "uploaded_documents": ["doc1", 12345],  # Contains a non-string element
        "store_name": "Test Store",
        "governorate": "assiut",
        "tax_id": "12345678901234",
        "commercial_registration_number": "9876543210",
        "address": "Test Address",
        "iban": ["Test IBAN"],
        "phone_number": "01234567890",
        "email": "store@example.com",
        "admin": {
            "first_name": "Sample",
            "last_name": "Cashier",
            "identifier": "sample_user_profile",
            "email": "sample@exampl.com",
            "phone_number": "01234567890",
        },
    }
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()


def test_non_list_uploaded_documents():
    invalid_data = {
        "uploaded_documents": "not_a_list",
        "store_name": "Test Store",
        "category": "electronics",
        "governorate": "assiut",
        "tax_id": "12345678901234",
        "commercial_registration_number": "9876543210",
        "address": "Test Address",
        "iban": ["Test IBAN"],
        "phone_number": "01234567890",
        "email": "store@example.com",
        "admin": {
            "first_name": "Sample",
            "last_name": "Cashier",
            "identifier": "sample_user_profile",
            "email": "sample@exampl.com",
            "phone_number": "01234567890",
        },
    }
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()


def test_invalid_category():
    invalid_data = {
        "category": "Invalid Category",
        "store_name": "Test Store",
        "governorate": "assiut",
        "tax_id": "12345678901234",
        "commercial_registration_number": "9876543210",
        "address": "Test Address",
        "uploaded_documents": ["doc1", "doc2"],
        "iban": ["Test IBAN"],
        "phone_number": "01234567890",
        "email": "store@example.com",
        "admin": {
            "first_name": "Sample",
            "last_name": "Cashier",
            "identifier": "sample_user_profile",
            "email": "sample@exampl.com",
            "phone_number": "01234567890",
        },
    }
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()


def test_empty_category():
    invalid_data = {
        "category": "",
        "store_name": "Test Store",
        "governorate": "assiut",
        "tax_id": "12345678901234",
        "commercial_registration_number": "9876543210",
        "address": "Test Address",
        "uploaded_documents": ["doc1", "doc2"],
        "iban": ["Test IBAN"],
        "phone_number": "01234567890",
        "email": "store@example.com",
        "admin": {
            "first_name": "Sample",
            "last_name": "Cashier",
            "identifier": "sample_user_profile",
            "email": "sample@exampl.com",
            "phone_number": "01234567890",
        },
    }
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()


def test_empty_address():
    invalid_data = {
        "address": "",
        "store_name": "Test Store",
        "governorate": "assiut",
        "tax_id": "12345678901234",
        "commercial_registration_number": "9876543210",
        "uploaded_documents": ["doc1", "doc2"],
        "iban": ["Test IBAN"],
        "phone_number": "01234567890",
        "email": "store@example.com",
        "admin": {
            "first_name": "Sample",
            "last_name": "Cashier",
            "identifier": "sample_user_profile",
            "email": "sample@exampl.com",
            "phone_number": "01234567890",
        },
    }
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()


def test_invalid_characters_in_tax_id():
    invalid_data = {
        "tax_id": "Invalid$TaxID",
        "store_name": "Test Store",
        "governorate": "assiut",
        "commercial_registration_number": "9876543210",
        "address": "Test Address",
        "uploaded_documents": ["doc1", "doc2"],
        "iban": ["Test IBAN"],
        "phone_number": "01234567890",
        "email": "store@example.com",
        "admin": {
            "first_name": "Sample",
            "last_name": "Cashier",
            "identifier": "sample_user_profile",
            "email": "sample@exampl.com",
            "phone_number": "01234567890",
        },
    }
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()


def test_missing_fields():
    invalid_data = {}  # Empty data
    validator = CreatePartnerInputDtoValidator(invalid_data)
    with pytest.raises(ValueError):
        validator.validate()
