from src.domain.checkout.dtos.update_checkout_basket_loan_id_dto import UpdateCheckoutBasketLoanIdInputDto
from src.services.logging import logger
from src.domain.checkout.repository.repository_interface import (
    CheckoutBasketRepositoryInterface,
)

logger = logger.bind(service="checkout", context="use case", action="update checkout basket loan id")


class UpdateCheckoutBasketLoanIdUseCase:
    repository: CheckoutBasketRepositoryInterface
    input_dto: UpdateCheckoutBasketLoanIdInputDto

    def __init__(
        self,
        repository: CheckoutBasketRepositoryInterface,
        input_dto: UpdateCheckoutBasketLoanIdInputDto,
    ):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self):
        logger.debug("execute")
        checkout_basket = self.repository.find_by_basket_id(self.input_dto.id)
        if checkout_basket is None:
            logger.error("Checkout basket doesn't exist")
            raise Exception("Checkout basket doesn't exist")
        checkout_basket.update_loan_id(self.input_dto.loan_id)
        updated_basket = self.repository.save_checkout_basket(checkout_basket)
        if updated_basket is None:
            logger.error("Basket loan id not updated")
            raise Exception("Basket loan id not updated")
        return updated_basket
