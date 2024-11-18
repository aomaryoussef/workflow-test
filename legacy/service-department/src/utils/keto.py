from config.settings import settings
from src.services.logging import logger
from enum import Enum
from ory_client.configuration import Configuration
from ory_client.api import relationship_api, permission_api
from ory_client.api_client import ApiClient
from ory_client.model.create_relationship_body import CreateRelationshipBody


KETO_READ_BASE_URL = settings.get("IAM", default={}).get("keto_read_base_url", "")
KETO_WRITE_BASE_URL = settings.get("IAM", default={}).get("keto_write_base_url", "")
read_configuration = Configuration(KETO_READ_BASE_URL)
read_configuration.verify_ssl = False
write_configuration = Configuration(KETO_WRITE_BASE_URL)
write_configuration.verify_ssl = False

logger = logger.bind(service="IAM", context="Keto", action="setup")


class KETO_CONSTANTS(Enum):
    GROUP = "Group"
    PARTNER = "Partner"
    MEMBERS = "members"

    RELATIONSHIP_MANAGERS = "relationshipManagers"
    BRANCH_EMPLOYEES = "branchEmployees"
    CUSTOMER_CARE = "customerCare"
    ADMINS = "admins"
    CASHIERS = "cashiers"
    BRANCHES_MANAGERS = "branchesManagers"
    CONSUMERS = "consumers"


class Keto:
    @staticmethod
    def add_user_permission(
        group: str, user: str, relation: str = KETO_CONSTANTS.MEMBERS.value, namespace: str = KETO_CONSTANTS.GROUP.value
    ) -> bool:
        with ApiClient(write_configuration) as api_client:
            try:
                api_instance = relationship_api.RelationshipApi(api_client)
                create_relationship_body: CreateRelationshipBody = CreateRelationshipBody(
                    namespace=namespace,
                    object=group,
                    relation=relation,
                    subject_id=user,
                )
                api_instance.create_relationship(create_relationship_body=create_relationship_body)
                return True
            except Exception as exception:
                logger.error("Unable to create relationship between group and user %s" % str(exception))
                return False

    @staticmethod
    def check_user_permission(
        group: str, user: str, relation: str = KETO_CONSTANTS.MEMBERS.value, namespace: str = KETO_CONSTANTS.GROUP.value
    ) -> bool:
        with ApiClient(read_configuration) as api_client:
            try:
                api_instance = permission_api.PermissionApi(api_client)
                api_response = api_instance.check_permission(
                    namespace=namespace,
                    object=group,
                    relation=relation,
                    subject_id=user,
                )
                return True if api_response.allowed else False
            except Exception as exception:
                logger.error("Unable to check relationship between group and user %s" % str(exception))
                return False
