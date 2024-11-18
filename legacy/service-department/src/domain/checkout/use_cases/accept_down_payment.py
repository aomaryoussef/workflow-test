from typing import Optional
from uuid import UUID
import structlog
from src.domain.checkout.dtos.accept_down_payment_dto import AcceptDownPaymentOutputDto
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus

from src.domain.checkout.repository.repository_interface import (
    CheckoutBasketRepositoryInterface,
)
from src.services.workflow import Workflow

logger = structlog.get_logger()


class AcceptDownPaymentUseCase:
    def __init__(self, repository: CheckoutBasketRepositoryInterface, session_basket_id: UUID):
        self.repository = repository
        self.session_basket_id = session_basket_id

    def execute(self) -> Optional[AcceptDownPaymentOutputDto]:
        logger.debug("activate loan case - execute")
        checkout_basket = self.repository.find_by_session_basket_id(self.session_basket_id)
        if checkout_basket is None or checkout_basket.status != CheckoutBasketStatus.COMMERCIAL_OFFER_SELECTED:
            raise Exception("Checkout basket not found")
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
        result = Workflow.trigger_pos_clearance(workflow_id)
        if result is None:
            raise Exception("Cant activate loan")
        checkout_basket.status = CheckoutBasketStatus.DOWN_PAYMENT_ACCEPTED
        self.repository.save_checkout_basket(checkout_basket)
        return AcceptDownPaymentOutputDto(checkout_basket)
