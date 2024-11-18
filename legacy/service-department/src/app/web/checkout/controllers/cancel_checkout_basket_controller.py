from uuid import UUID
import uuid
from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout_basket import CancelCheckoutView
from src.domain.checkout.repository.postgresql_repository_checkout_basket import (
    CheckoutBasketPostgresqlRepository,
)
from src.domain.checkout.use_cases.cancel_checkout_basket import (
    CancelCheckoutBasketUseCase,
)
from src.domain.checkout.models.checkout_basket import CheckoutBasketCancelStatues
from src.services.logging import logger
from src.utils.exceptions import ConflictException

logger = logger.bind(service="checkout", context="controller", action="cancel checkout basket")


class CancelCheckoutBasketController(BaseController):
    session_basket_id: UUID

    def __init__(self, session_basket_id: str, status: CheckoutBasketCancelStatues):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = CheckoutBasketPostgresqlRepository()
        self.session_basket_id = uuid.UUID(session_basket_id)
        self.status = status

    def execute(self):
        logger.debug("execute")
        try:
            use_case = CancelCheckoutBasketUseCase(self.repository, self.session_basket_id, self.status)
            output_dto = use_case.execute()
            if output_dto is None:
                return CancelCheckoutView.show_not_found_error()
            result = CancelCheckoutView.show(output_dto)
            return result
        except ConflictException as exception:
            logger.error("Failed to cancel checkout basket %s" % str(exception))
            return CancelCheckoutView.show_conflict_error(exception)
        except Exception as exception:
            logger.error("Failed to cancel checkout basket %s" % str(exception))
            return CancelCheckoutView.show_error(exception)
