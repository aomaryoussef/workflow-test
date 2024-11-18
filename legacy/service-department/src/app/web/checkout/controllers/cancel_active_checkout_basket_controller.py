from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout_basket import CancelActiveCheckoutView
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.checkout.use_cases.cancel_consumer_active_checkout import CancelConsumerActiveCheckoutUseCase
from src.services.logging import logger

logger = logger.bind(service="checkout", context="controller", action="cancel active checkout basket")


class CancelActiveCheckoutBasketController(BaseController):
    def __init__(self, consumer_phone_number: str):
        super().__init__(BaseDB=BaseDBModel)
        self.consumer_repository = ConsumerPostgresqlRepository()
        self.checkout_repository = CheckoutBasketPostgresqlRepository()
        self.consumer_phone_number = (
            consumer_phone_number if consumer_phone_number.startswith("+2") else "+2" + consumer_phone_number
        )

    def execute(self):
        logger.debug("execute")
        try:
            use_case = CancelConsumerActiveCheckoutUseCase(
                consumer_repository=self.consumer_repository,
                checkout_repository=self.checkout_repository,
                consumer_phone_number=self.consumer_phone_number,
            )
            output_dto = use_case.execute()
            if output_dto is None:
                return CancelActiveCheckoutView.show_error("")
            result = CancelActiveCheckoutView.show()
            return result
        except Exception as exception:
            logger.error("Failed to cancel active checkout basket %s" % str(exception))
            return CancelActiveCheckoutView.show_error(exception)
