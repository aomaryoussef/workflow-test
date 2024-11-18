from src.services.logging import logger
from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.domain.checkout.dtos.is_checkout_in_progress_dtos import InputDto, OutputDto
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus

logger = logger.bind(service="checkout", context="use case", action="is checkout in progress")


class IsCheckoutInProgressUseCase:
    def __init__(self, repository: CheckoutBasketRepositoryInterface, input_dto: InputDto):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        logger.info("Is checkout in progress")
        in_progress_statuses = [
            CheckoutBasketStatus.COMMERCIAL_OFFER_SELECTED,
            CheckoutBasketStatus.CREATED,
            CheckoutBasketStatus.COMMERCIAL_OFFERS_GENERATED,
            CheckoutBasketStatus.DOWN_PAYMENT_ACCEPTED,
        ]
        logger.info("find consumer")
        consumer_checkout_baskets = self.repository.find_by_consumer_id(
            consumer_id=self.input_dto.consumer_id,
            checkout_basket_id=self.input_dto.checkout_basket_id,
            statuses=in_progress_statuses,
        )
        logger.info("consumer found")
        output_dto: OutputDto = OutputDto(result=False)
        if len(consumer_checkout_baskets) > 0:
            logger.debug("consumer already has a checkout basket in progress")
            output_dto.result = True
        return output_dto
