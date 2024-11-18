from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.dtos.create_partner_user_profile_dtos import InputDto
from src.domain.partner.use_cases.create_cashier_user_profile import (
    CreateCashierUserProfileUseCase,
)
from src.services.logging import logger

from src.domain.partner.repository.postgresql_repository_user_profile import (
    UserProfileRepository,
)

from uuid import UUID

logger = logger.bind(service="partner", context="controller", action="create user profile")


class CreateUserProfileController(BaseController):
    """Init UserProfile Controller Class"""

    def __init__(self, json_input, partner_id: UUID):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = UserProfileRepository()
        self.input_dto: InputDto = InputDto(
            partner_id=partner_id,
            first_name=json_input.get("first_name"),
            last_name=json_input.get("last_name"),
            phone_number=(
                json_input.get("phone_number")
                if json_input.get("phone_number").startswith("+2")
                else "+2" + json_input.get("phone_number")
            ),
            email=json_input.get("email", None),
            national_id=json_input.get("national_id", None),
            branch_id=json_input.get("branch_id", None),
        )

    def execute(self):
        """Execute the create user_profile controller"""
        logger.debug("execute")
        try:
            use_case = CreateCashierUserProfileUseCase(self.repository)
            output_dto = use_case.execute(self.input_dto)
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
