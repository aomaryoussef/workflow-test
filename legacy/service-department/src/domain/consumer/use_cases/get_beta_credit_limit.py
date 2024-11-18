from src.domain.consumer.dtos.get_credit_limit_dto import InputDto, OutputDto

from src.domain.consumer.repository.repository_interface import (
    ConsumerRepositoryInterface,
)
from src.services.scoring_engine import ScoringEngine
from src.utils.exceptions import NotFoundException
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="get beta consumer credit limit")


class GetBetaCreditLimitUseCase:

    def __init__(
        self,
        consumer_repository: ConsumerRepositoryInterface,
        input_dto: InputDto,
    ):
        self.consumer_repository = consumer_repository
        self.input_dto = input_dto
        self.scoring_engine = ScoringEngine()

    def execute(self) -> OutputDto:
        # Check if phone number exists in beta consumers
        logger.debug("Phone number exists in BetaConsumerDBModel, fetching available credit limit")
        credit_limit = self.consumer_repository.get_available_credit_limit(self.input_dto.consumer_id)
        if credit_limit:
            logger.debug(f"Available credit limit: {credit_limit.value}")
            return OutputDto(credit_limit=credit_limit.value)
        else:
            raise NotFoundException("No available credit limit for the consumer")

    def get_consumer_phone_number(self) -> str:

        consumer = self.consumer_repository.get(self.input_dto.consumer_id)

        if consumer is None:
            error_message = f"Consumer {self.input_dto.consumer_id} not found"
            logger.error(error_message)
            raise NotFoundException(error_message)
        consumer_phone_number = consumer.phone_number
        return consumer_phone_number