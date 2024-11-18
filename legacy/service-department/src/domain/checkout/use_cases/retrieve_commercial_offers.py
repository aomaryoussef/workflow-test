from typing import Any
import uuid
import structlog

from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface

logger = structlog.get_logger()


class RetrieveCommercialOffersUseCase:
    """This class is responsible for retrieve all partners."""

    def __init__(self, repository: CheckoutBasketRepositoryInterface, session_basket_id: uuid):
        self.repository = repository
        self.session_basket_id = session_basket_id

    def execute(self) -> list[dict[str, Any]]:
        logger.debug("retrieve all partners use case - execute")

        commercial_offers = self.repository.get_commercial_offers(self.session_basket_id)
        return commercial_offers
