from typing import Optional, TypedDict
from config.settings import settings
from src.services.logging import logger
import requests
from ory_client.configuration import Configuration
from ory_client.api_client import ApiClient
from ory_client.api import identity_api
from ory_client.model.create_identity_body import CreateIdentityBody
from ory_client.model.json_patch_document import JsonPatchDocument
from ory_client.model.identity_state import IdentityState
from ory_client import ApiException
from ory_client.model.create_recovery_code_for_identity_body import (
    CreateRecoveryCodeForIdentityBody,
)
from enum import Enum
import re
from src.utils.exceptions import ServiceUnAvailableException, ConflictException

KRATOS_ADMIN_BASE_URL = settings.get("IAM", default={}).get("kratos_admin_base_url", "")
use_test_data = settings.get("app", default={}).get("use_test_data", default=False)
configuration = Configuration(KRATOS_ADMIN_BASE_URL)
configuration.verify_ssl = False

logger = logger.bind(service="IAM", context="Kratos", action="setup")


class KratosIdentitySchema(Enum):
    EMAIL = "email_schema_v0"
    PHONE = "phone_schema_v0"


class RecoveryCodeResponse(TypedDict):
    flow_id: str
    recovery_code: str


class Kratos:
    @staticmethod
    def create_identity(
        kratos_schema: KratosIdentitySchema, identifier: str, use_default_password: bool = use_test_data
    ) -> Optional[str]:
        with ApiClient(configuration) as api_client:
            api_instance = identity_api.IdentityApi(api_client)
            credentials = {"password": {"config": {"password": "123456"}}} if use_default_password else {}
            if kratos_schema == KratosIdentitySchema.EMAIL:
                create_identity_body = CreateIdentityBody(
                    schema_id=KratosIdentitySchema.EMAIL.value,
                    state=IdentityState("active"),
                    traits={"email": identifier, "password_created": False},
                    verifiable_addresses=[
                        {
                            "value": identifier,
                            "verified": True,
                            "via": "email",
                            "status": "completed",
                        }
                    ],
                    credentials=credentials,
                )
            elif kratos_schema == KratosIdentitySchema.PHONE:
                phone_number = identifier if identifier.startswith("+2") else "+2" + identifier
                create_identity_body = CreateIdentityBody(
                    schema_id=KratosIdentitySchema.PHONE.value,
                    state=IdentityState("active"),
                    traits={"phone": phone_number, "password_created": False},
                    verifiable_addresses=[
                        {
                            "value": phone_number,
                            "verified": True,
                            "via": "sms",
                            "status": "completed",
                        }
                    ],
                    credentials=credentials,
                )
            try:
                api_response = api_instance.create_identity(create_identity_body=create_identity_body)
                return api_response.id
            except ApiException as e:
                if e.status == 409:
                    logger.error("Identity already exists in ory: {}".format(str(e)))
                    raise ConflictException("Identity already exists")
                logger.error("Ory Failed to create identity: {}".format(str(e)))
                raise ("Ory Failed to create identity")

    @staticmethod
    def delete_identity(identity_id: str) -> bool:
        with ApiClient(configuration) as api_client:
            api_instance = identity_api.IdentityApi(api_client)
            try:
                api_instance.delete_identity(identity_id)
                return True
            except ApiException as e:
                logger.error("Failed to delete identity: {}".format(str(e)))
                return False

    @staticmethod
    def get_identity(identity_id: str) -> Optional[dict]:
        with ApiClient(configuration) as api_client:
            api_instance = identity_api.IdentityApi(api_client)
            try:
                api_response = api_instance.get_identity(identity_id)
                return api_response.to_dict()
            except ApiException as e:
                logger.error("Failed to get identity: {}".format(str(e)))
                return None

    @staticmethod
    def get_identity_by_identifier(identifier: str) -> Optional[dict]:
        try:
            response = requests.get(
                url=KRATOS_ADMIN_BASE_URL + "/admin/identities",
                verify=False,
                params={"credentials_identifier": identifier},
                headers={"Content-Type": "application/json"},
            )
            response = response.json()
            if len(response) > 0:
                identity = response[0]
                return identity
            else:
                logger.error("Failed to get identity %s" % str(response))
                return None
        except Exception as e:
            logger.error("kratos service is unavailable %s" % str(e))
            raise ServiceUnAvailableException("kratos service is unavailable")

    @staticmethod
    def update_identity(identity_id: str, state: str) -> bool:
        with ApiClient(configuration) as api_client:
            api_instance = identity_api.IdentityApi(api_client)
            try:
                api_instance.patch_identity(
                    id=identity_id,
                    json_patch_document=JsonPatchDocument([{"op": "replace", "path": "/state", "value": state}]),
                )
                return True
            except ApiException as e:
                logger.error("Failed to update identity: {}".format(str(e)))
                return None

    @staticmethod
    def set_identity_password_created(identity_id: str, password_created: bool) -> bool:
        with ApiClient(configuration) as api_client:
            api_instance = identity_api.IdentityApi(api_client)
            try:
                api_instance.patch_identity(
                    id=identity_id,
                    json_patch_document=JsonPatchDocument(
                        [{"op": "replace", "path": "/traits/password_created", "value": password_created}]
                    ),
                )
                return True
            except ApiException as e:
                logger.error("Failed to patch identity: {}".format(str(e)))
                return False

    @staticmethod
    def create_recovery_code(identity_id: str) -> Optional[RecoveryCodeResponse]:
        with ApiClient(configuration) as api_client:
            api_instance = identity_api.IdentityApi(api_client)
            create_recovery_code_for_identity_body = CreateRecoveryCodeForIdentityBody(
                identity_id=identity_id,
            )
            try:
                api_response = api_instance.create_recovery_code_for_identity(
                    create_recovery_code_for_identity_body=create_recovery_code_for_identity_body
                )
                if api_response.get("recovery_link"):
                    api_response["flow_id"] = (
                        re.search(r"flow=([0-9a-fA-F-]+)", api_response.get("recovery_link")).group(1)
                        if "flow=" in api_response.get("recovery_link")
                        else ""
                    )
                return api_response
            except ApiException as e:
                logger.error("Failed to create recovery code: {}".format(str(e)))
                return None