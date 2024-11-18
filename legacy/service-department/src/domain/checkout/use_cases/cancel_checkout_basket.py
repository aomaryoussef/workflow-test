from typing import Optional, Dict
import uuid
import structlog

from src.domain.checkout.repository.repository_interface import (
    CheckoutBasketRepositoryInterface,
)

from src.domain.checkout.models.checkout_basket import CheckoutBasketCancelStatues, CheckoutBasketStatus
from src.services.workflow import Workflow

logger = structlog.get_logger()
logger = logger.bind(service="checkout", context="use case", action="cancel checkout basket")


class CancelCheckoutBasketUseCase:
    def __init__(
        self,
        repository: CheckoutBasketRepositoryInterface,
        session_basket_id: uuid,
        status: CheckoutBasketCancelStatues,
    ):
        self.repository = repository
        self.session_basket_id = session_basket_id
        self.status = status

    def execute(self) -> Optional[Dict[str, str]]:
        logger.debug("execute")
        try:
            checkout_basket = self.repository.find_by_session_basket_id(self.session_basket_id)
            if checkout_basket is None:
                return None
            old_checkout_basket_status = checkout_basket.status
            checkout_basket.cancel(self.status)
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
            checkout_basket = self.repository.save_checkout_basket(checkout_basket)
            return {"status": checkout_basket.status.value}
        except Exception as expt:
            logger.error("Unable to cancel checkout basket with id %s" % str(self.session_basket_id))
            raise expt
