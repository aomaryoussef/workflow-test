from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout_basket import ResendOtpViaPhoneCallView
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.resend_checkout_otp_via_phone_call import ResendCheckoutOtpViaPhoneCallUseCase
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.services.logging import logger

logger = logger.bind(service="checkout", context="controller", action="resend checkout otp via phone call")


class ResendCheckoutOtpViaPhoneCallController(BaseController):
    session_basket_id: UUID

    def __init__(self, session_basket_id: str):
        super().__init__(BaseDB=BaseDBModel)
        self.consumer_repository = ConsumerPostgresqlRepository()
        self.checkout_repository = CheckoutBasketPostgresqlRepository()
        self.session_basket_id = UUID(session_basket_id)

    def execute(self):
        """Execute the resend checkout otp via phone call"""
        logger.debug("execute")
        try:
            use_case = ResendCheckoutOtpViaPhoneCallUseCase(
                consumer_repository=self.consumer_repository,
                checkout_repository=self.checkout_repository,
                session_basket_id=self.session_basket_id,
            )
            response = use_case.execute()
            if response is None:
                return ResendOtpViaPhoneCallView.show_error()
            result = ResendOtpViaPhoneCallView.show(response)
            return result
        except Exception as exception:
            logger.error("Failed to resend checkout otp via phone call %s" % str(exception))
            return ResendOtpViaPhoneCallView.show_error(exception)
