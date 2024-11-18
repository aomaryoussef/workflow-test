from conductor.client.worker.worker_task import worker_task
from src.utils.keto import Keto, KETO_CONSTANTS
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="create partner user permission")
use_test_data = settings.get("app", default={}).get("use_test_data", default=False)
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="create_partner_admin_permission", poll_interval_millis=polling_interval * 1000)
def create_partner_admin_permission(iam_id: str, partner_id: str) -> dict:
    logger.info("worker started")
    logger.debug(f"iam_id {iam_id}, partner_id {partner_id}")

    result = Keto.add_user_permission(
        group=partner_id,
        user=iam_id,
        relation=KETO_CONSTANTS.ADMINS.value,
        namespace=KETO_CONSTANTS.PARTNER.value,
    )

    return {"permission": result}
