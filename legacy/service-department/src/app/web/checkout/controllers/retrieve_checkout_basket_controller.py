from uuid import UUID
import uuid
from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout_basket import RetrieveCheckoutBasketView
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.retrieve_checkout_basket import RetrieveCheckoutBasketUseCase
from src.services.logging import logger

logger = logger.bind(service="checkout", context="controller", action="retrieve checkout basket")


class RetrieveCheckoutBasketController(BaseController):
    session_basket_id: UUID

    def __init__(self, session_basket_id: str):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = CheckoutBasketPostgresqlRepository()
        self.session_basket_id = uuid.UUID(session_basket_id)

    def execute(self):
        logger.debug("execute")
        try:
            use_case = RetrieveCheckoutBasketUseCase(self.repository, self.session_basket_id)
            output_dto = use_case.execute()
            if output_dto is None:
                return RetrieveCheckoutBasketView.show_not_found_error()
            result = RetrieveCheckoutBasketView.show(output_dto)
            return result
        except Exception as exception:
            logger.error("Failed to retrieve checkout basket %s" % str(exception))
            return RetrieveCheckoutBasketView.show_error(exception)
