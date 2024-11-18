
from typing import Optional
from src.domain.consumer.models.consumer import ConsumerStatus
from src.domain.consumer.models.credit_limit import CreditLimit
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.domain.consumer.dtos.set_consumer_await_activation_dto import (
    InputDto,
    OutputDto,
)
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="set consumer status to awaiting activation")


class SetConsumerAwaitActivationUseCase:
    def __init__(self, consumer_repository: ConsumerRepositoryInterface, input_dto: InputDto):
        self.consumer_repository = consumer_repository
        self.consumer_id = input_dto.consumer_id
        self.credit_limit = input_dto.credit_limit

    def execute(self) -> Optional[OutputDto]:
        try:
            logger.debug("execute set awaiting activation")
            status = ConsumerStatus.AWAITING_ACTIVATION
            consumer = self.consumer_repository.update_status(self.consumer_id, status)
            consumer.credit_limit = CreditLimit(value=self.credit_limit)
            self.consumer_repository.create_consumer_credit_limit(self.consumer_id, self.credit_limit)
            return OutputDto(consumer=consumer)
        except Exception as exception:
            logger.error("Failed to set consumer to awaiting activation %s" % str(exception))
            raise exception
