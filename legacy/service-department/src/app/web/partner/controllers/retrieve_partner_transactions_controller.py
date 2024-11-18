from typing import Dict
from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.domain.partner.use_cases.retrieve_partner_transactions import RetrievePartnerTransactionsUseCase
from src.domain.partner.dtos.retrieve_partner_trasnactions_dtos import InputDto, OutputDto


class RetrievePartnerTransactionsController(BaseController):
    def __init__(self, partner_id, page=1, per_page=10):
        super().__init__(BaseDB=BaseDBModel)
        self.checkout_basket_repositroy = CheckoutBasketPostgresqlRepository()
        self.user_profile_repository = UserProfileRepository()
        self.input_dto = InputDto(partner_id=partner_id, page=page, per_page=per_page)

    def execute(self) -> Dict:
        try:
            use_case = RetrievePartnerTransactionsUseCase(
                checkout_basket_repository=self.checkout_basket_repositroy,
                user_profile_repository=self.user_profile_repository,
                input_dto=self.input_dto,
            )
            output_dto: OutputDto = use_case.execute()
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
