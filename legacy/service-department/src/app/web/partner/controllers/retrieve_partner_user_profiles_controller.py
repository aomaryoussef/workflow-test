from typing import Dict
from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.domain.partner.use_cases.retrieve_partner_user_profiles import RetrievePartnerUserProfilesUseCase
from src.services.logging import logger

logger = logger.bind(service="partner", context="controller", action="retrieve partner user profiles")


class RetrievePartnerUserProfilesController(BaseController):
    """Init Partner Controller Class"""

    def __init__(self, iam_id=None, partner_id=None, type=None, page=None, per_page=None):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = UserProfileRepository()
        self.iam_id = iam_id
        self.partner_id = partner_id
        self.type = type
        self.page = page
        self.per_page = per_page

    def execute(self) -> Dict:
        """Execute the retrieve all partners controller"""
        logger.debug("execute")
        try:
            use_case = RetrievePartnerUserProfilesUseCase(self.repository)
            output_dto = use_case.execute(self.iam_id, self.partner_id, self.type, self.page, self.per_page)
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
