from typing import Any, Dict, Optional
from uuid import UUID
import structlog
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus
from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.services.workflow import Workflow

logger = structlog.get_logger()


class SelectCommercialOfferUseCase:
    def __init__(self, repository: CheckoutBasketRepositoryInterface, select_offer_id: UUID, session_basket_id: UUID):
        self.repository = repository
        self.session_basket_id = session_basket_id
        self.select_offer_id = select_offer_id

    def execute(self) -> Optional[Dict[str, Any]]:
        logger.debug("retrieve all partners use case - execute")
        checkout_basket = self.repository.find_by_session_basket_id(self.session_basket_id)
        if checkout_basket is None:
            raise Exception("Checkout basket not found")
        offer = checkout_basket.find_commercial_offer_by_id(str(self.select_offer_id))
        if offer is None:
            raise Exception("Incorrect offer provided")
        if checkout_basket.selected_commercial_offer_id is not None:
            return offer
        workflow_id = checkout_basket.workflow_id
        if not Workflow.is_workflow_running(workflow_id):
            logger.error("Workflow is not running")
            workflow_status = Workflow.get_workflow_status(workflow_id)
            if workflow_status == "TIMED_OUT":
                raise Exception("لقد تخطيت الوقت المسموح لانهاء المعاملة")
            elif workflow_status == "TERMINATED":
                raise Exception("تم إنهاء المعاملة")
            else:
                raise Exception("Workflow is not running")
        result = Workflow.trigger_commercial_offer_selection(offer=offer, workflow_id=workflow_id)
        if result is None:
            raise Exception("Cant select commercial offer")
        checkout_basket.selected_commercial_offer_id = self.select_offer_id
        checkout_basket.status = CheckoutBasketStatus.COMMERCIAL_OFFER_SELECTED
        self.repository.save_checkout_basket(checkout_basket)
        return offer
