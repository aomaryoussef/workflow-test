from typing import Dict
from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.domain.partner.use_cases.retrieve_cashier_profile import RetrieveCashierProfileUseCase
from src.domain.partner.dtos.retrieve_cashier_profile_dtos import InputDto, OutputDto
from src.services.logging import logger

logger = logger.bind(service="partner", context="controller", action="retrieve cashier profile")


class RetrieveCashierProfileController(BaseController):
    """Init Partner Controller Class"""

    def __init__(self, iam_id=None):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = UserProfileRepository()
        self.input_dto = InputDto(iam_id=iam_id)

    def execute(self) -> Dict:
        """Execute the retrieve cashier profile controller"""
        logger.debug("execute")
        try:
            use_case = RetrieveCashierProfileUseCase(self.repository, self.input_dto)
            output_dto: OutputDto = use_case.execute()
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
