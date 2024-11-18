from conductor.client.worker.worker_task import worker_task
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.services.logging import logger
from src.utils.notifications import Notifications
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="send_installment_payment_notification")
loan_settlement_success_sms_template_id = settings.get("sms_templates", default={}).get(
    "loan_settlement_success", default=""
)
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="send_installment_payment_notification", poll_interval_millis=polling_interval * 1000)
def worker_task(
    consumer_id: str,
    paid_amount_units: int,
) -> dict:
    consumer_repository = ConsumerPostgresqlRepository()
    consumer = consumer_repository.get(consumer_id)
    if consumer is None:
        raise Exception("Consumer not found")
    response = Notifications.send_sms(
        template_id=loan_settlement_success_sms_template_id,
        recipient=consumer.phone_number,
        consumer_name="",
        amount=str(paid_amount_units / 100.0),
    )
    return response
