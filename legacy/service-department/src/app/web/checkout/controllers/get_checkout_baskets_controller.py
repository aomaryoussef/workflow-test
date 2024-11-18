from typing import Optional
from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout import CheckoutViews
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.get_checkout_baskets import GetCheckoutBasketsUseCase
from src.domain.checkout.dtos.get_checkout_baskets_dtos import InputDto, OutputDto
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus
from src.services.logging import logger

logger = logger.bind(service="checkout", context="controller", action="get checkout baskets")


class GetCheckoutBasketsController(BaseController):
    consumer_id: Optional[UUID]
    statues: list[CheckoutBasketStatus]

    def __init__(self, consumer_id: Optional[UUID], statuses: list[CheckoutBasketStatus]):
        super().__init__(BaseDB=BaseDBModel)
        self.checkout_repository = CheckoutBasketPostgresqlRepository()
        self.partner_repository = PartnerRepository()
        consumer_id = UUID(consumer_id) if consumer_id is not None else None
        self.input_dto = InputDto(consumer_id=consumer_id, statuses=statuses)

    def execute(self):
        logger.debug("execute")
        try:
            use_case = GetCheckoutBasketsUseCase(
                checkout_repository=self.checkout_repository,
                partner_repository=self.partner_repository,
                input_dto=self.input_dto,
            )
            output_dto: OutputDto = use_case.execute()
            result = CheckoutViews.show(output_dto)
            return result
        except Exception as exception:
            return CheckoutViews.error(exception)
