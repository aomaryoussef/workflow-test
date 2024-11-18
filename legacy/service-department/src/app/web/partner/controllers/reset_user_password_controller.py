from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.domain.partner.dtos.reset_user_password_dtos import ResetUserPasswordInputDto, ResetUserPasswordOutputDto
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.domain.partner.use_cases.reset_user_password import ResetUserPasswordUseCase
from src.app.web.partner.views.partner import PartnerViews
from src.services.logging import logger


logger = logger.bind(service="partner", context="controller", action="reset password")


class ResetUserPasswordController(BaseController):
    """Init Reset User Password Controller Class"""

    def __init__(self, json_input) -> None:
        super().__init__(BaseDB=BaseDBModel)
        self.user_profile_repository = UserProfileRepository()
        self.input_dto: ResetUserPasswordInputDto = ResetUserPasswordInputDto(identifier=json_input["identifier"])

    def execute(self):
        """Execute the controller"""
        logger.debug("execute")
        try:
            use_case = ResetUserPasswordUseCase(self.user_profile_repository)
            output_dto: ResetUserPasswordOutputDto = use_case.execute(self.input_dto)
            if output_dto is None:
                result = PartnerViews.error("Unable to reset password")
            else:
                result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
