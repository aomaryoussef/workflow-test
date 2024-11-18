from conductor.client.worker.worker_task import worker_task
from conductor.client.worker.exception import NonRetryableException
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.services.scoring_engine import ScoringEngine
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="is mini cash consumer")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="is_mini_cash_consumer", poll_interval_millis=polling_interval * 1000)
def worker_task(consumer_id: str) -> dict:
    logger.debug(f"consumer_id {consumer_id}")
    consumer_repository = ConsumerPostgresqlRepository()
    consumer = consumer_repository.get(consumer_id=consumer_id)
    if consumer is None:
        error_message = f"Consumer {consumer_id} not found"
        logger.error(error_message)
        raise NonRetryableException(error_message)
    response = ScoringEngine.getConsumerCreditLimit(consumer.phone_number[2:])
    return {"exists": response.user_exists}
