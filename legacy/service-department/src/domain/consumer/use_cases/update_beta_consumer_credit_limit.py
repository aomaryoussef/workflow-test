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
from src.utils.exceptions import ResourceNotUpdatedException
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="update beta credit limit")


class UpdateBetaConsumerCreditLimitUseCase:

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
        signed_amount = self.__adjust_amount_direction_for_scoring_engine()
        # Check if the phone number exists in BetaConsumerDBModel
        logger.debug("Phone number exists in BetaConsumerDBModel, using new credit limit update logic")
        # Use the new update logic to update the credit limit
        consumer_id = self.input_dto.consumer_id
        amount = signed_amount * 100
        direction = self.input_dto.direction
        updated_credit_limit = self.consumer_repository.update_credit_limit(consumer_id, abs(amount), direction)
        if updated_credit_limit:
            logger.info(f"Updated credit limit for consumer {consumer_id}: {updated_credit_limit.available_credit_limit}")
            return OutputDto(
                credit_limit=updated_credit_limit.available_credit_limit
            )
        else:
            error_message = f"Failed to update Consumer Credit Limit for consumer {consumer_id}"
            logger.error(error_message)
            raise ResourceNotUpdatedException(error_message)

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
