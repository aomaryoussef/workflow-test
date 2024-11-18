from src.domain.consumer.dtos.get_consumer_status_by_id_dtos import InputDto, OutputDto
from src.domain.consumer.models.consumer import ConsumerStatus
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.utils.exceptions import NotFoundException
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="get consumer status by id")


class GetConsumerStatusByIdUseCase:
    def __init__(self, consumer_repository: ConsumerRepositoryInterface, input_dto: InputDto):
        self.consumer_repository = consumer_repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        consumer = self.consumer_repository.get(self.input_dto.consumer_id)
        if consumer is None:
            logger.error("consumer not found")
            raise NotFoundException("consumer not found")
        return OutputDto(
            ssn=consumer.national_id,
            decision="Active" if consumer.status == ConsumerStatus.ACTIVE else "InActive",
            name=consumer.full_name,
            phone_number=consumer.phone_number,
        )
