from conductor.client.worker.worker_task import worker_task
from conductor.client.worker.exception import NonRetryableException
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.services.mini_cash import MiniCash
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="update MiniCash account migration status")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="update_mc_account_migration_status", poll_interval_millis=polling_interval * 1000)
def worker_task(consumer_id: str) -> dict:
    logger.debug("consumer_id %s" % consumer_id)
    consumer_repository = ConsumerPostgresqlRepository()
    consumer = consumer_repository.get(consumer_id=consumer_id)
    if consumer is None:
        error_message = f"Consumer {consumer_id} not found"
        logger.error(error_message)
        raise NonRetryableException(error_message)
    response = MiniCash.migrateConsumer(consumer.national_id)
    if not response:
        error_message = f"Failed to migrate consumer with id {consumer_id} and ssn {consumer.national_id}"
        logger.error(error_message)
        raise Exception(error_message)
    else:
        logger.info("worker finished")
        return {"ssn": consumer.national_id, "status": "success"}
