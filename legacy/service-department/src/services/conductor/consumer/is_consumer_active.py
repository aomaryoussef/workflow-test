from conductor.client.worker.worker_task import worker_task
from conductor.client.worker.exception import NonRetryableException
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.consumer.use_cases.get_consumer_status_by_id import GetConsumerStatusByIdUseCase
from src.domain.consumer.dtos.get_consumer_status_by_id_dtos import InputDto, OutputDto
from src.utils.exceptions import NotFoundException
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="is consumer active")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="is_consumer_active", poll_interval_millis=polling_interval * 1000)
def is_consumer_active(consumer_id: str) -> dict:
    logger.info("worker started")
    logger.debug("consumer_id %s" % consumer_id)
    input_dto = InputDto(consumer_id=consumer_id)
    consumer_repository = ConsumerPostgresqlRepository()
    logger.info("consumer repository created")
    use_case = GetConsumerStatusByIdUseCase(consumer_repository=consumer_repository, input_dto=input_dto)
    logger.info("use case created")
    try:
        output_dto: OutputDto = use_case.execute()
        if output_dto.decision == "InActive":
            logger.info("consumer is inactive")
            raise NonRetryableException("Consumer is inactive")
        return output_dto.to_dict()
    except NotFoundException as exception:
        error_message = f"Consumer doesnt exist {str(exception)}"
        logger.error(error_message)
        raise NonRetryableException(error_message)
