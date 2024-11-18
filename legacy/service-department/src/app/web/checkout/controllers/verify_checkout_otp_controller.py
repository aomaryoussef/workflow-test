from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout_basket import VerifyCheckoutOtpView
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.checkout.use_cases.verify_checkout_otp import VerifyCheckoutOtpUseCase
from src.services.logging import logger

logger = logger.bind(service="checkout", context="controller", action="verify checkout otp")


class VerifyCheckoutOtpController(BaseController):
    session_basket_id: UUID
    otp: str

    def __init__(self, session_basket_id: str, otp: str):
        super().__init__(BaseDB=BaseDBModel)
        self.consumer_repository = ConsumerPostgresqlRepository()
        self.checkout_repository = CheckoutBasketPostgresqlRepository()
        self.session_basket_id = UUID(session_basket_id)
        self.otp = otp

    def execute(self):
        """Execute the verify checkout otp"""
        logger.debug("execute")
        try:
            use_case = VerifyCheckoutOtpUseCase(
                consumer_repository=self.consumer_repository,
                checkout_repository=self.checkout_repository,
                session_basket_id=self.session_basket_id,
                otp=self.otp,
            )
            status = use_case.execute()
            if status is None:
                return VerifyCheckoutOtpView.show_error()
            result = VerifyCheckoutOtpView.show(status)
            return result
        except Exception as exception:
            logger.error("Failed to verify checkout otp %s" % str(exception))
            return VerifyCheckoutOtpView.show_error(exception)
