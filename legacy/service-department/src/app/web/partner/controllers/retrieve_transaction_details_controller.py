from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.domain.partner.repository.postgresql_repository_bank_account import BankAccountRepository
from src.domain.partner.use_cases.retrieve_transaction_details import RetrieveTransactionDetailsUseCase
from src.domain.partner.dtos.retrieve_partner_transaction_details_dtos import InputDto, OutputDto
from src.services.logging import logger

logger = logger.bind(service="partner", context="controller", action="retrieve transaction details")


class RetrieveTransactionDetailsController(BaseController):
    def __init__(self, partner_id, basket_id):
        super().__init__(BaseDB=BaseDBModel)
        self.checkout_basket_repositroy = CheckoutBasketPostgresqlRepository()
        self.user_profile_repository = UserProfileRepository()
        self.bank_account_repository = BankAccountRepository()
        self.input_dto = InputDto(partner_id=partner_id, transaction_id=basket_id)

    def execute(self):
        logger.debug("execute")
        try:
            use_case = RetrieveTransactionDetailsUseCase(
                checkout_basket_repository=self.checkout_basket_repositroy,
                user_profile_repository=self.user_profile_repository,
                bank_account_repository=self.bank_account_repository,
                input_dto=self.input_dto,
            )
            output_dto: OutputDto = use_case.execute()
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
