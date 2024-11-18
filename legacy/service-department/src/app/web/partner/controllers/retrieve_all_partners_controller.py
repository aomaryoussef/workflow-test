from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.use_cases.retrieve_all_partners import RetrieveAllPartnersUseCase
from src.services.logging import logger

from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository

logger = logger.bind(service="partner", context="controller", action="retrieve all partners")


class RetrieveAllPartnersController(BaseController):
    """Init Partner Controller Class"""

    def __init__(self):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = PartnerRepository()

    def execute(self):
        """Execute the retrieve all partners controller"""
        logger.debug("execute")
        try:
            use_case = RetrieveAllPartnersUseCase(self.repository)
            output_dto = use_case.execute()
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
