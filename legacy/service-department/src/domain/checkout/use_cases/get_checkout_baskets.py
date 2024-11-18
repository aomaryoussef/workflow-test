from src.services.logging import logger
from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.domain.checkout.dtos.get_checkout_baskets_dtos import InputDto, OutputDto, CustomCheckoutBasket
from src.domain.partner.repository.repository_partner_interface import PartnerRepositoryInterface
from src.utils.exceptions import NotFoundException

logger = logger.bind(service="checkout", context="use case", action="get consumer checkout baskets")


class GetCheckoutBasketsUseCase:
    def __init__(
        self,
        checkout_repository: CheckoutBasketRepositoryInterface,
        partner_repository: PartnerRepositoryInterface,
        input_dto: InputDto,
    ):
        self.checkout_repository = checkout_repository
        self.partner_repository = partner_repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        consumer_checkout_baskets = self.checkout_repository.find_all_for_consumer_by_statuses(
            consumer_id=self.input_dto.consumer_id,
            statuses=self.input_dto.statuses,
        )

        partner_ids = [str(checkout_basket.partner_id) for checkout_basket in consumer_checkout_baskets]
        partners = self.partner_repository.get_names_by_ids(set(partner_ids))
        if len(partners) == 0:
            raise NotFoundException("Partners not found in the database")
        partners_by_id = {str(partner[1]): partner[0] for partner in partners}
        checkout_baskets = []
        for consumer_checkout_basket in consumer_checkout_baskets:
            partner_name = partners_by_id.get(str(consumer_checkout_basket.partner_id))
            checkout_baskets.append(
                CustomCheckoutBasket(
                    partner_id=consumer_checkout_basket.partner_id,
                    partner_name=partner_name,
                    products=consumer_checkout_basket.products,
                    branch_id=consumer_checkout_basket.branch_id,
                    loan_id=consumer_checkout_basket.loan_id,
                    category=consumer_checkout_basket.category,
                    basket_id=consumer_checkout_basket.id,
                    gross_basket_value=consumer_checkout_basket.gross_basket_value,
                    status=consumer_checkout_basket.status,
                    consumer_id=consumer_checkout_basket.consumer_id,
                    created_at=consumer_checkout_basket.created_at,
                    session_basket_id=consumer_checkout_basket.session_basket_id,
                    transaction_id=consumer_checkout_basket.transaction_id,
                )
            )
        output_dto = OutputDto(checkout_baskets=checkout_baskets)
        return output_dto
