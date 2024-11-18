from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.use_cases.retrieve_top_partners import RetrieveTopPartnersUseCase
from src.services.logging import logger

from src.domain.partner.repository.postgresql_repository_top_partner import TopPartnerRepository

logger = logger.bind(service="partner", context="controller", action="retrieve top partners")


class RetrieveTopPartnersController(BaseController):
    """Init Partner Controller Class"""

    def __init__(self):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = TopPartnerRepository()

    def execute(self):
        """Execute the retrieve top partners controller"""
        logger.debug("execute")
        try:
            use_case = RetrieveTopPartnersUseCase(self.repository)
            output_dto = use_case.execute()
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.show_error(exception)
        return result
