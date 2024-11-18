from uuid import UUID
import uuid
from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout_basket import RetrieveCommercialOffersView
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.retrieve_commercial_offers import RetrieveCommercialOffersUseCase
from src.services.logging import logger

logger = logger.bind(service="checkout", context="controller", action="retrieve commercial offers")


class RetrieveCommercialOffersController(BaseController):
    session_basket_id: UUID

    def __init__(self, session_basket_id: str):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = CheckoutBasketPostgresqlRepository()
        self.session_basket_id = uuid.UUID(session_basket_id)

    def execute(self):
        """Execute the get commercial offers"""
        logger.debug("execute")
        try:
            use_case = RetrieveCommercialOffersUseCase(self.repository, self.session_basket_id)
            output_dto = use_case.execute()
            if output_dto is None:
                return RetrieveCommercialOffersView.show([])
            result = RetrieveCommercialOffersView.show(output_dto)
            return result
        except Exception as exception:
            logger.error("Failed to retrieve commercial offers %s" % str(exception))
            return RetrieveCommercialOffersView.show_error(exception)
