from src.domain.consumer.dtos.get_credit_limit_dto import InputDto, OutputDto

from src.domain.consumer.repository.repository_interface import (
    ConsumerRepositoryInterface,
)
from src.services.scoring_engine import ScoringEngine
from src.utils.exceptions import NotFoundException
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="get credit limit")


class GetCreditLimitUseCase:

    def __init__(
        self,
        consumer_repository: ConsumerRepositoryInterface,
        input_dto: InputDto,
    ):
        self.consumer_repository = consumer_repository
        self.input_dto = input_dto
        self.scoring_engine = ScoringEngine()

    def execute(self) -> OutputDto:
        consumer_phone_number = self.get_consumer_phone_number()

        scoring_credit_limit_dto = self.scoring_engine.getConsumerCreditLimit(consumer_phone_number)
        if scoring_credit_limit_dto.user_exists:
            logger.debug("Consumer is mini cash customer")
            logger.debug(f"consumer credit limit:{scoring_credit_limit_dto.credit_limit * 100}")
            outputDto = OutputDto(credit_limit=scoring_credit_limit_dto.credit_limit * 100)
            return outputDto
        else:
            raise NotFoundException("Consumer is not a mini cash customer")

    def get_consumer_phone_number(self) -> str:

        consumer = self.consumer_repository.get(self.input_dto.consumer_id)

        if consumer is None:
            error_message = f"Consumer {self.input_dto.consumer_id} not found"
            logger.error(error_message)
            raise NotFoundException(error_message)
        consumer_phone_number = consumer.phone_number
        return consumer_phone_number