from typing import Any, Dict, Optional
from uuid import UUID
from src.services.logging import logger
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.services.workflow import Workflow
from src.services.echo import Echo

logger = logger.bind(service="checkout", context="use case", action="verify checkout otp")


class VerifyCheckoutOtpUseCase:
    def __init__(
        self,
        consumer_repository: ConsumerRepositoryInterface,
        checkout_repository: CheckoutBasketRepositoryInterface,
        session_basket_id: UUID,
        otp: str,
    ):
        self.consumer_repository = consumer_repository
        self.otp = otp
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
        try:
            status = Echo.verify_otp(self.otp, checkout_basket.consumer_id)
        except Exception:
            logger.error("failed to verify otp")
            return None
        result = Workflow.trigger_verify_otp(workflow_id, status)
        if result is None:
            logger.error("Cant verify otp")
            raise Exception("Cant verify otp")
        return status
