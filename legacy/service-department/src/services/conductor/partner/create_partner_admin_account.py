from conductor.client.worker.worker_task import worker_task
from src.utils.kratos import Kratos, KratosIdentitySchema
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="create partner admin user account")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="create_partner_admin_account", poll_interval_millis=polling_interval * 1000)
def create_partner_admin_account(email: str) -> dict:
    logger.info("worker started")
    logger.debug(f"email {email}")

    iam_id = Kratos.create_identity(kratos_schema=KratosIdentitySchema.EMAIL, identifier=email)

    return {"id": iam_id}
