from typing import Dict
from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.domain.partner.use_cases.update_user_profile import UpdateUserProfileUseCase
from src.services.logging import logger


logger = logger.bind(service="partner", context="controller", action="update user profile")


class UpdateUserProfileController(BaseController):
    def __init__(self, partner_id, user_profile_id, body):
        super().__init__(BaseDB=BaseDBModel)
        self.user_profile_repository = UserProfileRepository()
        self.partner_id = partner_id
        self.user_profile_id = user_profile_id
        self.body = body

    def execute(self) -> Dict:
        """Execute the retrieve all partners controller"""
        logger.debug("execute")
        try:
            use_case = UpdateUserProfileUseCase(self.user_profile_repository)
            output = use_case.execute(self.partner_id, self.user_profile_id, self.body)
            result = PartnerViews.show(output)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
