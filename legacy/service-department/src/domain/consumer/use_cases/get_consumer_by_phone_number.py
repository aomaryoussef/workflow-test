from src.domain.consumer.dtos.get_consumer_by_phone_number_dto import GetConsumerByPhoneNumberOutputDto
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.services.logging import logger

logger = logger.bind(service="consumer", context="get consumer by phone number use case")


class GetConsumerByPhoneNumberUseCase:
    def __init__(self, consumer_repository: ConsumerRepositoryInterface):
        self.consumer_repository = consumer_repository

    def execute(self, phone_number: str) -> GetConsumerByPhoneNumberOutputDto:
        try:
            logger.debug("Consumer phone number %s" % phone_number)
            consumer = self.consumer_repository.get_by_phone_number(phone_number)
            if not consumer:
                logger.debug("consumer not found")
                return None
            return GetConsumerByPhoneNumberOutputDto(consumer=consumer)
        except Exception as exception:
            logger.critical("Failed to get consumer %s" % str(exception))
            raise exception
