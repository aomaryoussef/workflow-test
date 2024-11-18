from typing import Optional
from src.services.logging import logger
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.domain.checkout.dtos.retrieve_checkout_basket_dto import RetrieveCheckoutBasketOutputDto
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus
from src.services.workflow import Workflow

logger = logger.bind(service="checkout", context="use case", action="retrieve consumer active checkout")


class CancelConsumerActiveCheckoutUseCase:
    def __init__(
        self,
        consumer_repository: ConsumerRepositoryInterface,
        checkout_repository: CheckoutBasketRepositoryInterface,
        consumer_phone_number: str,
    ):
        self.consumer_repository = consumer_repository
        self.checkout_repository = checkout_repository
        self.consumer_phone_number = consumer_phone_number

    def execute(self) -> Optional[RetrieveCheckoutBasketOutputDto]:
        logger.debug("execute")
        consumer = self.consumer_repository.get_by_phone_number(self.consumer_phone_number)
        if consumer is None:
            return None
        in_progress_statuses = [
            CheckoutBasketStatus.COMMERCIAL_OFFER_SELECTED,
            CheckoutBasketStatus.CREATED,
            CheckoutBasketStatus.COMMERCIAL_OFFERS_GENERATED,
            CheckoutBasketStatus.DOWN_PAYMENT_ACCEPTED,
        ]
        try:
            checkout_basket = self.checkout_repository.find_by_consumer_id_and_status(
                consumer_id=consumer.id, statuses=in_progress_statuses
            )
            if checkout_basket is None:
                return None
            old_checkout_basket_status = checkout_basket.status
            checkout_basket.cancel(CheckoutBasketStatus.CANCELLED_BY_CASHIER)
            is_commercial_offer_generated = (
                old_checkout_basket_status == CheckoutBasketStatus.COMMERCIAL_OFFERS_GENERATED
            )
            if is_commercial_offer_generated:
                logger.debug(f"Reject commercial offer for workflow {str(checkout_basket.workflow_id)}")
                Workflow.reject_commercial_offer(checkout_basket.workflow_id)
            is_commercial_offer_accepted = old_checkout_basket_status == CheckoutBasketStatus.COMMERCIAL_OFFER_SELECTED
            if is_commercial_offer_accepted:
                logger.debug(f"Reject pos clearance for workflow {str(checkout_basket.workflow_id)}")
                try:
                    Workflow.reject_pos_clearance(checkout_basket.workflow_id)
                except Exception as exp:
                    if str(exp) == "Task is not found":
                        logger.debug(f"Reject otp for workflow {str(checkout_basket.workflow_id)}")
                        Workflow.reject_otp_workflow(checkout_basket.workflow_id)
            checkout_basket = self.checkout_repository.save_checkout_basket(checkout_basket)
            return RetrieveCheckoutBasketOutputDto(checkout_basket=checkout_basket)
        except Exception as expt:
            logger.error("Failed to retrieve consumer active checkout basket %s" % str(expt))
            raise expt
