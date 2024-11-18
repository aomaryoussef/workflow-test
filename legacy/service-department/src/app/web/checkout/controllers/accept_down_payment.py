from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout_basket import AcceptDownPaymentView
from src.domain.checkout.repository.postgresql_repository_checkout_basket import (
    CheckoutBasketPostgresqlRepository,
)
from src.domain.checkout.use_cases.accept_down_payment import AcceptDownPaymentUseCase
import structlog

logger = structlog.get_logger()


class AcceptDownPaymentController(BaseController):
    session_basket_id: UUID

    def __init__(self, session_basket_id: str):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = CheckoutBasketPostgresqlRepository()
        self.session_basket_id = UUID(session_basket_id)

    def execute(self):
        """Execute activate loan"""
        logger.debug("execute")
        try:
            use_case = AcceptDownPaymentUseCase(self.repository, self.session_basket_id)
            output_dto = use_case.execute()
            if output_dto is None:
                return AcceptDownPaymentView.show_error("حدث خطأ في النظام")
            result = AcceptDownPaymentView.show(output_dto)
            return result
        except Exception as exception:
            return AcceptDownPaymentView.show_error(exception)
