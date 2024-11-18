from src.domain.checkout.dtos.update_checkout_basket_status_dto import UpdateCheckoutBasketStatusInputDto
from src.services.logging import logger
from src.domain.checkout.repository.repository_interface import (
    CheckoutBasketRepositoryInterface,
)

logger = logger.bind(service="checkout", context="use case", action="update checkout basket status")


class UpdateCheckoutBasketStatusUseCase:
    repository: CheckoutBasketRepositoryInterface
    input_dto: UpdateCheckoutBasketStatusInputDto

    def __init__(
        self,
        repository: CheckoutBasketRepositoryInterface,
        input_dto: UpdateCheckoutBasketStatusInputDto,
    ):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self):
        logger.debug("execute")
        checkout_basket = self.repository.find_by_workflow_id(self.input_dto.workflow_id)
        if checkout_basket is None:
            logger.error("Checkout basket doesn't exist")
            raise Exception("Checkout basket doesn't exist")
        checkout_basket.update_status(self.input_dto.status)
        logger.debug("Updated checkout basket status")
        updated_basket = self.repository.save_checkout_basket(checkout_basket)
        logger.debug("Saved checkout basket")
        if updated_basket is None:
            logger.error("Basket status not updated")
            raise Exception("Basket status not updated")
        return updated_basket
