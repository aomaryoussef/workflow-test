from src.domain.consumer.dtos.get_consumer_by_iam_id_dto import GetConsumerByIamIdOutputDto
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="get consumer by iam id")


class GetConsumerByIamIdUseCase:
    def __init__(self, consumer_repository: ConsumerRepositoryInterface):
        self.consumer_repository = consumer_repository

    def execute(self, iam_id: str) -> GetConsumerByIamIdOutputDto:
        logger.debug("execute")
        try:
            logger.debug("Consumer iam id %s" % iam_id)
            consumer = self.consumer_repository.get_by_iam_id(iam_id)
            if not consumer:
                logger.debug("consumer not found")
                return None
            return GetConsumerByIamIdOutputDto(consumer=consumer)
        except Exception as exception:
            logger.error("Failed to get consumer %s" % str(exception))
            raise exception
