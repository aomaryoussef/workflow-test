from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout_basket import SelectCommercialOfferView
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.select_commercial_offer import SelectCommercialOfferUseCase
from src.services.logging import logger

logger = logger.bind(service="checkout", context="controller", action="select commercial offer")


class SelectCommercialOfferController(BaseController):
    session_basket_id: UUID
    selected_offer_id: UUID

    def __init__(self, session_basket_id: str, selected_offer_id: str):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = CheckoutBasketPostgresqlRepository()
        self.session_basket_id = UUID(session_basket_id)
        self.selected_offer_id = UUID(selected_offer_id)

    def execute(self):
        """Execute the get commercial offers"""
        logger.debug("execute")
        try:
            use_case = SelectCommercialOfferUseCase(self.repository, self.selected_offer_id, self.session_basket_id)
            output_dto = use_case.execute()
            if output_dto is None:
                return SelectCommercialOfferView.show_error("حدث خطأ في النظام")
            result = SelectCommercialOfferView.show(output_dto)
            return result
        except Exception as exception:
            logger.error("Failed to select commercial offer, %s" % str(exception))
            return SelectCommercialOfferView.show_error(exception)
