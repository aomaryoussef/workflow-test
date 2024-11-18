from src.services.logging import logger
from typing import Any, Dict, Optional
from uuid import UUID
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.services.workflow import Workflow

logger = logger.bind(service="checkout", context="use case", action="trigger send checkout otp")


class TriggerSendOtpUseCase:
    def __init__(
        self,
        consumer_repository: ConsumerRepositoryInterface,
        checkout_repository: CheckoutBasketRepositoryInterface,
        session_basket_id: UUID,
    ):
        self.consumer_repository = consumer_repository
        self.checkout_repository = checkout_repository
        self.session_basket_id = session_basket_id

    def execute(self) -> Optional[Dict[str, Any]]:
        logger.debug("execute")

        checkout_basket = self.checkout_repository.find_by_session_basket_id(self.session_basket_id)
        if checkout_basket is None:
            logger.error("Checkout basket not found")
            raise Exception("Checkout basket not found")
        consumer = self.consumer_repository.get(checkout_basket.consumer_id)
        if consumer is None:
            logger.error("consumer not found")
            raise Exception("consumer not found")
        workflow_id = checkout_basket.workflow_id
        result = Workflow.trigger_human_send_otp(workflow_id, consumer.id)
        if result is None:
            logger.error("Cant trigger send otp")
            raise Exception("Cant trigger send otp")
        return consumer.phone_number
