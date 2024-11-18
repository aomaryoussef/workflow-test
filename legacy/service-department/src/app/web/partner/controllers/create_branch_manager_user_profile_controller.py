from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.dtos.create_partner_user_profile_dtos import InputDto
from src.domain.partner.use_cases.create_branch_manager_user_profile import (
    CreateBranchManagerUserProfileUseCase
)
from src.services.logging import logger

from src.domain.partner.repository.postgresql_repository_user_profile import (
    UserProfileRepository,
)

from uuid import UUID

logger = logger.bind(service="partner", context="controller", action="create user profile")


class CreateBranchManagerUserProfileController(BaseController):
    """Init BranchManagerUserProfile Controller Class"""

    def __init__(self, json_input, partner_id: UUID):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = UserProfileRepository()
        self.input_dto: InputDto = InputDto(
            partner_id=partner_id,
            first_name=json_input.get("first_name"),
            last_name=json_input.get("last_name"),
            phone_number=(
                json_input.get("phone_number","")
                if json_input.get("phone_number") is None or json_input.get("phone_number").startswith("+2")
                else "+2" + json_input.get("phone_number")
            ),
            email=json_input.get("email"),
            national_id=json_input.get("national_id", None),
            branch_id=json_input.get("branch_id"),
        )

    def execute(self):
        """Execute the create BranchManagerUserProfile controller"""
        logger.debug("execute")
        try:
            use_case = CreateBranchManagerUserProfileUseCase(self.repository)
            output_dto = use_case.execute(self.input_dto)
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
