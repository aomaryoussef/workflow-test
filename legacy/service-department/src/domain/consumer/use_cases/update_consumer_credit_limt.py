import math
from src.domain.consumer.dtos.update_consumer_credit_limit_dto import (
    InputDto,
    OutputDto,
)
from src.domain.consumer.models.credit_limit import CreditLimitDirection
from src.domain.consumer.repository.repository_interface import (
    ConsumerRepositoryInterface,
)
from src.services.scoring_engine import ScoringEngine
from src.utils.exceptions import NotFoundException, ResourceNotUpdatedException
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="update credit limit")


class UpdateConsumerCreditLimitUseCase:

    def __init__(
        self,
        consumer_repository: ConsumerRepositoryInterface,
        input_dto: InputDto,
    ):
        self.consumer_repository = consumer_repository
        self.input_dto = input_dto
        self.scoring_engine = ScoringEngine()

    def execute(self) -> OutputDto:
        logger.debug("execute")
        consumer_national_id = self.__get_consumer_national_id()
        signed_amount = self.__adjust_amount_direction_for_scoring_engine()
        scoring_update_credit_limit_response = self.scoring_engine.updateConsumerCreditLimit(
            ssn=consumer_national_id, amount=signed_amount
        )
        if scoring_update_credit_limit_response is None:
            error_message = f"Failed to update Consumer Credit Limit {self.input_dto.consumer_id}"
            logger.error(error_message)
            raise ResourceNotUpdatedException(error_message)
        logger.info(f"updated Consumer Credit Limit { scoring_update_credit_limit_response['credit_limit']}")
        outputDto = OutputDto(
            credit_limit=scoring_update_credit_limit_response["credit_limit"] * 100  # convert to pounds
        )

        return outputDto

    def __get_consumer_national_id(self) -> str:

        consumer = self.consumer_repository.get(self.input_dto.consumer_id)

        if consumer is None:
            error_message = f"Consumer {self.input_dto.consumer_id} not found"
            logger.error(error_message)
            raise NotFoundException(error_message)
        consumer_national_id = consumer.national_id
        return consumer_national_id

    def __adjust_amount_direction_for_scoring_engine(self):
        """
        Returns the integer with a sign based on the direction.

        Parameters:
        number (int): The integer to be signed.
        direction (enum): The direction, either "INCREASE" or "DECREASE".

        Returns:
        str: The signed integer as a string.
        """
        if self.input_dto.direction == CreditLimitDirection.INCREASE:
            signed_integer = -math.ceil(self.input_dto.amount / 100)
        elif self.input_dto.direction == CreditLimitDirection.DECREASE:
            signed_integer = math.floor(self.input_dto.amount / 100)
        else:
            raise ValueError("Direction must be either 'INCREASE' or 'DECREASE'")

        return signed_integer