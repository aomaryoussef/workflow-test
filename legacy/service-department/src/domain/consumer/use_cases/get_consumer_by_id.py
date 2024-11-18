from src.domain.consumer.dtos.get_consumer_by_id_dtos import InputDto, OutputDto
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.utils.exceptions import NotFoundException
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="get consumer by id")


class GetConsumerByIdUseCase:
    def __init__(self, consumer_repository: ConsumerRepositoryInterface, input_dto: InputDto):
        self.consumer_repository = consumer_repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        consumer = self.consumer_repository.get(self.input_dto.id)
        if consumer is None:
            logger.debug("consumer not found")
            raise NotFoundException("partner not found")
        output_dto = OutputDto(consumer=consumer)
        return output_dto
