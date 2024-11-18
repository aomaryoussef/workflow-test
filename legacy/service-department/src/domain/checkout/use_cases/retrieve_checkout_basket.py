from typing import Optional
import uuid
import structlog
from src.domain.checkout.dtos.retrieve_checkout_basket_dto import (
    RetrieveCheckoutBasketOutputDto,
)

from src.domain.checkout.repository.repository_interface import (
    CheckoutBasketRepositoryInterface,
)

logger = structlog.get_logger()


class RetrieveCheckoutBasketUseCase:
    def __init__(self, repository: CheckoutBasketRepositoryInterface, session_basket_id: uuid):
        self.repository = repository
        self.session_basket_id = session_basket_id

    def execute(self) -> Optional[RetrieveCheckoutBasketOutputDto]:
        logger.debug("retrieve checkout basket use case - execute")

        checkout_basket = self.repository.find_by_session_basket_id(self.session_basket_id)
        if checkout_basket is None:
            return None
        return RetrieveCheckoutBasketOutputDto(checkout_basket=checkout_basket)
