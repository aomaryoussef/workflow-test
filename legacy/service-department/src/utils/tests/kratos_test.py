from unittest import TestCase
from unittest.mock import Mock, patch
from src.utils.kratos import Kratos, KratosIdentitySchema
from ory_client import ApiException


class TestCreateIdentity(TestCase):
    def test_create_identity_success(self):
        email = "store@example.com"

        # Mock the API client and response
        with patch("ory_client.api.identity_api.IdentityApi") as MockIdentityApi:
            mock_api_instance = MockIdentityApi.return_value
            mock_api_instance.create_identity.return_value = Mock(id="12345")

            result = Kratos.create_identity(kratos_schema=KratosIdentitySchema.EMAIL, identifier=email)

            assert result == "12345"

    def test_create_identity_invalid_phone_number(self):
        email = "john@example.com"

        with patch("ory_client.api.identity_api.IdentityApi") as MockIdentityApi:
            mock_api_instance = MockIdentityApi.return_value
            mock_api_instance.create_identity.return_value = Mock(id="12345")

            result = Kratos.create_identity(kratos_schema=KratosIdentitySchema.EMAIL, identifier=email)

            assert result == "12345"

    def test_create_identity_exception(self):
        email = "john@example.com"

        with patch("ory_client.api.identity_api.IdentityApi") as MockIdentityApi:
            mock_api_instance = MockIdentityApi.return_value
            mock_api_instance.create_identity.side_effect = ApiException("API error")

            try:
                Kratos.create_identity(kratos_schema=KratosIdentitySchema.EMAIL, identifier=email)
            except Exception:
                pass
            else:
                self.fail("ExpectedException not raised")


class TestDeleteIdentity:
    def test_delete_identity_success(self):
        identity_id = "12345"
        with patch("ory_client.api.identity_api.IdentityApi") as MockIdentityApi:
            mock_api_instance = MockIdentityApi.return_value
            mock_api_instance.delete_identity.return_value = None

            result = Kratos.delete_identity(identity_id)

            assert result is True

    def test_delete_identity_failure(self):
        identity_id = "12345"
        with patch("ory_client.api.identity_api.IdentityApi") as MockIdentityApi:
            mock_api_instance = MockIdentityApi.return_value
            mock_api_instance.delete_identity.side_effect = ApiException("API error")

            result = Kratos.delete_identity(identity_id)

            assert result is False


class TestCreateRecoverCode:
    def test_create_recovery_code_success(self):
        identity_id = "12345"
        with patch("ory_client.api.identity_api.IdentityApi") as MockIdentityApi:
            mock_api_instance = MockIdentityApi.return_value
            mock_api_instance.create_recovery_code_for_identity.return_value = {
                "recovery_code": "ABC123",
                "recovery_link": "Link",
            }

            result = Kratos.create_recovery_code(identity_id)

            assert result == {"recovery_code": "ABC123", "recovery_link": "Link", "flow_id": ""}

    def test_create_recovery_code_failure(self):
        identity_id = "12345"
        with patch("ory_client.api.identity_api.IdentityApi") as MockIdentityApi:
            mock_api_instance = MockIdentityApi.return_value
            mock_api_instance.create_recovery_code_for_identity.side_effect = ApiException("API error")

            result = Kratos.create_recovery_code(identity_id)

            assert result is None
