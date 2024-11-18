from src.domain.checkout.dtos.create_commercial_offers_dto import CreateCommercialOffersInputDto
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus
from src.services.logging import logger
from src.domain.checkout.repository.repository_interface import (
    CheckoutBasketRepositoryInterface,
)

logger = logger.bind(service="checkout", context="use case", action="create commercial offers")


class CreateCommercialOffersUseCase:
    repository: CheckoutBasketRepositoryInterface
    input_dto: CreateCommercialOffersInputDto

    def __init__(
        self,
        repository: CheckoutBasketRepositoryInterface,
        input_dto: CreateCommercialOffersInputDto,
    ):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self):
        # validator = CreateCommercialOffersInputValidator(self.input_dto.to_dict())
        # validator.validate()
        checkout_basket = self.repository.find_by_workflow_id(self.input_dto.workflow_id)
        if checkout_basket is None:
            logger.error("Checkout basket doesn't exist")
            raise Exception("Checkout basket doesn't exist")
        checkout_basket.status = CheckoutBasketStatus.COMMERCIAL_OFFERS_GENERATED
        checkout_basket.commercial_offers = self.input_dto.offer_details
        updated_basket = self.repository.save_checkout_basket(checkout_basket)
        if updated_basket is None:
            logger.error("Commercial offers not stored")
            raise Exception("Commercial offers not stored")
        return updated_basket
